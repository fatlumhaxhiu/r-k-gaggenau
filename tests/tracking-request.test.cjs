/* eslint @typescript-eslint/no-require-imports: "off" -- Node runner transpiles the isolated server modules. */
const test = require('node:test')
const assert = require('node:assert/strict')
const { readFileSync } = require('node:fs')
const { resolve } = require('node:path')
const { createHash } = require('node:crypto')
const vm = require('node:vm')
const ts = require('typescript')

function load(env = {}) {
  const context = vm.createContext({ URL, Date, Set, TextDecoder, process: { env } })
  const modules = new Map()
  function moduleFor(name) {
    if (modules.has(name)) return modules.get(name)
    const compiled = ts.transpileModule(readFileSync(resolve(__dirname, `../src/lib/${name}.ts`), 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    }).outputText
    const loaded = { exports: {} }
    const execute = vm.runInContext(`(function(exports, require, module) {\n${compiled}\n})`, context)
    execute(loaded.exports, dependency => {
      if (dependency === 'server-only') return {}
      if (dependency === 'node:crypto' || dependency === 'node:net') return require(dependency)
      if (dependency === './metaConversions') return moduleFor('metaConversions')
      throw new Error(`Unexpected import ${dependency}`)
    }, loaded)
    modules.set(name, loaded.exports)
    return loaded.exports
  }
  return moduleFor('trackingRequest')
}
const helper = load({ NODE_ENV: 'production' })
const trusted = load({ NODE_ENV: 'production', META_CAPI_TRUST_PROXY_HEADERS: '1' })
const proxyOrigin = load({ NODE_ENV: 'production', META_CAPI_ALLOW_INTERNAL_ORIGIN: '1' })
const development = load({ NODE_ENV: 'development' })
const unitTest = load({ NODE_ENV: 'test' })
const clone = value => JSON.parse(JSON.stringify(value))
const hash = value => createHash('sha256').update(value, 'utf8').digest('hex')
const session = '11111111-2222-4333-8444-555555555555'
const otherSession = 'aaaaaaaa-bbbb-4ccc-9ddd-eeeeeeeeeeee'
const now = Date.now()
const consent = { version: 3, marketing: true, savedAt: now }
const tracking = change => ({ consent, session_id: session, ...change })
const request = (headers = {}, url = 'https://rk-gaggenau.de/api/tracking/page-view') => new Request(url, { headers })
function fakeRequest(headers = {}, url = 'https://rk-gaggenau.de/api/tracking/page-view') {
  return { url, headers: { get: name => headers[name.toLowerCase()] ?? null } }
}
const jsonRequest = (body, extra = {}) => new Request('https://rk-gaggenau.de/api/tracking/page-view', {
  method: 'POST', headers: { 'content-type': 'application/json', ...extra }, body,
})

