import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

import { widgetRootSelector } from '../../src/runtime/widgetRoot'

const demoProductBannerThemeTokens = {
  primary: 'oklch(52% .18 250)',
  radius: '.625rem',
  ring: 'oklch(52% .18 250)',
}

function normalizeCssValue(value: string) {
  return value.trim().replace(/\s+/g, ' ')
}

function normalizeThemeState(
  state: { background: string; colorScheme: string } | null,
) {
  if (!state) {
    return null
  }

  return {
    hasDarkBackground:
      state.background.includes('18%') || state.background.includes('0.18'),
    hasLightBackground:
      state.background.includes('100%') || state.background.includes('1 0 0'),
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

      return {
        background: getComputedStyle(root).getPropertyValue('--background'),
        colorScheme: getComputedStyle(root).colorScheme,
      }
    }, widgetRootSelector)

  return normalizeThemeState(state)
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

async function getLightDomWidgetState(page: Page, selector: string) {
  const state = await page.locator(selector).evaluate((root) => {
    return {
      background: getComputedStyle(root).getPropertyValue('--background'),
      colorScheme: getComputedStyle(root).colorScheme,
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
