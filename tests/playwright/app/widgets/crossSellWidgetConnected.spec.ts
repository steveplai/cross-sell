import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { widgetRootSelector } from '../../../../src/runtime/widgetRoot'

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
    path: '/examples/cross-sell-widget-connected/wc/basic.html',
    selector: 'cross-sell-widget-connected',
    text: '探索地區飯店',
  },
  {
    name: 'web component 完整範例',
    path: '/examples/cross-sell-widget-connected/wc/full.html',
    selector: 'cross-sell-widget-connected',
    text: '探索上海飯店',
  },
  {
    name: 'web component visible blocks 範例',
    path: '/examples/cross-sell-widget-connected/wc/visible-blocks.html',
    selector: 'cross-sell-widget-connected',
    text: '探索地區飯店',
  },
  {
    name: 'web component property 範例',
    path: '/examples/cross-sell-widget-connected/wc/property.html',
    selector: 'cross-sell-widget-connected',
    text: '探索上海飯店',
  },
]

const mountApiExamples: MountApiExample[] = [
  {
    name: 'mount API 基本範例',
    path: '/examples/cross-sell-widget-connected/mount/basic.html',
    rootSelector: '#cross-sell-widget-connected-root',
    text: '探索地區飯店',
  },
  {
    name: 'mount API 完整範例',
    path: '/examples/cross-sell-widget-connected/mount/full.html',
    rootSelector: '#cross-sell-widget-connected-root',
    text: '探索上海飯店',
  },
]

const connectedApiResponse = [
  {
    Type: '訂房',
    CombineTagList: ['東京 旅遊'],
    pList: [
      {
        ID: 'JPTYO001',
        Title: '東京灣精選飯店',
        Price: 5830,
        ImgUrl: 'https://static.liontech.com.tw/hotel.jpg',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        SalePrice: 6200,
        Discount: 5,
        Location: {
          Name: '東京車站',
          Distance: 0.5,
          Unit: '公里',
        },
        Level: 5,
        Rating: 4.5,
        RatingCount: 156,
        Likeability: 95,
        CancelTag: '免費取消',
      },
    ],
  },
  {
    Type: '訂房-看更多(搜尋頁)',
    pList: [
      {
        url: 'https://uhotel.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC',
      },
    ],
  },
]

async function mockConnectedApi(page: Page) {
  await page.route('**/category/_fringe/CrossSelling**', async (route) => {
    await route.fulfill({
      body: JSON.stringify(connectedApiResponse),
      contentType: 'application/json',
      headers: {
        'access-control-allow-origin': '*',
      },
      status: 200,
    })
  })
}

async function gotoConnectedExample(page: Page, path: string) {
  await mockConnectedApi(page)
  await page.goto(path, { waitUntil: 'domcontentloaded' })
}

async function getWebComponentWidgetText(page: Page, selector: string) {
  return page.locator(selector).evaluate((element, rootSelector) => {
    const root = element.shadowRoot?.querySelector(rootSelector)

    if (!(root instanceof HTMLElement)) {
      return null
    }

    return root.textContent
  }, widgetRootSelector)
}

test.describe('CrossSellWidgetConnected', () => {
  for (const example of webComponentExamples) {
    test(example.name, async ({ page }) => {
      await gotoConnectedExample(page, example.path)

      await expect(page.locator(example.selector)).toBeAttached()
      await expect
        .poll(() => getWebComponentWidgetText(page, example.selector))
        .toContain(example.text)
    })
  }

  for (const example of mountApiExamples) {
    test(example.name, async ({ page }) => {
      await gotoConnectedExample(page, example.path)

      await expect(
        page.locator(`${example.rootSelector} ${widgetRootSelector}`),
      ).toContainText(example.text)
    })
  }

  test('web component 會 emit item event', async ({ page }) => {
    await gotoConnectedExample(
      page,
      '/examples/cross-sell-widget-connected/wc/basic.html',
    )

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('探索地區飯店')

    await page.locator('cross-sell-widget-connected').evaluate((element) => {
      const buttons = element.shadowRoot?.querySelectorAll('button') ?? []
      const button = Array.from(buttons).find((candidate) =>
        candidate.textContent?.includes('東京灣精選飯店'),
      )
      ;(button as HTMLButtonElement | null)?.click()
    })

    await expect(
      page.getByTestId('cross-sell-widget-connected-event-log'),
    ).toContainText('cross-sell-widget:item-select')
  })

  test('web component 會套用 source product attribute', async ({ page }) => {
    await gotoConnectedExample(
      page,
      '/examples/cross-sell-widget-connected/wc/basic.html',
    )

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('探索地區飯店')

    await page.locator('cross-sell-widget-connected').evaluate((element) => {
      element.setAttribute('source-product', 'hotel')
    })

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .not.toContain('探索地區飯店')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('前往加購')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .not.toContain('簽證護照')
  })

  test('web component 會套用 visible blocks attribute', async ({ page }) => {
    await gotoConnectedExample(
      page,
      '/examples/cross-sell-widget-connected/wc/basic.html',
    )

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('前往加購')

    await page.locator('cross-sell-widget-connected').evaluate((element) => {
      element.setAttribute('visible-blocks', JSON.stringify({ hsr: false }))
    })

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .not.toContain('前往加購')
  })

  test('web component 會忽略 config 內的 visible blocks', async ({ page }) => {
    await gotoConnectedExample(
      page,
      '/examples/cross-sell-widget-connected/wc/basic.html',
    )

    await page.locator('cross-sell-widget-connected').evaluate((element) => {
      element.setAttribute(
        'config',
        JSON.stringify({ visibleBlocks: { hsr: false } }),
      )
    })

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('前往加購')
  })

  test('web component 會套用 config attribute overrides', async ({ page }) => {
    await gotoConnectedExample(
      page,
      '/examples/cross-sell-widget-connected/wc/full.html',
    )

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('Connected WC 限時優惠')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('立即加購')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('提供旅行保障')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('探索上海飯店')
  })

  test('web component 會套用 config property 與 attribute priority', async ({
    page,
  }) => {
    await gotoConnectedExample(
      page,
      '/examples/cross-sell-widget-connected/wc/property.html',
    )

    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('Connected property 限時優惠')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('提供旅行保障')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('探索上海飯店')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .toContain('$6,200')
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, 'cross-sell-widget-connected'),
      )
      .not.toContain('US$6,200')
  })
})
