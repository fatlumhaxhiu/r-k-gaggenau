import { test, expect } from '@playwright/test'
import { PrismaClient } from '@prisma/client'
import { testDatabaseUrl } from './testDatabase'
import { retentionDeadline, retentionState } from '../src/lib/leadRetention'
const prisma = new PrismaClient({ datasourceUrl: testDatabaseUrl })
test.afterAll(() => prisma.$disconnect())

test('six calendar months clamp month-end; exclusions remain excluded', () => {
  expect(retentionDeadline('2025-08-31T12:00:00Z').toISOString()).toBe('2026-02-28T12:00:00.000Z')
  expect(retentionDeadline('2023-08-31T12:00:00Z').toISOString()).toBe('2024-02-29T12:00:00.000Z')
  const lead = { status: 'archived', converted_at: null, closed_at: '2026-01-15T12:00:00Z', closure_reason: 'No order', retention_hold_reason: null, retention_review_at: null }
  expect(retentionState(lead, new Date('2026-07-15T11:59:59Z')).kind).toBe('waiting')
  expect(retentionState(lead, new Date('2026-07-15T12:00:00Z')).kind).toBe('due')
  expect(retentionState({ ...lead, closed_at: null }).kind).toBe('undocumented')
  expect(retentionState({ ...lead, status: 'contacted' }).kind).toBe('active')
  expect(retentionState({ ...lead, converted_at: new Date() }).kind).toBe('customer')
  expect(retentionState({ ...lead, retention_hold_reason: 'Open dispute', retention_review_at: '2020-01-01' }).kind).toBe('hold')
})

test('retention mutations require login', async ({ request }) => {
  const result = await request.patch('/api/leads/00000000-0000-0000-0000-000000000000', { data: { retention_action: 'close_without_order', reason: 'test' } })
  expect(result.status()).toBe(401)
})

test('document closure, review due records, hold deletion, reopen and protect customers', async ({ page, context }) => {
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort())
  const lead = await prisma.lead.create({ data: { first_name: 'TEST', last_name: 'Retention', full_name: 'TEST Retention', email: `retention-${Date.now()}@example.invalid`, status: 'archived', created_at: new Date('2020-01-01') } })
  const url = `/api/leads/${lead.id}`
  try {
    await page.goto('/admin/admin-login')
    await page.locator('[name="email"]').fill('test-admin@example.invalid')
    await page.locator('[name="password"]').fill('TEST-local-only-2026!')
    await page.getByRole('button', { name: 'Sign In', exact: true }).click()
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 30000 })
    await page.goto('/admin/crm-system')
    await page.getByRole('combobox', { name: 'Shqyrtimi i ruajtjes' }).selectOption('due')
    await expect(page.getByText(lead.email, { exact: true })).toHaveCount(0)
    await page.getByRole('combobox', { name: 'Shqyrtimi i ruajtjes' }).selectOption('undocumented')
    await page.getByRole('button', { name: 'Shiko lead-in TEST Retention' }).click()
    await page.getByRole('textbox', { name: 'Arsyeja e ruajtjes ose mbylljes' }).fill('Nuk u arrit porosi; sqarim i ofertës')
    await page.getByRole('button', { name: 'Mbyll pa porosi', exact: true }).click()
    await expect(page.getByText(/Mbyllur më/)).toBeVisible()
    let saved = await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } })
    expect(saved.closed_at).not.toBeNull()
    const firstClosed = saved.closed_at!.getTime()
    expect((await context.request.patch(url, { data: { retention_action: 'close_without_order', reason: 'retry' } })).status()).toBe(409)
    expect((await context.request.patch(url, { data: { status: 'invalid' } })).status()).toBe(400)
    expect((await context.request.patch(url, { data: { retention_action: 'set_hold', reason: 'Dispute', review_at: '2020-01-01' } })).status()).toBe(400)
    const review = new Date(Date.now() + 86400000 * 30).toISOString()
    expect((await context.request.patch(url, { data: { retention_action: 'set_hold', reason: 'Contract review', review_at: review } })).status()).toBe(200)
    expect((await context.request.delete(url)).status()).toBe(409)
    expect((await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } })).closed_at!.getTime()).toBe(firstClosed)
    expect((await context.request.patch(url, { data: { retention_action: 'clear_hold' } })).status()).toBe(200)
    await prisma.lead.update({ where: { id: lead.id }, data: { closed_at: new Date('2020-01-01') } })
    await page.reload()
    await page.getByRole('combobox', { name: 'Shqyrtimi i ruajtjes' }).selectOption('due')
    await expect(page.getByText(lead.email, { exact: true })).toBeVisible()
    expect((await context.request.patch(url, { data: { status: 'contacted' } })).status()).toBe(200)
    saved = await prisma.lead.findUniqueOrThrow({ where: { id: lead.id } })
    expect(saved.closed_at).toBeNull(); expect(saved.closure_reason).toBeNull()
    expect(saved.updated_at!.getTime()).toBeGreaterThan(lead.updated_at!.getTime())
    expect((await context.request.patch(url, { data: { status: 'converted' } })).status()).toBe(200)
    expect((await context.request.patch(url, { data: { status: 'archived' } })).status()).toBe(200)
    expect((await context.request.patch(url, { data: { retention_action: 'close_without_order', reason: 'mistake' } })).status()).toBe(409)
  } finally { await prisma.lead.deleteMany({ where: { id: lead.id } }) }
})
