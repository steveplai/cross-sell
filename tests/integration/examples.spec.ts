import { expect, test } from '@playwright/test'

test('web component example renders and emits event', async ({ page }) => {
  await page.goto('/examples/web-component/cross-sell-banner.events.html')

  await expect(page.locator('cross-sell-banner')).toHaveJSProperty(
    'localName',
    'cross-sell-banner',
  )
  await expect
    .poll(() =>
      page.locator('cross-sell-banner').evaluate((element) => {
        return element.shadowRoot?.textContent ?? ''
      }),
    )
    .toContain('推薦商品')
  await expect(page.getByTestId('event-log')).toContainText('No events yet')

  await page
    .locator('cross-sell-banner')
    .evaluate((element) => {
      const button = element.shadowRoot?.querySelector('button')
      ;(button as HTMLButtonElement | null)?.click()
    })

  await expect(page.getByTestId('event-log')).toContainText(
    'cross-sell:product-select',
  )
})

test('mount API example can update and unmount', async ({ page }) => {
  await page.goto('/examples/mount-api/cross-sell-banner.update.html')

  await expect(page.getByText('推薦商品')).toBeVisible()

  await page.getByRole('button', { name: '更新資料' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toBeVisible()

  await page.getByRole('button', { name: '卸載元件' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toHaveCount(0)
})
