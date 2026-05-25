import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { widgetRootSelector } from '../../../../src/runtime/widgetRoot'

const demoProductBannerThemeTokens = {
  primary: 'oklch(52% .18 250)',
  radius: '.625rem',
  ring: 'oklch(52% .18 250)',
}

type WebComponentExample = {
  name: string
  path: string
  widgets: Array<{
    selector: string
    text: string
    index?: number
  }>
}

type MountApiExample = {
  name: string
  path: string
  rootSelector: string
  text: string
}

const webComponentExamples: WebComponentExample[] = [
  {
    name: 'web component basic',
    path: '/examples/demo-product-banner/wc/basic.html',
    widgets: [
      {
        selector: 'demo-product-banner',
        text: '推薦商品',
      },
    ],
  },
  {
    name: 'web component custom theme',
    path: '/examples/themed-demo-product-banner/wc/basic.html',
    widgets: [
      {
        selector: 'themed-demo-product-banner',
        text: '客製主題推薦商品',
      },
    ],
  },
  {
    name: 'web component dark mode',
    path: '/examples/demo-product-banner/wc/dark.html',
    widgets: [
      {
        selector: '#explicit-dark',
        text: '深色推薦商品',
      },
      {
        selector: '#default-light',
        text: '預設亮色商品',
      },
    ],
  },
  {
    name: 'web component events',
    path: '/examples/demo-product-banner/wc/events.html',
    widgets: [
      {
        selector: 'demo-product-banner',
        text: '推薦商品',
      },
    ],
  },
  {
    name: 'web component multiple instances',
    path: '/examples/demo-product-banner/wc/multiple.html',
    widgets: [
      {
        selector: 'demo-product-banner',
        text: '推薦商品 A',
        index: 0,
      },
      {
        selector: 'demo-product-banner',
        text: '推薦商品 B',
        index: 1,
      },
    ],
  },
  {
    name: 'cross sell widget web component basic',
    path: '/examples/cross-sell-widget/wc/basic.html',
    widgets: [
      {
        selector: 'cross-sell-widget',
        text: '探索地區飯店',
      },
    ],
  },
  {
    name: 'cross sell widget web component full',
    path: '/examples/cross-sell-widget/wc/full.html',
    widgets: [
      {
        selector: 'cross-sell-widget',
        text: '探索上海飯店',
      },
    ],
  },
  {
    name: 'cross sell widget web component property',
    path: '/examples/cross-sell-widget/wc/property.html',
    widgets: [
      {
        selector: 'cross-sell-widget',
        text: '探索上海飯店',
      },
    ],
  },
  {
    name: 'cross sell widget connected web component basic',
    path: '/examples/cross-sell-widget-connected/wc/basic.html',
    widgets: [
      {
        selector: 'cross-sell-widget-connected',
        text: '探索地區飯店',
      },
    ],
  },
  {
    name: 'cross sell widget connected web component full',
    path: '/examples/cross-sell-widget-connected/wc/full.html',
    widgets: [
      {
        selector: 'cross-sell-widget-connected',
        text: '探索上海飯店',
      },
    ],
  },
  {
    name: 'cross sell widget connected web component property',
    path: '/examples/cross-sell-widget-connected/wc/property.html',
    widgets: [
      {
        selector: 'cross-sell-widget-connected',
        text: '探索上海飯店',
      },
    ],
  },
] as const

