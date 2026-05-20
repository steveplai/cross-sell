import { expect, test } from '@playwright/test'

type CrossSellWidgetTestWindow = Window & {
  __crossSellEvents?: string[]
}

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
      page.locator('[data-testid$="-carousel"]').first(),
    ).toBeVisible()

    await expect(
      page.getByTestId('cross-sell-view-more-placeholder').first(),
    ).toBeVisible()
  })

  test('dispatches custom events', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await page.evaluate(() => {
      const widget = document.querySelector('cross-sell-widget')
      const testWindow = window as CrossSellWidgetTestWindow

      testWindow.__crossSellEvents = []

      widget?.addEventListener('cross-sell-widget:item-select', (event) => {
        testWindow.__crossSellEvents?.push(event.type)
      })
    })

    await page.getByText('東京灣精選飯店').click()

    const events = await page.evaluate(
      () => (window as CrossSellWidgetTestWindow).__crossSellEvents ?? [],
    )

    expect(events).toContain('cross-sell-widget:item-select')
  })

  test('normalizes missing sections from data attribute and property', async ({
    page,
  }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await page.locator('cross-sell-widget').evaluate((element) => {
      element.setAttribute('data', '{}')
    })

    await expect(page.getByText('您已解鎖限時優惠！')).toBeVisible()

    await page.locator('cross-sell-widget').evaluate((element) => {
      ;(element as HTMLElement & { data?: unknown }).data = {}
    })

    await expect(page.getByText('您已解鎖限時優惠！')).toBeVisible()
  })
})
