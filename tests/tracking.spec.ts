import {test,expect} from '@playwright/test';

test('local review disables analytics scripts and requests including thank-you',async({page,context})=>{
 const analytics:string[]=[];
 await context.route('**/*',route=>{
  const url=new URL(route.request().url());
  if(/googletagmanager|google-analytics|googleadservices|doubleclick|facebook.*\/tr/i.test(url.href)) analytics.push(url.href);
  return url.hostname==='127.0.0.1'?route.continue():route.abort();
 });
 for(const route of ['/kontakt','/thank-you']) {
  const response=await page.goto(route);
  expect(response!.status()).toBe(200);
  // Assert the server-rendered script descriptors too: absence before hydration is not sufficient.
  expect(await response!.text()).not.toContain('AW-18267690559');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('script[src*="googletagmanager"],script#google-ads-gtag')).toHaveCount(0);
  expect(await page.evaluate(()=>typeof (window as Window & {gtag?:unknown}).gtag)).toBe('undefined');
 }
 expect(analytics).toEqual([]);
});