const mountApiExamples: MountApiExample[] = [
  {
    name: 'mount API basic',
    path: '/examples/demo-product-banner/mount/basic.html',
    rootSelector: '#demo-product-root',
    text: '推薦商品',
  },
  {
    name: 'mount API custom theme',
    path: '/examples/themed-demo-product-banner/mount/basic.html',
    rootSelector: '#custom-theme-root',
    text: '客製主題推薦商品',
  },
  {
    name: 'mount API dark mode',
    path: '/examples/demo-product-banner/mount/dark.html',
    rootSelector: '#dark-root',
    text: '繼承深色商品',
  },
  {
    name: 'mount API unmount',
    path: '/examples/demo-product-banner/mount/unmount.html',
    rootSelector: '#demo-product-root',
    text: '推薦商品',
  },
  {
    name: 'mount API update',
    path: '/examples/demo-product-banner/mount/update.html',
    rootSelector: '#demo-product-root',
    text: '推薦商品',
  },
  {
    name: 'cross sell widget mount API basic',
    path: '/examples/cross-sell-widget/mount/basic.html',
    rootSelector: '#cross-sell-widget-root',
    text: '探索地區飯店',
  },
  {
    name: 'cross sell widget mount API full',
    path: '/examples/cross-sell-widget/mount/full.html',
    rootSelector: '#cross-sell-widget-root',
    text: '探索上海飯店',
  },
  {
    name: 'cross sell widget connected mount API basic',
    path: '/examples/cross-sell-widget-connected/mount/basic.html',
    rootSelector: '#cross-sell-widget-connected-root',
    text: '探索地區飯店',
  },
  {
    name: 'cross sell widget connected mount API full',
    path: '/examples/cross-sell-widget-connected/mount/full.html',
    rootSelector: '#cross-sell-widget-connected-root',
    text: '探索上海飯店',
  },
] as const

const darkBackgroundColor = 'rgb(10, 11, 11)'
const lightBackgroundColor = 'rgb(255, 255, 255)'
const hsrAddonUrl =
  'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575'
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