// Execute the actual core consent gate, rather than a test copy of that validator.
test('parses fresh version 3 consent and a UUIDv4 with only reviewed fields', () => {
  const value = helper.parseTrackingContext(tracking({ consent: { ...consent, analytics: true, extra: 'private' }, source_url: 'private', email: 'private@example.invalid' }))
  assert.deepEqual(clone(value), { consent, session_id: session })
  assert.deepEqual(clone(helper.parseTrackingContext(tracking({ session_id: otherSession.toUpperCase() }))), { consent, session_id: otherSession })
})
for (const invalid of [undefined, null, [], 'string', {}, tracking({ consent: null }), tracking({ consent: { ...consent, version: 2 } }), tracking({ consent: { ...consent, marketing: false } }), tracking({ consent: { ...consent, savedAt: now - 180 * 86400000 } }), tracking({ consent: { ...consent, savedAt: now + 86400000 } }), tracking({ consent: { ...consent, savedAt: Infinity } })]) {
  test(`rejects missing, stale or invalid consent ${JSON.stringify(invalid)}`, () => assert.equal(helper.parseTrackingContext(invalid), null))
}
for (const invalid of [undefined, null, '', ' ' + session, session + ' ', session.replace('-4333-', '-1333-'), session.replace('-8444-', '-7444-'), 'invalid', 123]) {
  test(`rejects a non-exact UUIDv4 ${JSON.stringify(invalid)}`, () => assert.equal(helper.parseTrackingContext(tracking({ session_id: invalid })), null))
}
test('retains valid original Meta cookies and never constructs them from click parameters', () => {
  const fbp = `fb.1.${now}.1234567890`
  const fbc = `fb.2.${now}.a_click-ID_1`
  assert.deepEqual(clone(helper.parseTrackingContext(tracking({ fbp, fbc }))), { consent, session_id: session, fbp, fbc })
  assert.deepEqual(clone(helper.parseTrackingContext(tracking({ fbclid: 'a_click_ID', url: 'https://rk-gaggenau.de/?fbclid=a_click_ID' }))), { consent, session_id: session })
})
for (const invalid of [`fb.3.${now}.1234`, `fb.1.${now + 86400000}.1234`, `fb.1.${now - 180 * 86400000}.1234`, `fb.1.${now}.`, `fb.1.${now}.private@example.invalid`, `fb.1.${now}.1234\n`, {}, 42]) {
  test(`omits invalid optional Meta cookies ${JSON.stringify(invalid)}`, () => {
    const value = helper.parseTrackingContext(tracking({ fbp: invalid, fbc: invalid }))
    assert.deepEqual(clone(value), { consent, session_id: session })
  })
}
test('cookie suffix limits match the CAPI event builder', () => {
  assert.ok(helper.parseTrackingContext(tracking({ fbp: `fb.0.${now}.${'1'.repeat(40)}`, fbc: `fb.0.${now}.${'a'.repeat(256)}` })).fbp)
  assert.equal(helper.parseTrackingContext(tracking({ fbp: `fb.0.${now}.${'1'.repeat(41)}`, fbc: `fb.0.${now}.${'a'.repeat(257)}` })).fbp, undefined)
  assert.equal(helper.parseTrackingContext(tracking({ fbc: `fb.0.${now}.${'a'.repeat(257)}` })).fbc, undefined)
})

test('allows exact public HTTPS origins without relying on proxy headers', () => {
  for (const origin of ['https://rk-gaggenau.de', 'https://www.rk-gaggenau.de']) {
    assert.equal(helper.isSameOriginTrackingRequest(request({ origin, 'sec-fetch-site': 'same-origin' }, origin + '/api/tracking/page-view')), true)
  }
})
for (const origin of [undefined, '', 'null', 'https://foreign.invalid', 'http://rk-gaggenau.de', 'https://rk-gaggenau.de/', 'https://rk-gaggenau.de/private', 'https://user:password@rk-gaggenau.de', 'https://rk-gaggenau.de:8443', 'https://www.rk-gaggenau.de', 'https://rk-gaggenau.de, https://foreign.invalid']) {
  test(`rejects nonmatching or malformed Origin ${String(origin)}`, () => assert.equal(helper.isSameOriginTrackingRequest(request(origin === undefined ? {} : { origin })), false))
}
test('rejects cross-site Fetch Metadata even with matching Origin', () => {
  assert.equal(helper.isSameOriginTrackingRequest(request({ origin: 'https://rk-gaggenau.de', 'sec-fetch-site': 'cross-site' })), false)
  assert.equal(helper.isSameOriginTrackingRequest(request({ origin: 'https://rk-gaggenau.de', 'sec-fetch-site': 'unexpected' })), false)
})
test('accepts a TLS-terminating trusted proxy only through its single HTTPS protocol value', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-proto': 'https' }
  const url = 'http://rk-gaggenau.de/api/tracking/page-view'
  assert.equal(helper.isSameOriginTrackingRequest(request(headers, url)), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, url)), true)
  for (const proto of ['', 'http', 'https,http', 'https, https', 'HTTPS']) assert.equal(proxyOrigin.isSameOriginTrackingRequest(request({ ...headers, 'x-forwarded-proto': proto }, url)), false)
})
test('forwarded host cannot invent a permitted origin or overcome a different request host', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-host': 'rk-gaggenau.de', 'x-forwarded-proto': 'https' }
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://internal.invalid/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://www.rk-gaggenau.de/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://rk-gaggenau.de:3000/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(fakeRequest(headers, 'https://user:password@rk-gaggenau.de/api/tracking/page-view')), false)
})
test('allows same-origin localhost only in explicit development/test environments', () => {
  for (const origin of ['http://localhost:3107', 'http://127.0.0.1:3107', 'https://localhost:3107']) {
    const req = request({ origin }, origin + '/api/tracking/page-view')
    assert.equal(helper.isSameOriginTrackingRequest(req), false)
    assert.equal(development.isSameOriginTrackingRequest(req), true)
    assert.equal(unitTest.isSameOriginTrackingRequest(req), true)
  }
  assert.equal(development.isSameOriginTrackingRequest(request({ origin: 'http://127.0.0.1:3108' }, 'http://127.0.0.1:3107/api/tracking/page-view')), false)
  assert.equal(development.isSameOriginTrackingRequest(request({ origin: 'http://localhost.evil.invalid:3107' }, 'http://localhost.evil.invalid:3107/api/tracking/page-view')), false)
})

