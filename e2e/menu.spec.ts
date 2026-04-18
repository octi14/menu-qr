import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

const mockBusiness = {
  id: 'e2e-1',
  name: 'Resto E2E',
  slug: 'e2e-rest',
  isActive: true,
  fontFamily: 'inter',
  hideName: false,
  sections: [
    {
      id: 's1',
      name: 'Principal',
      items: [{ id: 'i1', name: 'Pizza', price: 1200, description: '', isAvailable: true }],
    },
  ],
}

test('menú público muestra datos cuando la API responde', async ({ page }) => {
  await page.route('**/api/businesses?slug=e2e-rest**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockBusiness),
    })
  })
  await page.route('**/api/businesses/e2e-rest/check-access**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ isPublic: true }),
    })
  })

  await page.goto('/e2e-rest/menu')
  await expect(page.getByRole('heading', { name: 'Resto E2E' })).toBeVisible({ timeout: 20000 })
  await expect(page.getByText('Pizza')).toBeVisible()
})

test('slug inexistente muestra mensaje de no encontrado', async ({ page }) => {
  const body404 = JSON.stringify({ statusCode: 404, message: 'Business not found' })
  await page.route('**/api/businesses?slug=missing-xyz**', async (route) => {
    await route.fulfill({ status: 404, contentType: 'application/json', body: body404 })
  })
  await page.route('**/api/businesses/missing-xyz**', async (route) => {
    await route.fulfill({ status: 404, contentType: 'application/json', body: body404 })
  })

  await page.goto('/missing-xyz/menu')
  await expect(page.getByRole('heading', { name: 'Menú no encontrado' })).toBeVisible({
    timeout: 20000,
  })
})

test('fallo de red muestra reintentar', async ({ page }) => {
  await page.route('**/api/businesses**', async (route) => {
    const url = route.request().url()
    if (url.includes('net-err')) {
      await route.abort('failed')
      return
    }
    await route.continue()
  })

  await page.goto('/net-err/menu')
  await expect(page.getByRole('heading', { name: 'No pudimos cargar el menú' })).toBeVisible({
    timeout: 20000,
  })
  await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible()
})