function normalizeCssValue(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeThemeState(
  state: { backgroundColor: string; colorScheme: string } | null,
) {
  if (!state) {
    return null
  }

  const backgroundColor = normalizeCssValue(state.backgroundColor).toLowerCase()

  return {
    hasDarkBackground: backgroundColor === darkBackgroundColor,
    hasLightBackground: backgroundColor === lightBackgroundColor,
    hasDarkColorScheme: state.colorScheme.includes('dark'),
    hasLightColorScheme: state.colorScheme.includes('light'),
  }
}

function normalizeTokenState(
  state: { primary: string; radius: string; ring: string } | null,
) {
  if (!state) {
    return null
  }

  return {
    primary: normalizeCssValue(state.primary),
    radius: normalizeCssValue(state.radius),
    ring: normalizeCssValue(state.ring),
  }
}

async function gotoHandoffExample(page: Page, path: string) {
  if (path.includes('cross-sell-widget-connected')) {
    await mockConnectedApi(page)
  }

  await page.goto(path, { waitUntil: 'domcontentloaded' })
}

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

async function getWebComponentWidgetState(page: Page, selector: string) {
  const state = await page
    .locator(selector)
    .evaluate((element, rootSelector) => {
      const root = element.shadowRoot?.querySelector(rootSelector)

      if (!(root instanceof HTMLElement)) {
        return null
      }

      const styles = getComputedStyle(root)

      return {
        backgroundColor: styles.backgroundColor,
        colorScheme: styles.colorScheme,
      }
    }, widgetRootSelector)

  return normalizeThemeState(state)
}

async function getWebComponentWidgetText(
  page: Page,
  selector: string,
  index = 0,
) {
  return page
    .locator(selector)
    .nth(index)
    .evaluate((element, rootSelector) => {
      const root = element.shadowRoot?.querySelector(rootSelector)

      if (!(root instanceof HTMLElement)) {
        return null
      }

      return root.textContent
    }, widgetRootSelector)
}

async function getWebComponentWidgetTokenState(page: Page, selector: string) {
  const state = await page
    .locator(selector)
    .evaluate((element, rootSelector) => {
      const root = element.shadowRoot?.querySelector(rootSelector)

      if (!(root instanceof HTMLElement)) {
        return null
      }

      const styles = getComputedStyle(root)

      return {
        primary: styles.getPropertyValue('--primary'),
        radius: styles.getPropertyValue('--radius'),
        ring: styles.getPropertyValue('--ring'),
      }
    }, widgetRootSelector)

  return normalizeTokenState(state)
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

async function expectWebComponentExampleRenders(
  page: Page,
  example: WebComponentExample,
) {
  await gotoHandoffExample(page, example.path)

  for (const widget of example.widgets) {
    const locator = page.locator(widget.selector).nth(widget.index ?? 0)

    await expect(locator).toBeAttached()
    await expect
      .poll(() =>
        getWebComponentWidgetText(page, widget.selector, widget.index ?? 0),
      )
      .toContain(widget.text)
  }
}

async function getLightDomWidgetState(page: Page, selector: string) {
  const state = await page.locator(selector).evaluate((root) => {
    const styles = getComputedStyle(root)

    return {
      backgroundColor: styles.backgroundColor,
      colorScheme: styles.colorScheme,
    }
  })

  return normalizeThemeState(state)
}

async function getLightDomWidgetTokenState(page: Page, selector: string) {
  const state = await page.locator(selector).evaluate((root) => {
    const styles = getComputedStyle(root)

    return {
      primary: styles.getPropertyValue('--primary'),
      radius: styles.getPropertyValue('--radius'),
      ring: styles.getPropertyValue('--ring'),
    }
  })

  return normalizeTokenState(state)
}

async function expectMountApiExampleRenders(
  page: Page,
  example: MountApiExample,
) {
  await gotoHandoffExample(page, example.path)

  await expect(
    page.locator(`${example.rootSelector} ${widgetRootSelector}`),
  ).toContainText(example.text)
}

test.describe('all widget examples render', () => {
  for (const example of webComponentExamples) {
    test(example.name, async ({ page }) => {
      await expectWebComponentExampleRenders(page, example)
    })
  }

  for (const example of mountApiExamples) {
    test(example.name, async ({ page }) => {
      await expectMountApiExampleRenders(page, example)
    })
  }
})

test('web component example renders and emits event', async ({ page }) => {
  await gotoHandoffExample(page, '/examples/demo-product-banner/wc/events.html')

  await expect(page.locator('demo-product-banner')).toHaveJSProperty(
    'localName',
    'demo-product-banner',
  )
  await expect
    .poll(() =>
      page.locator('demo-product-banner').evaluate((element) => {
        return element.shadowRoot?.textContent ?? ''
      }),
    )
    .toContain('推薦商品')
  await expect(page.getByTestId('event-log')).toContainText('No events yet')

  await page.locator('demo-product-banner').evaluate((element) => {
    const button = element.shadowRoot?.querySelector('button')
    ;(button as HTMLButtonElement | null)?.click()
  })

  await expect(page.getByTestId('event-log')).toContainText(
    'demo-product:product-select',
  )
})

test('cross sell widget web component handoff exposes HSR addon link and event', async ({
  page,
}) => {
  await gotoHandoffExample(page, '/examples/cross-sell-widget/wc/full.html')

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

test('cross sell widget connected web component handoff emits item event', async ({
  page,
}) => {
  await gotoHandoffExample(
    page,
    '/examples/cross-sell-widget-connected/wc/basic.html',
  )

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
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

test('cross sell widget connected web component applies source product attribute', async ({
  page,
}) => {
  await gotoHandoffExample(
    page,
    '/examples/cross-sell-widget-connected/wc/basic.html',
  )

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('探索地區飯店')

  await page.locator('cross-sell-widget-connected').evaluate((element) => {
    element.setAttribute('source-product', 'hotel')
  })

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .not.toContain('探索地區飯店')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('前往加購')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .not.toContain('簽證護照')
})

test('cross sell widget connected web component applies visible blocks attribute', async ({
  page,
}) => {
  await gotoHandoffExample(
    page,
    '/examples/cross-sell-widget-connected/wc/basic.html',
  )

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('前往加購')

  await page.locator('cross-sell-widget-connected').evaluate((element) => {
    element.setAttribute('visible-blocks', JSON.stringify({ hsr: false }))
  })

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .not.toContain('前往加購')
})

test('cross sell widget connected web component ignores visible blocks in config', async ({
  page,
}) => {
  await gotoHandoffExample(
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
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('前往加購')
})

test('cross sell widget connected web component applies config attribute overrides', async ({
  page,
}) => {
  await gotoHandoffExample(
    page,
    '/examples/cross-sell-widget-connected/wc/full.html',
  )

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('Connected WC 限時優惠')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('立即加購')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('提供旅行保障')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('探索上海飯店')
})

test('cross sell widget connected web component applies config property and attribute priority', async ({
  page,
}) => {
  await gotoHandoffExample(
    page,
    '/examples/cross-sell-widget-connected/wc/property.html',
  )

  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('Connected property 限時優惠')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('提供旅行保障')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('探索上海飯店')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .toContain('$6,200')
  await expect
    .poll(() => getWebComponentWidgetText(page, 'cross-sell-widget-connected'))
    .not.toContain('US$6,200')
})

test('web component host dark class controls shadow DOM theme', async ({
  page,
}) => {
  await gotoHandoffExample(page, '/examples/demo-product-banner/wc/dark.html')

  await expect
    .poll(() => getWebComponentWidgetState(page, '#explicit-dark'))
    .toEqual({
      hasDarkBackground: true,
      hasLightBackground: false,
      hasDarkColorScheme: true,
      hasLightColorScheme: false,
    })

  await expect
    .poll(() => getWebComponentWidgetState(page, '#default-light'))
    .toEqual({
      hasDarkBackground: false,
      hasLightBackground: true,
      hasDarkColorScheme: false,
      hasLightColorScheme: true,
    })
})

test('web component applies widget-specific theme tokens', async ({ page }) => {
  await gotoHandoffExample(
    page,
    '/examples/themed-demo-product-banner/wc/basic.html',
  )

  await expect(page.locator('themed-demo-product-banner')).toHaveJSProperty(
    'localName',
    'themed-demo-product-banner',
  )
  await expect
    .poll(() =>
      getWebComponentWidgetTokenState(page, '#custom-theme-web-component'),
    )
    .toEqual(demoProductBannerThemeTokens)
})

test('mount API example can update and unmount', async ({ page }) => {
  await gotoHandoffExample(
    page,
    '/examples/demo-product-banner/mount/update.html',
  )

  await expect(page.getByText('推薦商品')).toBeVisible()

  await page.getByRole('button', { name: '更新資料' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toBeVisible()

  await page.getByRole('button', { name: '卸載元件' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toHaveCount(0)
})

test('mount API applies widget-specific theme tokens', async ({ page }) => {
  await gotoHandoffExample(
    page,
    '/examples/themed-demo-product-banner/mount/basic.html',
  )

  await expect
    .poll(() =>
      getLightDomWidgetTokenState(
        page,
        `#custom-theme-root ${widgetRootSelector}`,
      ),
    )
    .toEqual(demoProductBannerThemeTokens)
})

test('mount API inherits host dark class', async ({ page }) => {
  await gotoHandoffExample(
    page,
    '/examples/demo-product-banner/mount/dark.html',
  )

  await expect
    .poll(() =>
      getLightDomWidgetState(page, `#dark-root ${widgetRootSelector}`),
    )
    .toEqual({
      hasDarkBackground: true,
      hasLightBackground: false,
      hasDarkColorScheme: true,
      hasLightColorScheme: false,
    })
})

test('mount API defaults to light theme without dark ancestor', async ({
  page,
}) => {
  await gotoHandoffExample(
    page,
    '/examples/demo-product-banner/mount/basic.html',
  )

  await expect
    .poll(() =>
      getLightDomWidgetState(page, `#demo-product-root ${widgetRootSelector}`),
    )
    .toEqual({
      hasDarkBackground: false,
      hasLightBackground: true,
      hasDarkColorScheme: false,
      hasLightColorScheme: true,
    })
})