test('normalizes safe user agent and omits invalid/control character agents', () => {
  assert.deepEqual(clone(helper.requestMetaClient(fakeRequest({ 'user-agent': '  Synthetic Unit Browser  ' }))), { clientUserAgent: 'Synthetic Unit Browser' })
  for (const agent of ['', ' ', 'a'.repeat(513), 'bad\nagent', 'bad\ragent', 'bad\tagent', 'bad\u0000agent', 'bad\u007fagent', 'bad\u0085agent']) {
    assert.deepEqual(clone(helper.requestMetaClient(fakeRequest({ 'user-agent': agent }))), {})
  }
})
test('proxy IP headers are ignored unless explicitly trusted', () => {
  const req = request({ 'cf-connecting-ip': '192.0.2.1', 'x-forwarded-for': '198.51.100.1', 'x-real-ip': '203.0.113.1' })
  assert.deepEqual(clone(helper.requestMetaClient(req)), {})
  assert.deepEqual(clone(load({ META_CAPI_TRUST_PROXY_HEADERS: 'true' }).requestMetaClient(req)), {})
  assert.deepEqual(clone(trusted.requestMetaClient(request({ 'x-real-ip': '203.0.113.1' }))), {})
})
test('trusted valid Cloudflare address has priority over the last forwarded address', () => {
  assert.equal(trusted.requestMetaClient(request({ 'cf-connecting-ip': '192.0.2.1', 'x-forwarded-for': '198.51.100.1, 203.0.113.2' })).clientIpAddress, '192.0.2.1')
  assert.equal(trusted.requestMetaClient(request({ 'cf-connecting-ip': 'invalid', 'x-forwarded-for': '198.51.100.1, 2001:db8::1' })).clientIpAddress, '2001:db8::1')
  assert.equal(trusted.requestMetaClient(request({ 'x-forwarded-for': '198.51.100.1, 203.0.113.2' })).clientIpAddress, '203.0.113.2')
})
for (const address of ['invalid', '192.0.2.1, 198.51.100.1', '192.0.2.1:443', '[2001:db8::1]', '999.999.999.999', '192.0.2.1\n', '123456789012345678901234567890123456789012345678']) {
  test(`invalid proxy IP omitted ${JSON.stringify(address)}`, () => assert.equal(trusted.requestMetaClient(fakeRequest({ 'cf-connecting-ip': address })).clientIpAddress, undefined))
}
test('an invalid last forwarded entry cannot fall back to an earlier untrusted entry', () => {
  assert.equal(trusted.requestMetaClient(request({ 'x-forwarded-for': '192.0.2.1, invalid' })).clientIpAddress, undefined)
  assert.equal(trusted.requestMetaClient(request({ 'x-forwarded-for': '192.0.2.1,' })).clientIpAddress, undefined)
})
test('rate key uses a trusted IP independently and otherwise hashes the validated session', () => {
  const req = request({ 'cf-connecting-ip': '192.0.2.1' })
  assert.equal(trusted.getTrackingRateKey(req, session), hash('ip:192.0.2.1'))
  assert.equal(trusted.getTrackingRateKey(req, otherSession), trusted.getTrackingRateKey(req, session))
  assert.equal(helper.getTrackingRateKey(req, session), hash('session:' + session))
  assert.notEqual(helper.getTrackingRateKey(req, session), helper.getTrackingRateKey(req, otherSession))
  assert.equal(helper.getTrackingRateKey(req, otherSession.toUpperCase()), helper.getTrackingRateKey(req, otherSession))
  assert.equal(helper.getTrackingRateKey(req, 'private@example.invalid'), hash('session:invalid'))
  assert.match(trusted.getTrackingRateKey(req, session), /^[a-f0-9]{64}$/)
})

