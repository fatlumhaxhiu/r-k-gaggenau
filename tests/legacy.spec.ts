import {test,expect} from '@playwright/test';
import {PrismaClient} from '@prisma/client';
import {readFileSync} from 'node:fs';
const prisma=new PrismaClient({datasourceUrl:testDatabaseUrl});
import {testDatabaseUrl} from './testDatabase';
test.afterAll(async()=>prisma.$disconnect());
test('legacy nullable consultation fields survive additive migration and CRM reload',async({page,context})=>{
 await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
 const email=`test-legacy-${Date.now()}@example.invalid`;
 const lead=await prisma.lead.create({data:{first_name:'TEST Legacy',last_name:'Kunde',email,phone:null,full_name:null,object_type:null,service_requested:'Alte Reinigung',source_page:'/legacy-test',city:'Gaggenau',marketing_channel:'Facebook Ads',campaign_name:'TEST-legacy-campaign'}});
 const sql=readFileSync('prisma/add-lead-consultation.sql','utf8').replace(/--[^\r\n]*/g,'');
 for(let i=0;i<2;i++) for(const statement of sql.split(';').filter(s=>s.trim())) await prisma.$executeRawUnsafe(statement);
 expect(await prisma.lead.findUniqueOrThrow({where:{id:lead.id}})).toEqual(lead);
 await page.goto('/admin/admin-login');await page.waitForLoadState('networkidle');
 await page.locator('[name="email"]').fill('test-admin@example.invalid');await page.locator('[name="password"]').fill('TEST-local-only-2026!');await page.getByRole('button',{name:'Sign In',exact:true}).click();
 await expect(page).toHaveURL(/\/admin\/dashboard/,{timeout:30000});
 await page.goto('/admin/crm-system');await page.reload();await page.getByText(email,{exact:true}).click();
 const panel=page.locator('div.fixed').filter({has:page.getByRole('heading',{name:'Detajet e Lead-it'})});
 await expect(panel.getByRole('heading',{name:'TEST Legacy Kunde',exact:true})).toBeVisible();
 for(const text of ['Nicht erfasst','Alte Reinigung','Facebook Ads','TEST-legacy-campaign','/legacy-test']) await expect(panel.getByText(text,{exact:false}).first()).toBeVisible();
 await panel.screenshot({path:'.local-tests/screenshots/legacy-crm.png'});
});

test('split-name API compatibility retains name and source with required new fields',async({request})=>{
 const email=`test-split-${Date.now()}@example.invalid`;
 const response=await request.post('/api/leads',{data:{first_name:'TEST Old',last_name:'Client',email,phone:'+49 000 000000',city:'Gaggenau',service_requested:'Grundreinigung',object_type:'Wohnung / Haus',source_page:'/legacy-client',marketing_channel:'Organik'}});
 expect(response.status()).toBe(201);
 expect(await prisma.lead.findFirstOrThrow({where:{email}})).toMatchObject({full_name:'TEST Old Client',object_type:'Wohnung / Haus',source_page:'/legacy-client',marketing_channel:'Organik'});
});

test('required fields reject absent or blank values without persisting and CRM API requires auth',async({request})=>{
 expect((await request.get('/api/leads')).status()).toBe(401);
 const email='test-required-fields@example.invalid';
 const data={full_name:'TEST Required',email,phone:'+49 000 000000',city:'Gaggenau',service_requested:'Grundreinigung',object_type:'Wohnung / Haus'};
 const before=await prisma.lead.count({where:{email}});
 for(const field of ['full_name','email','city','service_requested','object_type']) for(const value of [undefined,'','   ']) expect((await request.post('/api/leads',{data:{...data,[field]:value}})).status()).toBe(400);
 expect(await prisma.lead.count({where:{email}})).toBe(before);
});
