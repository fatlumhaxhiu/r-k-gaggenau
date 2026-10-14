/* eslint @typescript-eslint/no-require-imports: "off" -- Node's isolated CommonJS test runner. */
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { webcrypto, createHash, randomUUID } = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');
const origin = 'https://rk-gaggenau.de';
const routes = ['/landing/baureinigung', '/landing/gewerbereinigung', '/landing/grundreinigung', '/landing/privatreinigung', '/landing/saisonale-pflege', '/landing/spezialreinigung', '/kontakt'];
const code = new Map(['consent', 'enhancedConversions', 'trackingContext', 'metaTracking', 'tracking'].map(name => [name, ts.transpileModule(readFileSync(resolve(__dirname, `../src/lib/${name}.ts`), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText]));
const clone = value => JSON.parse(JSON.stringify(value));
const sha = value => createHash('sha256').update(value).digest('hex');
const contact = { email: ' TEST.User@Gmail.COM ', phone: '+49 (1577) 679-0522' };
const expectedHashes = { sha256_email_address: sha('testuser@gmail.com'), sha256_phone_number: sha('+4915776790522') };
const id = 'e'.repeat(64);

function harness({ url = origin + '/kontakt', analytics = true, marketing = true, version = 3, savedAt = Date.now(), session = new Map(), cookie = '', gtm = 'GTM-SYNTHETIC123', capi = false, manualTimers = false, networkFailures = 0, blockStorage = false, cryptoOverride } = {}) {
  let currentUrl = new URL(url), failures = networkFailures, clock = Date.now();
  class TimerDate extends Date {
    constructor(...args) { if (args.length) super(...args); else super(clock); }
    static now() { return clock; }
  }
  const location = {};
  for (const name of ['href', 'origin', 'pathname', 'search', 'hostname', 'hash']) Object.defineProperty(location, name, { get: () => currentUrl[name] });
  const local = new Map();
  const scripts = [], snapshots = [], requests = [], timers = new Map();
  let nextTimer = 0;
  const storage = (map, blocked = false) => ({
    getItem: key => { if (blocked) throw new Error('Blocked storage'); return map.get(key) ?? null; },
    setItem: (key, value) => { if (blocked) throw new Error('Blocked storage'); map.set(key, String(value)); },
    removeItem: key => { if (blocked) throw new Error('Blocked storage'); map.delete(key); },
  });
  const setConsent = (a, m, v = 3, at = Date.now()) => local.set('rk_consent_v1', JSON.stringify({ version: v, analytics: a, marketing: m, savedAt: at }));
  setConsent(analytics, marketing, version, savedAt);
  const queue = [];
  queue.push = function(...rows) { snapshots.push(...rows.map(clone)); return Array.prototype.push.apply(this, rows); };
  const context = vm.createContext({
    URL, URLSearchParams, Date: manualTimers ? TimerDate : Date, Set, TextEncoder, crypto: cryptoOverride || webcrypto, location,
    localStorage: storage(local), sessionStorage: storage(session, blockStorage),
    process: { env: { NODE_ENV: 'production', NEXT_PUBLIC_GTM_ID: gtm, NEXT_PUBLIC_GOOGLE_ADS_LEAD_SEND_TO: 'AW-18267690559/SYNTHETIC_TEST', NEXT_PUBLIC_META_PIXEL_ENABLED: '1', NEXT_PUBLIC_META_CAPI_ENABLED: capi ? '1' : '0' } },
    document: { referrer: 'https://example.invalid/', cookie, getElementById: key => scripts.find(s => s.id === key), createElement: () => ({}), head: { appendChild: script => scripts.push(script) } },
    window: { dataLayer: queue, setTimeout: (callback, delay = 0) => {
      if (!manualTimers) return setTimeout(callback, 0);
      timers.set(++nextTimer, { callback, due: clock + delay }); return nextTimer;
    } },
    clearTimeout: timer => manualTimers ? timers.delete(timer) : clearTimeout(timer),
    fetch: async (endpoint, options) => {
      requests.push({ endpoint, ...options, body: JSON.parse(options.body) });
      if (failures-- > 0) throw new Error('Synthetic network failure');
      return { ok: true, status: 202 };
    },
  });
  const loaded = new Map();
  function load(name) {
    name = name.replace(/^\.\//, '');
    if (loaded.has(name)) return loaded.get(name).exports;
    if (!code.has(name)) throw new Error(`Unexpected module ${name}`);
    const moduleRecord = { exports: {} }; loaded.set(name, moduleRecord);
    vm.runInContext(`(function(exports,require,module){${code.get(name)}\n})`, context)(moduleRecord.exports, load, moduleRecord);
    return moduleRecord.exports;
  }
  const tracking = load('tracking'); tracking.configureTracking(true);
  return { tracking, load, queue, snapshots, scripts, requests, session, setConsent, context,
    navigate: next => { currentUrl = new URL(next, origin); },
    events: event => snapshots.filter(row => row.event === event),
    meta: event => (context.window.fbq?.queue || []).filter(row => row[2] === event),
    runNextTimeout: () => {
      const next = Array.from(timers.entries()).sort((a, b) => a[1].due - b[1].due)[0];
      if (!next) return false;
      timers.delete(next[0]); clock = next[1].due; next[1].callback(); return true;
    },
    flushTimeouts: () => {
      for (const [timer, value] of Array.from(timers.entries()).sort((a, b) => a[1].due - b[1].due)) {
        if (!timers.has(timer)) continue;
        timers.delete(timer); clock = value.due; value.callback();
      }
    },
    pendingTimeouts: () => timers.size,
    clock: () => clock,
  };
}
const tick = () => new Promise(resolve => setImmediate(resolve));
async function waitForLead(app) {
  for (let count = 0; count < 40; count++) { if (app.queue.some(row => row.event === 'rk_saved_lead')) return; await tick(); }
  assert.fail('Expected saved-lead event did not arrive');
}

for (const route of routes) {
  for (const choice of [{ analytics: false, marketing: false }, { analytics: true, marketing: false }, { analytics: false, marketing: true }, { analytics: true, marketing: true }]) {
    test(`GTM ${route} Statistik=${choice.analytics} Marketing=${choice.marketing}`, async () => {
      const app = harness({ ...choice, url: origin + route });
      app.tracking.syncTracking();
      await app.tracking.trackSavedLead(id, contact);
      await app.tracking.trackSavedLead(id, contact);
      const optional = choice.analytics || choice.marketing;
      assert.equal(app.scripts.filter(s => s.id === 'rk-gtm').length, Number(optional));
      assert.equal(app.scripts.filter(s => s.id === 'rk-google-tag').length, 0);
      assert.equal(app.context.window.gtag, undefined, 'GTM owns Google tags; direct gtag queue is absent');
      assert.equal(app.events('rk_page_view').length, Number(optional));
      assert.equal(app.events('rk_saved_lead').length, Number(optional));
      assert.equal(app.meta('PageView').length, Number(choice.marketing));
      assert.equal(app.meta('Lead').length, Number(choice.marketing));
      for (const event of [...app.events('rk_page_view'), ...app.events('rk_saved_lead')]) {
        assert.equal(event.page_location, origin + route);
        assert.equal(event.page_referrer, 'https://example.invalid');
        assert.equal(event.analytics_consent, choice.analytics);
        assert.equal(event.marketing_consent, choice.marketing);
        const before = app.snapshots.slice(0, app.snapshots.indexOf(event)).filter(row => row.event === 'rk_consent_update').at(-1);
        assert(before, 'Consent update must precede measurement');
        assert.equal(before.analytics_consent, choice.analytics); assert.equal(before.marketing_consent, choice.marketing);
      }
      for (const event of app.events('rk_page_view')) { assert.match(event.event_id, /^[a-f0-9]{64}$/); assert.equal(event.rk_user_data, undefined); }
      if (optional) {
        const lead = app.events('rk_saved_lead')[0]; assert.equal(lead.event_id, id);
        assert.deepEqual(lead.rk_user_data, choice.marketing ? expectedHashes : null);
        assert.equal(lead.eventTimeout, 1000);
      }
      assert(!JSON.stringify(app.snapshots).includes('TEST.User')); assert(!JSON.stringify(app.snapshots).includes('testuser@gmail.com')); assert(!JSON.stringify(app.snapshots).includes('679-0522'));
      assert(!JSON.stringify(app.queue).includes(expectedHashes.sha256_email_address), 'matching data is cleared after completion');
    });
  }
}

test('GTM hashes normalize Google email and explicit-country phones; invalid values are dropped', async () => {
  const app = harness(); const ec = app.load('enhancedConversions');
  assert.equal(ec.normalizeConversionEmail(' A.B@GoogleMail.com '), 'ab@googlemail.com');
  assert.equal(ec.normalizeConversionEmail(' A.B@Example.com '), 'a.b@example.com');
  assert.equal(ec.normalizeConversionEmail('a+b@gmail.com'), 'a+b@gmail.com', 'do not silently remove plus tags');
  assert.equal(ec.normalizeConversionPhone('+49 (1577) 679-0522'), '+4915776790522');
  for (const phone of ['015776790522', '004915776790522', '+04915776790522', '+1callme', '+1234567890123456', '+12']) assert.equal(ec.normalizeConversionPhone(phone), undefined);
  assert.deepEqual(clone(await ec.hashSavedLeadContact(contact)), expectedHashes);
  assert.deepEqual(clone(await ec.hashSavedLeadContact({ email: 'bad@', phone: 'unknown' })), {});
});

test('GTM lead uses current sanitized SPA URL and leaves page-view/GA4 payloads without hashes', async () => {
  const app = harness({ url: origin + '/landing/baureinigung' });
  app.tracking.syncTracking();
  app.navigate('/landing/gewerbereinigung?utm_source=google&utm_campaign=TEST_route&email=secret@example.invalid#gclid');
  app.tracking.syncTracking();
  await app.tracking.trackSavedLead(id, contact);
  const lead = app.events('rk_saved_lead')[0];
  assert.equal(lead.page_location, origin + '/landing/gewerbereinigung?utm_source=google&utm_campaign=TEST_route');
  assert.equal(lead.page_referrer, 'https://example.invalid');
  assert(!JSON.stringify(app.snapshots).includes('secret@example.invalid'));
  assert(app.events('rk_page_view').every(row => !row.rk_user_data));
  assert(!app.snapshots.some(row => row[0] === 'event'), 'there are no direct GA4/Ads commands in GTM mode');
});

test('GTM event callback clears matching fields once and reload cannot replay the saved lead', async () => {
  const app = harness({ manualTimers: true }); app.tracking.syncTracking();
  const pending = app.tracking.trackSavedLead(id, contact); await waitForLead(app);
  const lead = app.queue.find(row => row.event === 'rk_saved_lead');
  assert.deepEqual(clone(lead.rk_user_data), expectedHashes);
  const dispatchStart = app.clock(); const clearsBefore = app.snapshots.filter(row => row.rk_user_data === null).length;
  let resolved = false; void pending.then(() => { resolved = true; });
  lead.eventCallback(); lead.eventCallback(); await tick();
  assert.deepEqual(clone(lead.rk_user_data), expectedHashes, 'An early native callback must not remove matching data before SDK serialization.');
  assert.equal(app.snapshots.filter(row => row.rk_user_data === null).length, clearsBefore);
  assert.equal(resolved, false, 'Do not navigate to thank-you before the bounded dispatch window.');
  assert(app.runNextTimeout()); await pending;
  assert.equal(app.clock() - dispatchStart, 1000);
  assert.equal(lead.rk_user_data, null);
  assert.equal(app.snapshots.filter(row => row.rk_user_data === null).length, clearsBefore + 1);
  lead.eventCallback(); app.flushTimeouts();
  assert.equal(app.snapshots.filter(row => row.rk_user_data === null).length, clearsBefore + 1, 'Post-deadline callbacks cannot clear another event or replay this one.');
  const reloaded = harness({ session: app.session, url: origin + '/thank-you' }); reloaded.tracking.syncTracking();
  await reloaded.tracking.trackSavedLead(id, contact);
  assert.equal(reloaded.events('rk_saved_lead').length, 0); assert.equal(reloaded.meta('Lead').length, 0);
  assert.equal(reloaded.events('rk_page_view').length, 1);
});

test('GTM concurrent retry uses one opaque saved-lead event; revoked consent during hashing drops matching', async () => {
  const app = harness(); app.tracking.syncTracking();
  await Promise.all([app.tracking.trackSavedLead(id, contact), app.tracking.trackSavedLead(id, contact)]);
  assert.equal(app.events('rk_saved_lead').length, 1);
  let release;
  const slowCrypto = { getRandomValues: a => webcrypto.getRandomValues(a), randomUUID,
    subtle: { digest: (...args) => new Promise(resolve => { release = async () => resolve(await webcrypto.subtle.digest(...args)); }) },
  };
  const changing = harness({ cryptoOverride: slowCrypto }); changing.tracking.syncTracking();
  const pending = changing.tracking.trackSavedLead(id, { email: 'test@gmail.com' });
  changing.setConsent(true, false); await release(); await pending;
  assert.equal(changing.events('rk_saved_lead')[0].marketing_consent, false);
  assert.equal(changing.events('rk_saved_lead')[0].rk_user_data, null);
});

for (const route of routes) {
  test(`CAPI PageView shares Pixel ID and carries no contacts on ${route}`, async () => {
    const timestamp = Date.now(); const fbp = `fb.1.${timestamp}.123456789`; const fbc = `fb.1.${timestamp}.SYNTHETIC_CLICK`;
    const app = harness({ url: origin + route, capi: true, cookie: `_fbp=${fbp}; _fbc=${fbc}` });
    app.tracking.syncTracking(); app.tracking.syncTracking(); await tick();
    const requests = app.requests.filter(r => r.endpoint === '/api/tracking/page-view'); assert.equal(requests.length, 1);
    const request = requests[0]; const pixelEvent = app.meta('PageView')[0];
    assert.match(request.body.event_id, /^[a-f0-9]{64}$/); assert.equal(request.body.event_id, pixelEvent[4].eventID);
    assert.equal(request.body.page_location, origin + route); assert.equal(request.keepalive, true);
    assert.deepEqual(Object.keys(request.body).sort(), ['event_id', 'page_location', 'tracking']);
    assert.equal(request.body.tracking.consent.version, 3); assert.equal(request.body.tracking.consent.marketing, true);
    assert.match(request.body.tracking.session_id, /^[a-f0-9-]{36}$/); assert.equal(request.body.tracking.fbp, fbp); assert.equal(request.body.tracking.fbc, fbc);
    assert(!('email' in request.body.tracking)); assert(!('phone' in request.body.tracking));
    if (route !== '/kontakt') { app.navigate(route + (route.endsWith('grundreinigung') ? '#appointment' : '#contact')); app.tracking.syncTracking(); await tick(); assert.equal(app.requests.length, 1); }
    app.navigate('/thank-you'); app.tracking.syncTracking(); await tick();
    const second = app.requests.filter(r => r.endpoint === '/api/tracking/page-view')[1]; assert.notEqual(second.body.event_id, request.body.event_id);
    assert.equal(second.body.tracking.session_id, request.body.tracking.session_id);
  });
}

test('CAPI transient retry preserves event ID and transport failure never rejects saved-lead measurement', async () => {
  const cookie = `_fbp=fb.1.${Date.now()}.123456789`; const app = harness({ capi: true, networkFailures: 1, cookie }); app.tracking.syncTracking(); await tick();
  const retries = app.requests.filter(r => r.endpoint === '/api/tracking/page-view'); assert.equal(retries.length, 2);
  assert.deepEqual(retries[0].body, retries[1].body);
  const failing = harness({ capi: true, networkFailures: 20, cookie }); failing.tracking.syncTracking();
  await assert.doesNotReject(failing.tracking.trackSavedLead(id, contact)); await tick();
  assert.equal(failing.meta('Lead').length, 1); assert.equal(failing.events('rk_saved_lead').length, 1);
});

test('CAPI requires flag, fresh v3 Marketing, public safe URL and valid cookies', async () => {
  for (const options of [{ capi: false }, { marketing: false }, { version: 2 }, { savedAt: Date.now() - 181 * 86400_000 }, { url: origin + '/admin/crm-system' }, { url: origin + '/kontakt?email=private@example.invalid' }]) {
    const app = harness({ capi: true, ...options }); app.tracking.syncTracking(); await tick(); assert.equal(app.requests.length, 0);
  }
  const app = harness({ capi: true, cookie: `_fbp=notvalid; _fbc=fb.1.${Date.now() + 86400_000}.invalid` });
  app.tracking.syncTracking(); await tick();
  assert.equal(app.requests.length, 0, 'No server PageView without a genuine identifier.');
  const data = app.load('trackingContext').buildTrackingContext();
  assert.equal(data.fbp, undefined); assert.equal(data.fbc, undefined);
});

test('tracking context only creates Marketing session; withdrawal never creates another session', async () => {
  const denied = harness({ marketing: false }); const deniedContext = denied.load('trackingContext');
  assert.equal(deniedContext.buildTrackingContext(), undefined); deniedContext.withdrawTrackingContext(); assert.equal(denied.requests.length, 0); assert.equal(denied.session.size, 0);
  const app = harness(); const context = app.load('trackingContext'); const first = context.buildTrackingContext();
  assert.equal(context.buildTrackingContext().session_id, first.session_id);
  context.withdrawTrackingContext(); context.withdrawTrackingContext();
  assert.equal(app.session.has('rk_capi_session'), false); assert.equal(app.requests.length, 1);
  assert.equal(app.requests[0].endpoint, '/api/tracking/withdraw'); assert.deepEqual(app.requests[0].body, { session_id: first.session_id });
  app.setConsent(false, false); assert.equal(context.buildTrackingContext(), undefined); assert.equal(app.session.has('rk_capi_session'), false);
  const stale = harness({ version: 2, session: new Map([['rk_capi_session', randomUUID()]]) });
  stale.load('trackingContext').buildTrackingContext(); stale.load('trackingContext').buildTrackingContext(); assert.equal(stale.requests.length, 1); assert.equal(stale.session.size, 0);
  const blocked = harness({ blockStorage: true }); assert.equal(blocked.load('trackingContext').buildTrackingContext(), undefined); assert.equal(blocked.requests.length, 0);
});

test('missing or invalid GTM IDs use direct fallback and never include enhanced matching data in GA4', async () => {
  for (const gtm of ['', 'invalid']) {
    const app = harness({ gtm }); app.tracking.syncTracking(); await app.tracking.trackSavedLead(id, contact);
    assert.equal(app.scripts.filter(s => s.id === 'rk-gtm').length, 0); assert.equal(app.scripts.filter(s => s.id === 'rk-google-tag').length, 1);
    assert.equal(app.events('rk_saved_lead').length, 0); assert(!JSON.stringify(app.snapshots).includes('sha256_email_address'));
  }
});

test('granting Statistik after Marketing-only emits the first GA4 page-view opportunity without duplicate Meta', async () => {
  const app = harness({ analytics: false, marketing: true });
  app.tracking.syncTracking();
  assert.equal(app.events('rk_page_view').length, 1);
  assert.equal(app.events('rk_page_view')[0].analytics_consent, false);
  app.setConsent(true, true);
  app.tracking.syncTracking();
  app.tracking.syncTracking();
  const pages = app.events('rk_page_view');
  assert.equal(pages.length, 2);
  assert.equal(pages[1].analytics_consent, true);
  assert.equal(pages[1].page_location, pages[0].page_location);
  assert.equal(app.meta('PageView').length, 1);
  await app.tracking.trackSavedLead(id, contact);
  assert.equal(app.events('rk_saved_lead').length, 1);
  assert.equal(app.events('rk_saved_lead')[0].analytics_consent, true);
  assert.equal(app.scripts.filter(s => s.id === 'rk-gtm').length, 1);
});

test('CAPI first PageView waits for a genuine async Pixel cookie while the Pixel event stays immediate', async () => {
  const app = harness({ capi: true, manualTimers: true });
  app.tracking.syncTracking();
  const pixel = app.meta('PageView')[0];
  assert.equal(app.meta('PageView').length, 1); assert.equal(app.requests.length, 0);
  const session = app.session.get('rk_capi_session');
  assert(app.runNextTimeout()); await tick();
  assert.equal(app.requests.length, 0);
  app.context.document.cookie = `_fbp=fb.1.${app.clock()}.123456789`;
  assert(app.runNextTimeout()); await tick();
  const page = app.requests.filter(row => row.endpoint === '/api/tracking/page-view');
  assert.equal(page.length, 1); assert.equal(page[0].body.event_id, pixel[4].eventID);
  assert.equal(page[0].body.tracking.session_id, session);
  assert.match(page[0].body.tracking.fbp, /^fb\.1\./);
  assert.equal(app.meta('PageView').length, 1); assert.equal(app.pendingTimeouts(), 0);
});

test('CAPI cookie wait expires after five seconds without synthetic identifiers or delayed replay', async () => {
  const app = harness({ capi: true, manualTimers: true });
  const start = app.clock(); app.tracking.syncTracking();
  for (let step = 0; step < 25 && app.runNextTimeout(); step++) await tick();
  assert.equal(app.clock() - start, 5000); assert.equal(app.pendingTimeouts(), 0);
  assert.equal(app.requests.length, 0); assert.equal(app.meta('PageView').length, 1);
  assert.equal(app.context.document.cookie, '');
  app.context.document.cookie = `_fbp=fb.1.${app.clock()}.123456789`;
  app.tracking.syncTracking(); await tick();
  assert.equal(app.requests.length, 0, 'Expired wait cannot replay on the same page.');
});

test('CAPI waiting PageView aborts on real navigation but accepts an approved form anchor', async () => {
  const app = harness({ capi: true, manualTimers: true, url: origin + '/landing/baureinigung' });
  app.tracking.syncTracking(); const firstId = app.meta('PageView')[0][4].eventID;
  app.navigate('/landing/baureinigung#contact'); app.tracking.syncTracking();
  assert.equal(app.meta('PageView').length, 1);
  app.navigate('/landing/gewerbereinigung'); app.tracking.syncTracking();
  const secondId = app.meta('PageView')[1][4].eventID;
  app.context.document.cookie = `_fbp=fb.1.${app.clock()}.123456789`;
  app.flushTimeouts(); await tick();
  const page = app.requests.filter(row => row.endpoint === '/api/tracking/page-view');
  assert.equal(page.length, 1); assert.equal(page[0].body.event_id, secondId);
  assert.notEqual(page[0].body.event_id, firstId);
  assert.equal(page[0].body.page_location, origin + '/landing/gewerbereinigung');
});

test('CAPI waiting PageView aborts on withdrawal or replacement of its captured session', async () => {
  const withdrawn = harness({ capi: true, manualTimers: true }); withdrawn.tracking.syncTracking();
  withdrawn.load('trackingContext').withdrawTrackingContext(); withdrawn.setConsent(false, false);
  withdrawn.context.document.cookie = `_fbp=fb.1.${withdrawn.clock()}.123456789`;
  withdrawn.flushTimeouts(); await tick();
  assert.equal(withdrawn.requests.filter(row => row.endpoint === '/api/tracking/page-view').length, 0);
  assert.equal(withdrawn.requests.filter(row => row.endpoint === '/api/tracking/withdraw').length, 1);
  assert.equal(withdrawn.session.size, 0, 'Wait must not create another session after withdrawal.');
  const replaced = harness({ capi: true, manualTimers: true }); replaced.tracking.syncTracking();
  const replacement = randomUUID(); replaced.session.set('rk_capi_session', replacement);
  replaced.context.document.cookie = `_fbp=fb.1.${replaced.clock()}.123456789`;
  replaced.flushTimeouts(); await tick();
  assert.equal(replaced.requests.length, 0); assert.equal(replaced.session.get('rk_capi_session'), replacement);
});

test('CAPI context rejects future, stale and invalid-scope cookies consistently with the server', () => {
  const now = Date.now();
  for (const cookie of [`_fbp=fb.1.${now + 60_000}.123`, `_fbp=fb.1.${now - 180 * 86400_000}.123`, `_fbp=fb.3.${now}.123`, `_fbc=fb.3.${now}.CLICK`, `_fbc=fb.1.${now + 60_000}.CLICK`, `_fbc=fb.1.${now - 180 * 86400_000}.CLICK`]) {
    const app = harness({ cookie }); const context = app.load('trackingContext').buildTrackingContext();
    assert.equal(context.fbp, undefined); assert.equal(context.fbc, undefined);
  }
  const genuine = harness({ cookie: `_fbp=fb.2.${now}.${'1'.repeat(40)}` }).load('trackingContext').buildTrackingContext();
  assert(genuine.fbp);
});
test('granting Marketing after Statistik-only initializes Ads on the same clean URL without another GA4 view', () => {
  const app = harness({ analytics: true, marketing: false });
  app.tracking.syncTracking();
  assert.equal(app.events('rk_page_view').length, 1);
  assert.equal(app.events('rk_page_view')[0].analytics_consent, true);
  assert.equal(app.events('rk_page_view')[0].marketing_consent, false);
  assert.equal(app.meta('PageView').length, 0);
  app.setConsent(true, true);
  app.tracking.syncTracking();
  app.tracking.syncTracking();
  const pages = app.events('rk_page_view');
  assert.equal(pages.length, 2);
  assert.equal(pages[1].page_location, pages[0].page_location);
  assert.notEqual(pages[1].event_id, pages[0].event_id);
  assert.equal(pages[1].analytics_consent, false, 'Already-counted GA4 page view must not fire again.');
  assert.equal(pages[1].marketing_consent, true, 'The existing native Marketing page trigger initializes Ads.');
  const previousConsent = app.snapshots.slice(0, app.snapshots.indexOf(pages[1])).filter(row => row.event === 'rk_consent_update').at(-1);
  assert.equal(previousConsent.analytics_consent, true, 'Actual Statistik consent remains granted.');
  assert.equal(previousConsent.marketing_consent, true);
  assert.equal(pages.filter(page => page.analytics_consent).length, 1);
  assert.equal(pages.filter(page => page.marketing_consent).length, 1);
  assert.equal(app.meta('PageView').length, 1, 'Meta records its first consented view only once.');
  assert.equal(app.scripts.filter(script => script.id === 'rk-gtm').length, 1);
  assert.equal(app.scripts.filter(script => script.id === 'rk-google-tag').length, 0);
  app.navigate('/landing/gewerbereinigung');
  app.tracking.syncTracking();
  const navigated = app.events('rk_page_view')[2];
  assert.equal(navigated.analytics_consent, true); assert.equal(navigated.marketing_consent, true);
  assert.equal(app.meta('PageView').length, 2, 'A real subsequent navigation still counts.');
});