test('consumes bounded JSON and accepts explicit JSON charset', async () => {
  assert.deepEqual(clone(await helper.consumeTrackingJson(jsonRequest('{"ok":true}'))), { ok: true })
  const body = '{"name":"ë"}'
  assert.deepEqual(clone(await helper.consumeTrackingJson(jsonRequest(body, { 'content-type': 'application/json; charset=utf-8', 'content-length': String(Buffer.byteLength(body)) }))), { name: 'ë' })
  assert.deepEqual(clone(await helper.consumeTrackingJson(jsonRequest('false'))), false)
})
for (const contentType of [undefined, 'text/plain', 'application/x-www-form-urlencoded', 'application/jsonp', 'application/json-bogus']) {
  test(`requires JSON content type ${String(contentType)}`, async () => {
    const req = new Request('https://rk-gaggenau.de/api/tracking/page-view', { method: 'POST', headers: contentType ? { 'content-type': contentType } : {}, body: '{}' })
    assert.equal(await helper.consumeTrackingJson(req), null)
  })
}
for (const length of ['-1', '1.5', '8193', '9007199254740992', '2,2', 'invalid', '']) {
  test(`rejects invalid or excessive declared length ${length}`, async () => assert.equal(await helper.consumeTrackingJson(jsonRequest('{}', { 'content-length': length })), null))
}
test('enforces actual UTF-8 bytes even without or with misleading declared length', async () => {
  const oversized = JSON.stringify('a'.repeat(8192))
  assert.equal(await helper.consumeTrackingJson(jsonRequest(oversized)), null)
  assert.equal(await helper.consumeTrackingJson(jsonRequest(oversized, { 'content-length': '2' })), null)
  assert.equal(await helper.consumeTrackingJson(jsonRequest(JSON.stringify('ëëë')), 7), null)
  assert.equal(await helper.consumeTrackingJson(jsonRequest('{}', { 'content-length': '3' })), null)
  assert.deepEqual(clone(await helper.consumeTrackingJson(jsonRequest('{}'), 2)), {})
})
test('rejects malformed JSON, empty, consumed, or missing request body', async () => {
  for (const body of ['', '{', '{"x":', '{"x":Infinity}', '\ufeff{}']) assert.equal(await helper.consumeTrackingJson(jsonRequest(body)), null)
  const consumed = jsonRequest('{}')
  await consumed.text()
  assert.equal(await helper.consumeTrackingJson(consumed), null)
  assert.equal(await helper.consumeTrackingJson(new Request('https://rk-gaggenau.de/api/tracking/page-view', { method: 'POST', headers: { 'content-type': 'application/json' } })), null)
})
test('rejects invalid byte cap and malformed UTF-8', async () => {
  for (const cap of [0, -1, Infinity, 1.5, NaN]) assert.equal(await helper.consumeTrackingJson(jsonRequest('{}'), cap), null)
  const invalid = new Uint8Array([0x22, 0xc3, 0x28, 0x22])
  assert.equal(await helper.consumeTrackingJson(jsonRequest(invalid)), null)
})
test('stops an oversized stream and cancels before reading all remaining chunks', async () => {
  let cancelled = false
  let pulls = 0
  const stream = new ReadableStream({
    pull(controller) { pulls++; controller.enqueue(new TextEncoder().encode('x'.repeat(32))) },
    cancel() { cancelled = true },
  }, { highWaterMark: 0 })
  const req = { headers: new Headers({ 'content-type': 'application/json' }), body: stream, bodyUsed: false }
  assert.equal(await helper.consumeTrackingJson(req, 16), null)
  assert.equal(cancelled, true)
  assert.equal(pulls, 1)
})
test('handles multibyte UTF-8 across chunk boundaries', async () => {
  const bytes = new TextEncoder().encode('{"name":"ë"}')
  const stream = new ReadableStream({ start(controller) { for (const byte of bytes) controller.enqueue(Uint8Array.of(byte)); controller.close() } })
  assert.deepEqual(clone(await helper.consumeTrackingJson({ headers: new Headers({ 'content-type': 'application/json' }), body: stream, bodyUsed: false })), { name: 'ë' })
})
test('locked and errored streams return null rather than escaping the endpoint', async () => {
  const locked = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('{}')); controller.close() } })
  const lock = locked.getReader()
  assert.equal(await helper.consumeTrackingJson({ headers: new Headers({ 'content-type': 'application/json' }), body: locked, bodyUsed: false }), null)
  lock.releaseLock()
  const errored = new ReadableStream({ start(controller) { controller.error(new Error('synthetic stream error')) } })
  assert.equal(await helper.consumeTrackingJson({ headers: new Headers({ 'content-type': 'application/json' }), body: errored, bodyUsed: false }), null)
})

