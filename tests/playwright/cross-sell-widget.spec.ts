import { expect, test } from '@playwright/test'

test.describe('CrossSellWidget', () => {
  test('renders widget content correctly', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await expect(page.getByText('您已解鎖限時優惠！')).toBeVisible()
    await expect(page.getByText('加購交通 行程更順暢')).toBeVisible()
    await expect(page.getByText('東京灣精選飯店')).toBeVisible()
  })

  test('renders carousel and view more placeholder', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await expect(
      page.getByTestId('cross-sell-carousel').first(),
    ).toBeVisible()

    await expect(
      page.getByTestId('cross-sell-view-more-placeholder').first(),
    ).toBeVisible()
  })

  test('dispatches custom events', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await page.evaluate(() => {
      const widget = document.querySelector('cross-sell-widget')

      window.__crossSellEvents = []

      widget?.addEventListener('cross-sell-widget:item-select', (event) => {
        window.__crossSellEvents.push(event.type)
      })
    })

    await page.getByText('東京灣精選飯店').click()

    const events = await page.evaluate(() => window.__crossSellEvents)

    expect(events).toContain('cross-sell-widget:item-select')
  })
})
