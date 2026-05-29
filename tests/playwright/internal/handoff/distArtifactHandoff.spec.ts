import { expect, test } from '@playwright/test'

import { widgetRootSelector } from '../../../../src/runtime/widgetRoot'

test('Web Component example 會從純 HTML 頁面載入 built dist artifact', async ({
  page,
}) => {
  await page.goto('/examples/demo-product-banner/wc/basic.html', {
    waitUntil: 'domcontentloaded',
  })

  const element = page.locator('demo-product-banner')

  await expect(element).toBeAttached()
  await expect(element).toHaveJSProperty('localName', 'demo-product-banner')
  await expect
    .poll(() =>
      element.evaluate((candidate, rootSelector) => {
        const root = candidate.shadowRoot?.querySelector(rootSelector)

        return root instanceof HTMLElement ? root.textContent : null
      }, widgetRootSelector),
    )
    .toContain('推薦商品')
})

test('Mount API example 會從純 HTML 頁面載入 built dist artifact', async ({
  page,
}) => {
  await page.goto('/examples/demo-product-banner/mount/basic.html', {
    waitUntil: 'domcontentloaded',
  })

  await expect(
    page.locator(`#demo-product-root ${widgetRootSelector}`),
  ).toContainText('推薦商品')
})
