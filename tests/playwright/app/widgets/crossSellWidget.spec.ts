import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { widgetRootSelector } from '../../../../src/runtime/widgetRoot'

type CrossSellWidgetTestWindow = Window & {
  __crossSellEvents?: string[]
}

const hsrAddonUrl =
  'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575'

type WebComponentExample = {
  name: string
  path: string
  selector: string
  text: string
}

type MountApiExample = {
  name: string
  path: string
  rootSelector: string
  text: string
}

const webComponentExamples: WebComponentExample[] = [
  {
    name: 'web component 基本範例',
    path: '/examples/cross-sell-widget/wc/basic.html',
    selector: 'cross-sell-widget',
    text: '探索地區飯店',
  },
  {
    name: 'web component 完整範例',
    path: '/examples/cross-sell-widget/wc/full.html',
    selector: 'cross-sell-widget',
    text: '探索上海飯店',
  },
  {
    name: 'web component property 範例',
    path: '/examples/cross-sell-widget/wc/property.html',
    selector: 'cross-sell-widget',
    text: '探索上海飯店',
  },
]

const mountApiExamples: MountApiExample[] = [
  {
    name: 'mount API 基本範例',
    path: '/examples/cross-sell-widget/mount/basic.html',
    rootSelector: '#cross-sell-widget-root',
    text: '探索地區飯店',
  },
  {
    name: 'mount API 完整範例',
    path: '/examples/cross-sell-widget/mount/full.html',
    rootSelector: '#cross-sell-widget-root',
    text: '探索上海飯店',
  },
]

async function getWebComponentWidgetText(page: Page, selector: string) {
  return page.locator(selector).evaluate((element, rootSelector) => {
    const root = element.shadowRoot?.querySelector(rootSelector)

    if (!(root instanceof HTMLElement)) {
      return null
    }

    return root.textContent
  }, widgetRootSelector)
}

async function getWebComponentHsrLinkState(page: Page, selector: string) {
  return page.locator(selector).evaluate((element) => {
    const anchors = element.shadowRoot?.querySelectorAll('a') ?? []
    const link = Array.from(anchors).find(
      (candidate) => candidate.textContent?.trim() === '前往加購',
    )

    if (!(link instanceof HTMLAnchorElement)) {
      return null
    }

    return {
      href: link.href,
      rel: link.rel,
      target: link.target,
    }
  })
}

test.describe('CrossSellWidget', () => {
  for (const example of webComponentExamples) {
    test(example.name, async ({ page }) => {
      await page.goto(example.path, { waitUntil: 'domcontentloaded' })

      await expect(page.locator(example.selector)).toBeAttached()
      await expect
        .poll(() => getWebComponentWidgetText(page, example.selector))
        .toContain(example.text)
    })
  }

  for (const example of mountApiExamples) {
    test(example.name, async ({ page }) => {
      await page.goto(example.path, { waitUntil: 'domcontentloaded' })

      await expect(
        page.locator(`${example.rootSelector} ${widgetRootSelector}`),
      ).toContainText(example.text)
    })
  }

  test('會正確渲染 widget 內容', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await expect(page.getByText('您已解鎖限時優惠！')).toBeVisible()
    await expect(page.getByText('加購高鐵 行程更順暢')).toBeVisible()
    await expect(page.getByText('東京灣精選飯店')).toBeVisible()
  })

  test('會渲染 carousel 與 view more placeholder', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/basic.html')

    await expect(
      page.locator('[data-testid$="-carousel"]').first(),
    ).toBeVisible()

    await expect(
      page.getByTestId('cross-sell-view-more-placeholder').first(),
    ).toBeVisible()
  })

  test('會 dispatch custom events', async ({ page }) => {
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

  test('會正規化 data attribute 與 property 缺少 sections 的情境', async ({
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

  test('web component 會暴露 HSR addon link 與 event', async ({ page }) => {
    await page.goto('/examples/cross-sell-widget/wc/full.html', {
      waitUntil: 'domcontentloaded',
    })

    await expect
      .poll(() => getWebComponentHsrLinkState(page, 'cross-sell-widget'))
      .toEqual({
        href: hsrAddonUrl,
        rel: 'noopener noreferrer',
        target: '_blank',
      })

    await page.locator('cross-sell-widget').evaluate((element) => {
      const anchors = element.shadowRoot?.querySelectorAll('a') ?? []
      const link = Array.from(anchors).find(
        (candidate) => candidate.textContent?.trim() === '前往加購',
      )

      if (link instanceof HTMLAnchorElement) {
        link.addEventListener('click', (event) => event.preventDefault())
        link.click()
      }
    })

    await expect(page.getByTestId('cross-sell-widget-event-log')).toContainText(
      'cross-sell-widget:addon-select: hsr',
    )
  })
})
