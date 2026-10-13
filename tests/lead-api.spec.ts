import { test, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import {testDatabaseUrl} from './testDatabase';
const prisma = new PrismaClient({datasourceUrl:testDatabaseUrl});
test.afterAll(async()=>prisma.$disconnect());
test('server rejects missing phone without persisting a lead', async ({request})=>{
 const email='test-no-phone@example.invalid';
 const before=await prisma.lead.count({where:{email}});
 for(const phone of [undefined,'','   ']) {
 const response=await request.post('/api/leads',{data:{first_name:'TEST',last_name:'No Phone',full_name:'TEST No Phone',email,city:'Gaggenau',service_requested:'Grundreinigung',object_type:'Wohnung / Haus',phone}});
 expect(response.status()).toBe(400);
 }
 expect(await prisma.lead.count({where:{email}})).toBe(before);
});


test('explicit blank full_name cannot fall back to legacy names', async ({request}) => {
 const email='test-blank-name-regression@example.invalid';
 const before=await prisma.lead.count({where:{email}});
 for(const full_name of ['', '   ', null, 123]) {
  const response=await request.post('/api/leads',{data:{full_name,first_name:'Kontakt',last_name:'Inquiry',email,phone:'+49 000000',city:'Gaggenau',service_requested:'Grundreinigung',object_type:'Wohnung / Haus'}});
  expect(response.status()).toBe(400);
 }
 expect(await prisma.lead.count({where:{email}})).toBe(before);
});
