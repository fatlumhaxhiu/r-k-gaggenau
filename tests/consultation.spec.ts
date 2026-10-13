import {test,expect} from '@playwright/test';
import {PrismaClient} from '@prisma/client';
import {testDatabaseUrl} from './testDatabase';
import {mkdirSync} from 'node:fs';
const prisma=new PrismaClient({datasourceUrl:testDatabaseUrl});
const notice='Dieses Formular ist für Reinigungsanfragen, nicht für Bewerbungen.';
const description='Beschreiben Sie kurz Ihren Reinigungsbedarf. Beratung und Besichtigung sind kostenlos und unverbindlich. Ihr Preisangebot erhalten Sie nach der ersten Beratung.';
test.afterAll(async()=>prisma.$disconnect());
test.beforeEach(async({context})=>{
 await context.addInitScript(() => localStorage.setItem('rk_consent_v1', JSON.stringify({version:2,analytics:true,marketing:true,savedAt:Date.now()})));
 // No analytics, emails, or external requests may leave this browser.
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
});
for(const route of ['/landing/gewerbereinigung','/landing/privatreinigung','/landing/grundreinigung','/landing/baureinigung','/landing/spezialreinigung','/landing/saisonale-pflege','/kontakt']) for(const width of [1440,390]) {
 test(`form persists consultation and CRM reload ${route} ${width}`,async({page})=>{
 await page.setViewportSize({width,height:1000});
 const slug=route.split('/').pop(); const email=`test-${slug}-${width}-${Date.now()}@example.invalid`;
 await page.goto(`${route}?utm_source=google&utm_medium=cpc&utm_campaign=TEST-local-consultation`);
 await expect(page.getByText(notice,{exact:true})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Kostenlose Beratung zur Reinigung',exact:true})).toBeVisible();
 await expect(page.getByText(description,{exact:true})).toBeVisible();
 const form=page.locator('form');
 const name=form.getByLabel('Ihr Name'); const service=form.getByLabel('Welche Reinigung benötigen Sie?');const object=form.getByLabel('Was soll gereinigt werden?');
 await expect(name).toHaveAttribute('required','');
 await expect(service).toHaveAttribute('required','');await expect(object).toHaveAttribute('required','');
 await expect(form.locator('[name="phone"]')).toHaveAttribute('required','');
 await expect(form.locator('[name="email"]')).toHaveAttribute('required','');
 await expect(form.locator('[name="city"]')).toHaveAttribute('placeholder','Gaggenau');
 await expect(form.locator('[name="postal_code"], [name="first_name"], [name="last_name"]')).toHaveCount(0);
 await name.fill('TEST Ada von Muster'); await service.selectOption({label:'Grundreinigung'});await object.selectOption({label:'Wohnung / Haus'});
 await form.locator('[name="email"]').fill(email);await form.locator('[name="city"]').fill('Gaggenau');
 if(await form.locator('textarea').count()) await form.locator('textarea').fill('TEST synthetic cleaning enquiry');
 await form.getByRole('button',{name:'Kostenlose Beratung anfragen',exact:true}).click();
 expect(await form.locator('[name="phone"]').evaluate((el:HTMLInputElement)=>el.validity.valueMissing)).toBe(true);
 expect(await prisma.lead.count({where:{email}})).toBe(0);
 await form.locator('[name="phone"]').fill('+49 000 000000');
 const boxes=await Promise.all([name,service,object,form.locator('[name="email"]')].map(x=>x.boundingBox()));
 expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y);expect(boxes[3]!.y).toBeGreaterThan(boxes[2]!.y);
 if(width>=768) expect(Math.abs(boxes[1]!.y-boxes[2]!.y)).toBeLessThan(2);
 else expect(boxes[2]!.y).toBeGreaterThan(boxes[1]!.y+boxes[1]!.height);
 if(width>1000) expect(boxes[0]!.width).toBeGreaterThan(boxes[1]!.width*1.8);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await form.getByRole('button',{name:'Kostenlose Beratung anfragen',exact:true}).evaluate(el=>el.scrollWidth<=el.clientWidth)).toBe(true);
 mkdirSync('.local-tests/screenshots',{recursive:true});
 await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:`.local-tests/screenshots/${slug}-${width}-page.png`,fullPage:true});
 await form.screenshot({path:`.local-tests/screenshots/${slug}-${width}-form.png`});
 const response=page.waitForResponse(r=>r.url().endsWith('/api/leads')&&r.request().method()==='POST');
 await form.getByRole('button',{name:'Kostenlose Beratung anfragen',exact:true}).click(); expect((await response).status()).toBe(201);
 await expect(page).toHaveURL(/\/thank-you$/);
 const lead=await prisma.lead.findFirstOrThrow({where:{email}});
 expect(lead).toMatchObject({full_name:'TEST Ada von Muster',service_requested:'Grundreinigung',object_type:'Wohnung / Haus',city:'Gaggenau',phone:'+49 000 000000',email,source_page:route,marketing_channel:'Google Ads',campaign_name:'TEST-local-consultation'});
 await page.goto('/admin/admin-login');await page.waitForLoadState('networkidle');await page.locator('[name="email"]').fill('test-admin@example.invalid');await page.locator('[name="password"]').fill('TEST-local-only-2026!');
 await page.getByRole('button',{name:'Sign In',exact:true}).click();await expect(page).toHaveURL(/\/admin\/dashboard/,{timeout:30000});
 await page.goto('/admin/crm-system');await page.reload();await page.getByText(email,{exact:true}).click();
 await expect(page.getByRole('heading',{name:'Detajet e Lead-it'})).toBeVisible();
 const panel=page.locator('div.fixed').filter({has:page.getByRole('heading',{name:'Detajet e Lead-it'})});
 await expect(panel.getByRole('heading',{name:'TEST Ada von Muster',exact:true})).toBeVisible();
 await expect(panel.getByText('Welche Reinigung benötigen Sie?',{exact:true})).toBeVisible();
 await expect(panel.getByText('Was soll gereinigt werden?',{exact:true})).toBeVisible();
 await expect(panel.getByText('Wohnung / Haus',{exact:true})).toBeVisible();
 for(const text of ['Gaggenau','Google Ads','TEST-local-consultation',route]) await expect(panel.getByText(text,{exact:false}).first()).toBeVisible();
 await panel.screenshot({path:`.local-tests/screenshots/${slug}-${width}-crm.png`});
 });
}