for (const internal of ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '[::]']) {
  test(`allows the documented internal listen address ${internal} with either reconstructed URL protocol only with proxy opt-in and exact public Host`, () => {
    for (const publicHost of ['rk-gaggenau.de', 'www.rk-gaggenau.de']) {
      const headers = { origin: 'https://' + publicHost, host: publicHost, 'x-forwarded-proto': 'https' }
      const url = `http://${internal}:3000/api/tracking/page-view`
      assert.equal(helper.isSameOriginTrackingRequest(request(headers, url)), false)
      assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, url)), true)
      assert.equal(proxyOrigin.isSameOriginTrackingRequest(request({ ...headers, 'sec-fetch-site': 'cross-site' }, url)), false)
      assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, url.replace('http:', 'https:'))), true)
      assert.equal(helper.isSameOriginTrackingRequest(request(headers, url.replace('http:', 'https:'))), false)
      assert.equal(trusted.isSameOriginTrackingRequest(request(headers, url.replace('http:', 'https:'))), false)
    }
  })
}
for (const host of [undefined, '', 'foreign.invalid', 'www.rk-gaggenau.de', 'rk-gaggenau.de:443', 'rk-gaggenau.de:3000', 'rk-gaggenau.de, foreign.invalid', 'RK-GAGGENAU.DE', 'rk-gaggenau.de.']) {
  test(`proxy opt-in refuses an absent or non-exact public Host ${String(host)}`, () => {
    const headers = { origin: 'https://rk-gaggenau.de', 'x-forwarded-proto': 'https', 'x-forwarded-host': 'rk-gaggenau.de', ...(host === undefined ? {} : { host }) }
    assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://localhost:3000/api/tracking/page-view')), false)
    assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://rk-gaggenau.de/api/tracking/page-view')), false)
  })
}
test('internal proxy fallback never accepts arbitrary internal hosts, credentials, or a different public request hostname', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-proto': 'https', 'x-forwarded-host': 'rk-gaggenau.de' }
  for (const url of ['http://internal.invalid:3000/api/tracking/page-view', 'http://192.0.2.1:3000/api/tracking/page-view', 'http://localhost.evil.invalid:3000/api/tracking/page-view', 'http://www.rk-gaggenau.de/api/tracking/page-view', 'http://rk-gaggenau.de:3000/api/tracking/page-view', 'http://user:password@localhost:3000/api/tracking/page-view', 'ftp://localhost:3000/api/tracking/page-view']) {
    assert.equal(proxyOrigin.isSameOriginTrackingRequest(fakeRequest(headers, url)), false)
  }
})
test('internal proxy fallback requires a single exact forwarded HTTPS protocol', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de' }
  for (const proto of [undefined, '', 'http', 'https,http', 'https, https', 'HTTPS', ' https', 'https ']) {
    assert.equal(proxyOrigin.isSameOriginTrackingRequest(fakeRequest({ ...headers, ...(proto === undefined ? {} : { 'x-forwarded-proto': proto }) }, 'http://localhost:3000/api/tracking/page-view')), false)
  }
})
test('internal proxy fallback cannot substitute Forwarded Host for the actual Host header', () => {
  const headers = { origin: 'https://rk-gaggenau.de', 'x-forwarded-proto': 'https', 'x-forwarded-host': 'rk-gaggenau.de' }
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://0.0.0.0:3000/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request({ ...headers, host: 'localhost:3000' }, 'http://0.0.0.0:3000/api/tracking/page-view')), false)
})

