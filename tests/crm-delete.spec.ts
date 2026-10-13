import { expect, test } from "@playwright/test"
import { PrismaClient } from "@prisma/client"
import { testDatabaseUrl } from "./testDatabase"

const prisma = new PrismaClient({
  datasourceUrl: testDatabaseUrl,
})

test.afterAll(async () => prisma.$disconnect())

test("admin can cancel and then permanently delete a lead from CRM", async ({ page, context }) => {
  await context.route("**/*", (route) =>
    new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort()
  )

  const email = `test-delete-${Date.now()}@example.invalid`
  const lead = await prisma.lead.create({
    data: {
      full_name: "TEST Delete Lead",
      first_name: "TEST",
      last_name: "Delete Lead",
      email,
      phone: "+49 000 000000",
      city: "Gaggenau",
      service_requested: "Grundreinigung",
      object_type: "Wohnung / Haus",
      source_page: "/test-delete",
      status: "new",
    },
  })

  try {
    await page.goto("/admin/admin-login")
    await page.locator('[name="email"]').fill("test-admin@example.invalid")
    await page.locator('[name="password"]').fill("TEST-local-only-2026!")
    await page.getByRole("button", { name: "Sign In", exact: true }).click()
    await expect(page).toHaveURL(/\/admin\/dashboard/, { timeout: 30_000 })

    await page.goto("/admin/crm-system")
    await expect(page.getByText(email, { exact: true })).toBeVisible()

    page.once("dialog", (dialog) => dialog.dismiss())
    await page.getByRole("button", { name: "Fshi lead-in TEST Delete Lead" }).click()
    await expect(page.getByText(email, { exact: true })).toBeVisible()
    expect(await prisma.lead.findUnique({ where: { id: lead.id } })).not.toBeNull()

    page.once("dialog", (dialog) => dialog.accept())
    const deleteResponse = page.waitForResponse(
      (response) => response.url().endsWith(`/api/leads/${lead.id}`) && response.request().method() === "DELETE"
    )
    await page.getByRole("button", { name: "Fshi lead-in TEST Delete Lead" }).click()
    expect((await deleteResponse).status()).toBe(200)

    await expect(page.getByText(email, { exact: true })).toHaveCount(0)
    expect(await prisma.lead.findUnique({ where: { id: lead.id } })).toBeNull()

    await page.reload()
    await expect(page.getByText(email, { exact: true })).toHaveCount(0)
  } finally {
    await prisma.lead.deleteMany({ where: { id: lead.id } })
  }
})

test("lead delete endpoint requires an authenticated admin", async ({ request }) => {
  const response = await request.delete("/api/leads/00000000-0000-0000-0000-000000000000")
  expect(response.status()).toBe(401)
})