for (const route of ['/kontakt', '/landing/baureinigung']) {
 test('whitespace-only name is blocked before submission ' + route, async ({page}) => {
  await page.goto(route);
  const form=page.locator('form');
  await form.locator('[name="full_name"]').fill('   ');
  await form.locator('[name="service_requested"]').selectOption('Grundreinigung');
  await form.locator('[name="object_type"]').selectOption('Wohnung / Haus');
  await form.locator('[name="email"]').fill('test-blank-name-browser@example.invalid');
  await form.locator('[name="phone"]').fill('+49 000000');
  await form.locator('[name="city"]').fill('Gaggenau');
  if(await form.locator('textarea').count()) await form.locator('textarea').fill('TEST synthetic');
  const submissions: string[]=[];
  await page.route('**/api/leads', async request => {
   submissions.push(request.request().method());
   await request.fulfill({status:500,body:'Unexpected request'});
  });
  await form.getByRole('button',{name:'Kostenlose Beratung anfragen',exact:true}).click();
  expect(await form.locator('[name="full_name"]').evaluate((el:HTMLInputElement)=>el.validity.patternMismatch)).toBe(true);
  await expect(form.locator('[name="full_name"]')).toBeFocused();
  expect(submissions).toEqual([]);
  await form.locator('[name="full_name"]').fill('Ada von Muster');
  expect(await form.locator('[name="full_name"]').evaluate((el:HTMLInputElement)=>el.checkValidity())).toBe(true);
 });
}
