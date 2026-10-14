/* eslint @typescript-eslint/no-require-imports: "off" -- Execute the real client component/effect in an isolated Node harness. */
const test = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { randomUUID, webcrypto } = require('node:crypto')
const vm = require('node:vm')
const ts = require('typescript')

const consentKey = 'rk_consent_v1'
const sessionKey = 'rk_capi_session'
const approved = overrides => ({ version: 3, analytics: true, marketing: true, savedAt: Date.now(), ...overrides })
const compiled = new Map([
  ['consent', 'src/lib/consent.ts'],
  ['trackingContext', 'src/lib/trackingContext.ts'],
  ['ConsentManager', 'src/components/ConsentManager.tsx'],
].map(([name, file]) => [name, ts.transpileModule(readFileSync(resolve(__dirname, '..', file), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText]))

function harness({ consent = approved(), sessionId = randomUUID(), path = '/kontakt', loadedTracking = false } = {}) {
  const log = [], requests = [], effects = [], cleanups = [], timers = []
  const listeners = new Map()
  const localValues = new Map()
  const sessionValues = new Map()
  if (consent !== null) localValues.set(consentKey, JSON.stringify(consent))
  if (sessionId !== null) sessionValues.set(sessionKey, sessionId)
  const localStorage = {
    getItem: key => localValues.get(key) ?? null,
    setItem: (key, value) => localValues.set(key, String(value)),
    removeItem: key => localValues.delete(key),
  }
  const sessionStorage = {
    getItem: key => sessionValues.get(key) ?? null,
    setItem: (key, value) => { log.push('session-created'); sessionValues.set(key, String(value)) },
    removeItem: key => { log.push('session-removed'); sessionValues.delete(key) },
  }
  const context = vm.createContext({
    URL, Date, Set, TextEncoder, crypto: webcrypto, localStorage, sessionStorage,
    location: { pathname: path, hostname: 'rk-gaggenau.de', reload: () => { log.push('reload') } },
    document: { cookie: '' },
    window: {
      setTimeout: callback => { timers.push(callback); return timers.length },
      addEventListener: (name, callback) => { if (!listeners.has(name)) listeners.set(name, new Set()); listeners.get(name).add(callback) },
      removeEventListener: (name, callback) => listeners.get(name)?.delete(callback),
    },
    clearTimeout() {},
    fetch: (url, options) => {
      log.push('withdraw-request')
      requests.push({ url, options: JSON.parse(JSON.stringify(options)) })
      return Promise.resolve({ ok: true })
    },
  })
  const modules = new Map()
  const jsx = (type, props) => ({ type, props })
  function load(name) {
    if (name === 'react') return { useEffect: effect => effects.push(effect), useState: initial => [initial, () => {}] }
    if (name === 'react/jsx-runtime') return { jsx, jsxs: jsx, Fragment: 'Fragment' }
    if (name === 'next/navigation') return { usePathname: () => path }
    if (name === '@/lib/tracking') return {
      configureTracking: () => log.push('configure'), privatePage: () => /^\/(admin|api)(\/|$)/.test(path),
      syncTracking: () => log.push('sync'), trackingStarted: () => loadedTracking,
    }
    if (name === '@/lib/marketingAttribution') return { captureMarketingAttribution: () => log.push('attribution') }
    name = name.replace(/^@\/lib\//, '').replace(/^\.\//, '')
    if (modules.has(name)) return modules.get(name).exports
    if (!compiled.has(name)) throw new Error(`Forbidden unexpected import: ${name}`)
    const loaded = { exports: {} }
    modules.set(name, loaded)
    vm.runInContext(`(function(exports, require, module) {\n${compiled.get(name)}\n})`, context)(loaded.exports, load, loaded)
    return loaded.exports
  }
  const component = load('ConsentManager').default
  return {
    log, requests, sessionValues, sessionId,
    mount: () => {
      component({ trackingEnabled: true })
      for (const effect of effects.splice(0)) {
        const cleanup = effect()
        if (typeof cleanup === 'function') cleanups.push(cleanup)
      }
    },
    unmount: () => { for (const cleanup of cleanups.splice(0)) cleanup() },
    updateConsent: value => {
      if (value === null) localValues.delete(consentKey)
      else localValues.set(consentKey, JSON.stringify(value))
    },
    storageEvent: key => { for (const callback of listeners.get('storage') ?? []) callback({ key }) },
  }
}
function assertCancellation(app) {
  assert.equal(app.requests.length, 1)
  assert.equal(app.requests[0].url, '/api/tracking/withdraw')
  assert.equal(app.requests[0].options.method, 'POST')
  assert.equal(app.requests[0].options.keepalive, true)
  assert.deepEqual(JSON.parse(app.requests[0].options.body), { session_id: app.sessionId })
  assert.equal(app.sessionValues.get(sessionKey), undefined)
  assert.ok(!app.log.includes('session-created'))
}
for (const [label, consent] of [
  ['no saved consent', null],
  ['Marketing denied', approved({ marketing: false })],
  ['old consent version', approved({ version: 2 })],
  ['expired consent', approved({ savedAt: Date.now() - 181 * 86400000 })],
  ['future consent', approved({ savedAt: Date.now() + 86400000 })],
]) test(`actual startup effect cancels an existing session with ${label}`, () => {
  const app = harness({ consent })
  app.mount()
  assertCancellation(app)
  assert.ok(app.log.indexOf('withdraw-request') < app.log.indexOf('sync'))
})

test('active Marketing startup preserves the existing legitimate session', () => {
  const app = harness()
  app.mount()
  assert.equal(app.requests.length, 0)
  assert.equal(app.sessionValues.get(sessionKey), app.sessionId)
  assert.ok(!app.log.includes('session-created'))
})
test('startup without consent and without a session creates neither an identifier nor a request', () => {
  const app = harness({ consent: null, sessionId: null })
  app.mount()
  assert.equal(app.requests.length, 0)
  assert.equal(app.sessionValues.size, 0)
  assert.ok(!app.log.includes('session-created'))
})
for (const [label, consent, eventKey] of [
  ['Marketing withdrawn', approved({ marketing: false }), consentKey],
  ['all storage cleared', null, null],
  ['consent removed', null, consentKey],
  ['consent becomes stale', approved({ savedAt: Date.now() - 181 * 86400000 }), consentKey],
  ['consent version invalidated', approved({ version: 2 }), consentKey],
]) test(`actual cross-tab storage effect cancels before reload when ${label}`, () => {
  const app = harness()
  app.mount()
  assert.equal(app.requests.length, 0)
  app.updateConsent(consent)
  app.storageEvent(eventKey)
  assertCancellation(app)
  assert.ok(app.log.indexOf('withdraw-request') < app.log.indexOf('reload'))
})
test('an analytics-only cross-tab change reloads but keeps the Marketing session', () => {
  const app = harness()
  app.mount()
  app.updateConsent(approved({ analytics: false }))
  app.storageEvent(consentKey)
  assert.equal(app.requests.length, 0)
  assert.equal(app.sessionValues.get(sessionKey), app.sessionId)
  assert.ok(app.log.includes('reload'))
})
test('unrelated storage events do not reload or cancel a session', () => {
  const app = harness()
  app.mount()
  app.updateConsent(approved({ marketing: false }))
  app.storageEvent('unrelated-preference')
  assert.equal(app.requests.length, 0)
  assert.ok(!app.log.includes('reload'))
})
test('effect cleanup removes the cross-tab listener on unmount', () => {
  const app = harness()
  app.mount()
  app.unmount()
  app.updateConsent(approved({ marketing: false }))
  app.storageEvent(consentKey)
  assert.equal(app.requests.length, 0)
  assert.ok(!app.log.includes('reload'))
})
test('stale consent cancels the leftover session before a loaded-tracker private-page reload', () => {
  const app = harness({ consent: null, path: '/admin/crm-system', loadedTracking: true })
  app.mount()
  assertCancellation(app)
  assert.ok(app.log.indexOf('withdraw-request') < app.log.indexOf('reload'))
  assert.ok(!app.log.includes('sync'))
})