test('the IP proxy trust flag alone never authorizes an internal HTTP request origin', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-proto': 'https' }
  assert.equal(trusted.isSameOriginTrackingRequest(request(headers, 'http://localhost:3000/api/tracking/page-view')), false)
  assert.equal(trusted.isSameOriginTrackingRequest(request(headers, 'http://rk-gaggenau.de/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'http://localhost:3000/api/tracking/page-view')), true)
})
test('the internal origin flag never grants trust to IP proxy headers', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-proto': 'https', 'cf-connecting-ip': '192.0.2.1', 'x-forwarded-for': '198.51.100.1' }
  assert.deepEqual(clone(proxyOrigin.requestMetaClient(request(headers, 'http://localhost:3000/api/tracking/page-view'))), {})
  const explicitlyBoth = load({ NODE_ENV: 'production', META_CAPI_ALLOW_INTERNAL_ORIGIN: '1', META_CAPI_TRUST_PROXY_HEADERS: '1' })
  assert.equal(explicitlyBoth.isSameOriginTrackingRequest(request(headers, 'http://localhost:3000/api/tracking/page-view')), true)
  assert.equal(explicitlyBoth.requestMetaClient(request(headers)).clientIpAddress, '192.0.2.1')
})
test('internal origin allowance requires the exact private opt-in flag value', () => {
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-proto': 'https' }
  for (const env of [{ META_CAPI_ALLOW_INTERNAL_ORIGIN: 'true' }, { NEXT_PUBLIC_META_CAPI_ALLOW_INTERNAL_ORIGIN: '1' }, { META_CAPI_TRUST_PROXY_HEADERS: '1' }]) {
    assert.equal(load({ NODE_ENV: 'production', ...env }).isSameOriginTrackingRequest(request(headers, 'http://0.0.0.0:3000/api/tracking/page-view')), false)
  }
})

test('reconstructed internal HTTPS URLs retain exact Host/protocol and origin-flag gates', () => {
  const url = 'https://127.0.0.1:3129/api/tracking/page-view'
  const headers = { origin: 'https://rk-gaggenau.de', host: 'rk-gaggenau.de', 'x-forwarded-proto': 'https' }
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, url)), true)
  assert.equal(helper.isSameOriginTrackingRequest(request(headers, url)), false)
  assert.equal(trusted.isSameOriginTrackingRequest(request(headers, url)), false)
  for (const change of [{ host: 'www.rk-gaggenau.de' }, { host: 'rk-gaggenau.de:443' }, { 'x-forwarded-proto': 'http' }, { 'x-forwarded-proto': 'https, http' }, { origin: 'http://rk-gaggenau.de' }, { origin: 'https://foreign.invalid' }]) {
    assert.equal(proxyOrigin.isSameOriginTrackingRequest(request({ ...headers, ...change }, url)), false)
  }
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'https://internal.invalid:3129/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'https://www.rk-gaggenau.de/api/tracking/page-view')), false)
  assert.equal(proxyOrigin.isSameOriginTrackingRequest(request(headers, 'https://rk-gaggenau.de:8443/api/tracking/page-view')), false)
  assert.deepEqual(clone(proxyOrigin.requestMetaClient(request({ ...headers, 'cf-connecting-ip': '192.0.2.1' }, url))), {})
})
