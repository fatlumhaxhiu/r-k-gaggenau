/* eslint @typescript-eslint/no-require-imports: "off" -- This isolated test uses Node's CommonJS runner. */
// Regression tests for the real tracking modules. Fake DOM/tag loaders never make requests.
const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { webcrypto } = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');

const origin = 'https://rk-gaggenau.de';
const ga4 = 'G-0SQT7RFP3D';
const pixel = '1408138801461432';
const adsDestination = 'AW-18267690559/SYNTHETIC_ROUTING_TEST';
const landingPages = [
  ['/landing/baureinigung', '#contact'],
  ['/landing/gewerbereinigung', '#contact'],
  ['/landing/grundreinigung', '#appointment'],
  ['/landing/privatreinigung', '#contact'],
  ['/landing/saisonale-pflege', '#contact'],
  ['/landing/spezialreinigung', '#contact'],
];
const routes = [...landingPages.map(([route]) => route), '/kontakt'];
const compiled = new Map(['consent', 'trackingContext', 'enhancedConversions', 'metaTracking', 'tracking', 'leadRequest'].map(name => [
  name,
  ts.transpileModule(readFileSync(resolve(__dirname, `../src/lib/${name}.ts`), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText,
]));

function storage(map = new Map()) {
  return {
    getItem: key => map.has(key) ? map.get(key) : null,
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: key => map.delete(key),
  };
}

function harness({
  url = `${origin}/landing/baureinigung`,
  referrer = 'https://example.invalid/',
  analytics = true,
  marketing = true,
  session = new Map(),
} = {}) {
  let currentUrl = new URL(url);
  const location = {};
  for (const property of ['href', 'origin', 'pathname', 'search', 'hostname', 'hash']) {
    Object.defineProperty(location, property, { get: () => currentUrl[property] });
  }
  const localStorage = storage();
  localStorage.setItem('rk_consent_v1', JSON.stringify({
    version: 3, analytics, marketing, savedAt: Date.now(),
  }));
  const scripts = [];
  const context = vm.createContext({
    URL, URLSearchParams, Date, Set, TextEncoder, crypto: webcrypto, location, localStorage,
    sessionStorage: storage(session), clearTimeout,
    process: { env: {
      NODE_ENV: 'production', NEXT_PUBLIC_META_PIXEL_ENABLED: '1',
      NEXT_PUBLIC_GOOGLE_ADS_LEAD_SEND_TO: adsDestination,
    } },
    document: {
      referrer, cookie: '',
      getElementById: id => scripts.find(script => script.id === id),
      createElement: () => ({}),
      head: { appendChild: script => scripts.push(script) },
    },
    window: { setTimeout: callback => setTimeout(callback, 0) },
    fetch: () => { throw new Error('Network is forbidden in isolated tracking tests'); },
  });
  const modules = new Map();
  function load(name) {
    name = name.replace(/^\.\//, '');
    if (modules.has(name)) return modules.get(name).exports;
    if (!compiled.has(name)) throw new Error(`Unexpected module: ${name}`);
    const vmModule = { exports: {} };
    modules.set(name, vmModule);
    const run = vm.runInContext(`(function(exports, require, module) {\n${compiled.get(name)}\n})`, context);
    run(vmModule.exports, load, vmModule);
    return vmModule.exports;
  }
  const tracking = load('tracking');
  tracking.configureTracking(true);
  return {
    tracking, load, session, scripts,
    navigate: next => { currentUrl = new URL(next, origin); },
    googleRows: () => JSON.parse(JSON.stringify(Array.from(context.window.dataLayer || [], row => Array.from(row)))),
    metaRows: () => JSON.parse(JSON.stringify(context.window.fbq?.queue || [])),
  };
}

function googleEvents(app, name) {
  return app.googleRows().filter(row => row[0] === 'event' && row[1] === name);
}
function metaEvents(app, name) {
  return app.metaRows().filter(row => row[0] === 'trackSingle' && row[1] === pixel && row[2] === name);
}
function eventId(index = 0) {
  return index.toString(16).padStart(64, 'a');
}

for (const [route, anchor] of landingPages) {
  test(`Meta counts route navigation but not the form anchor on ${route}`, async () => {
    const app = harness({ url: origin + route });
    app.tracking.syncTracking();
    app.navigate(route + anchor);
    app.tracking.syncTracking();
    await app.tracking.trackSavedLead(eventId());
    assert.equal(metaEvents(app, 'PageView').length, 1, 'a form anchor is not another page visit');
    assert.equal(metaEvents(app, 'Lead').length, 1);
    app.navigate('/kontakt');
    app.tracking.syncTracking();
    app.tracking.syncTracking();
    assert.equal(metaEvents(app, 'PageView').length, 2, 'real navigation is counted exactly once');
    app.navigate(route + anchor);
    app.tracking.syncTracking();
    assert.equal(metaEvents(app, 'PageView').length, 3, 'returning from another route remains a page visit');
  });
}

for (const [index, route] of routes.entries()) {
  test(`all destinations receive one saved Lead on current route ${route}`, async () => {
    const app = harness();
    app.tracking.syncTracking();
    const target = `${route}?utm_source=google&utm_medium=cpc&utm_campaign=TEST_routing&gclid=SYNTHETICCLICK`;
    app.navigate(target);
    app.tracking.syncTracking();
    const id = eventId(index + 1);
    await app.tracking.trackSavedLead(id);
    await app.tracking.trackSavedLead(id);
    const gaEvents = googleEvents(app, 'generate_lead');
    const adsEvents = googleEvents(app, 'conversion');
    assert.equal(gaEvents.length, 1);
    assert.equal(adsEvents.length, 1);
    assert.equal(metaEvents(app, 'Lead').length, 1);
    assert.equal(gaEvents[0][2].send_to, ga4);
    assert.equal(gaEvents[0][2].event_id, id);
    assert.equal(adsEvents[0][2].send_to, adsDestination);
    assert.equal(adsEvents[0][2].transaction_id, id);
    for (const [, , params] of [...gaEvents, ...adsEvents]) {
      assert.equal(params.page_location, origin + target, 'Lead location must follow SPA navigation');
      assert.equal(params.page_referrer, 'https://example.invalid');
    }
    assert.deepEqual(metaEvents(app, 'Lead')[0].slice(3), [{}, { eventID: id }]);
    app.navigate('/thank-you');
    app.tracking.syncTracking();
    assert.equal(googleEvents(app, 'generate_lead').length, 1);
    assert.equal(googleEvents(app, 'conversion').length, 1);
    assert.equal(metaEvents(app, 'Lead').length, 1);
  });
}

test('Google Lead after SPA navigation uses current sanitized location and origin-only referrer', async () => {
  const app = harness({ referrer: 'https://ref.example.invalid/private?email=referrer@example.invalid' });
  app.tracking.syncTracking();
  app.navigate('/landing/gewerbereinigung?email=private@example.invalid&utm_source=google&utm_medium=cpc&utm_campaign=TEST_cleaning&gclid=SYNTHETICCLICK#contact');
  app.tracking.syncTracking();
  await app.tracking.trackSavedLead(eventId(8));
  for (const name of ['generate_lead', 'conversion']) {
    const events = googleEvents(app, name);
    assert.equal(events.length, 1);
    assert.equal(events[0][2].page_location, `${origin}/landing/gewerbereinigung?utm_source=google&utm_medium=cpc&utm_campaign=TEST_cleaning&gclid=SYNTHETICCLICK`);
    assert.equal(events[0][2].page_referrer, 'https://ref.example.invalid');
  }
  assert(!JSON.stringify(app.googleRows()).includes('private@example.invalid'));
  assert(!JSON.stringify(app.googleRows()).includes('referrer@example.invalid'));
  assert.equal(app.scripts.filter(script => script.id === 'rk-meta-pixel').length, 0, 'unsafe URLs/referrers remain excluded from Meta');
});

for (const choice of [
  { analytics: false, marketing: false },
  { analytics: true, marketing: false },
  { analytics: false, marketing: true },
  { analytics: true, marketing: true },
]) {
  test(`saved Lead respects Statistik=${choice.analytics}, Marketing=${choice.marketing}`, async () => {
    const app = harness({ ...choice, url: origin + '/kontakt' });
    app.tracking.syncTracking();
    await app.tracking.trackSavedLead(eventId(9));
    assert.equal(googleEvents(app, 'generate_lead').length, Number(choice.analytics));
    assert.equal(googleEvents(app, 'page_view').length, Number(choice.analytics));
    assert.equal(googleEvents(app, 'conversion').length, Number(choice.marketing));
    assert.equal(metaEvents(app, 'Lead').length, Number(choice.marketing));
    assert.equal(metaEvents(app, 'PageView').length, Number(choice.marketing));
    if (!choice.analytics && !choice.marketing) assert.equal(app.scripts.length, 0);
    else {
      const update = app.googleRows().filter(row => row[0] === 'consent' && row[1] === 'update').at(-1)[2];
      assert.deepEqual(update, {
        analytics_storage: choice.analytics ? 'granted' : 'denied',
        ad_storage: choice.marketing ? 'granted' : 'denied',
        ad_user_data: choice.marketing ? 'granted' : 'denied',
        ad_personalization: choice.marketing ? 'granted' : 'denied',
      });
    }
  });
}

test('session dedup prevents saved Lead replay after thank-you reload; page visit still counts', async () => {
  const first = harness({ url: origin + '/kontakt' });
  first.tracking.syncTracking();
  const id = eventId(10);
  await first.tracking.trackSavedLead(id);
  const reloaded = harness({ url: origin + '/thank-you', session: first.session });
  reloaded.tracking.syncTracking();
  await reloaded.tracking.trackSavedLead(id);
  assert.equal(googleEvents(reloaded, 'generate_lead').length, 0);
  assert.equal(googleEvents(reloaded, 'conversion').length, 0);
  assert.equal(metaEvents(reloaded, 'Lead').length, 0);
  assert.equal(googleEvents(reloaded, 'page_view').length, 1);
  assert.equal(metaEvents(reloaded, 'PageView').length, 1);
});

test('invalid event IDs and private paths emit no saved Lead', async () => {
  const invalid = harness({ url: origin + '/kontakt' });
  invalid.tracking.syncTracking();
  for (const value of [undefined, null, '', 'customer@example.invalid', 'a'.repeat(63)]) {
    await invalid.tracking.trackSavedLead(value);
  }
  assert.equal(googleEvents(invalid, 'generate_lead').length, 0);
  assert.equal(googleEvents(invalid, 'conversion').length, 0);
  assert.equal(metaEvents(invalid, 'Lead').length, 0);
  const privatePage = harness({ url: origin + '/admin/crm-system' });
  privatePage.tracking.syncTracking();
  await privatePage.tracking.trackSavedLead(eventId(11));
  assert.equal(privatePage.scripts.length, 0);
});

test('real request preparation preserves retry ID and gives edited request a fresh ID', () => {
  const { prepareLeadRequest } = harness().load('leadRequest');
  const data = { full_name: 'TEST Routing', service_requested: 'Gewerbereinigung' };
  const first = prepareLeadRequest(null, data);
  const retry = prepareLeadRequest({ ...first, busy: false }, data);
  assert.equal(retry.key, first.key);
  assert.equal(retry.body, first.body);
  const edited = prepareLeadRequest(retry, { ...data, service_requested: 'Baureinigung' });
  assert.notEqual(edited.key, first.key);
  assert.match(edited.key, /^[a-f0-9-]{36}$/);
});
