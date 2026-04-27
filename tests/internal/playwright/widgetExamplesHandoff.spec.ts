import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { widgetRootSelector } from '../../../src/runtime/widgetRoot'

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
    path: '/examples/web-component/demo-product-banner.basic.html',
    widgets: [
      {
        selector: 'demo-product-banner',
        text: '推薦商品',
      },
    ],
  },
  {
    name: 'web component custom theme',
    path: '/examples/web-component/demo-product-banner.custom-theme.html',
    widgets: [
      {
        selector: 'themed-demo-product-banner',
        text: '客製主題推薦商品',
      },
    ],
  },
  {
    name: 'web component dark mode',
    path: '/examples/web-component/demo-product-banner.dark.html',
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
    path: '/examples/web-component/demo-product-banner.events.html',
    widgets: [
      {
        selector: 'demo-product-banner',
        text: '推薦商品',
      },
    ],
  },
  {
    name: 'web component multiple instances',
    path: '/examples/web-component/demo-product-banner.multiple.html',
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
] as const

const mountApiExamples: MountApiExample[] = [
  {
    name: 'mount API basic',
    path: '/examples/mount-api/demo-product-banner.basic.html',
    rootSelector: '#demo-product-root',
    text: '推薦商品',
  },
  {
    name: 'mount API custom theme',
    path: '/examples/mount-api/demo-product-banner.custom-theme.html',
    rootSelector: '#custom-theme-root',
    text: '客製主題推薦商品',
  },
  {
    name: 'mount API dark mode',
    path: '/examples/mount-api/demo-product-banner.dark.html',
    rootSelector: '#dark-root',
    text: '繼承深色商品',
  },
  {
    name: 'mount API unmount',
    path: '/examples/mount-api/demo-product-banner.unmount.html',
    rootSelector: '#demo-product-root',
    text: '推薦商品',
  },
  {
    name: 'mount API update',
    path: '/examples/mount-api/demo-product-banner.update.html',
    rootSelector: '#demo-product-root',
    text: '推薦商品',
  },
] as const

const darkBackgroundColor = 'rgb(10, 11, 11)'
const lightBackgroundColor = 'rgb(255, 255, 255)'

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

async function expectWebComponentExampleRenders(
  page: Page,
  example: WebComponentExample,
) {
  await page.goto(example.path)

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
  await page.goto(example.path)

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
  await page.goto('/examples/web-component/demo-product-banner.events.html')

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

test('web component host dark class controls shadow DOM theme', async ({
  page,
}) => {
  await page.goto('/examples/web-component/demo-product-banner.dark.html')

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
  await page.goto(
    '/examples/web-component/demo-product-banner.custom-theme.html',
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
  await page.goto('/examples/mount-api/demo-product-banner.update.html')

  await expect(page.getByText('推薦商品')).toBeVisible()

  await page.getByRole('button', { name: '更新資料' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toBeVisible()

  await page.getByRole('button', { name: '卸載元件' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toHaveCount(0)
})

test('mount API applies widget-specific theme tokens', async ({ page }) => {
  await page.goto('/examples/mount-api/demo-product-banner.custom-theme.html')

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
  await page.goto('/examples/mount-api/demo-product-banner.dark.html')

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
  await page.goto('/examples/mount-api/demo-product-banner.basic.html')

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
