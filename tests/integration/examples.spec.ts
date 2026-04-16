import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

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

async function getWebComponentWidgetState(page: Page, selector: string) {
  const state = await page.locator(selector).evaluate((element) => {
    const root = element.shadowRoot?.querySelector('[data-cross-sell-widget]')

    if (!(root instanceof HTMLElement)) {
      return null
    }

    return {
      background: getComputedStyle(root).getPropertyValue('--background'),
      colorScheme: getComputedStyle(root).colorScheme,
    }
  })

  return normalizeThemeState(state)
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

  await page.locator('cross-sell-banner').evaluate((element) => {
    const button = element.shadowRoot?.querySelector('button')
    ;(button as HTMLButtonElement | null)?.click()
  })

  await expect(page.getByTestId('event-log')).toContainText(
    'cross-sell:product-select',
  )
})

test('web component host dark class controls shadow DOM theme', async ({
  page,
}) => {
  await page.goto('/examples/web-component/cross-sell-banner.dark.html')

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

test('mount API example can update and unmount', async ({ page }) => {
  await page.goto('/examples/mount-api/cross-sell-banner.update.html')

  await expect(page.getByText('推薦商品')).toBeVisible()

  await page.getByRole('button', { name: '更新資料' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toBeVisible()

  await page.getByRole('button', { name: '卸載元件' }).click()
  await expect(page.getByRole('heading', { name: '更新後商品' })).toHaveCount(0)
})

test('mount API inherits host dark class', async ({ page }) => {
  await page.goto('/examples/mount-api/cross-sell-banner.dark.html')

  await expect
    .poll(() =>
      getLightDomWidgetState(page, '#dark-root [data-cross-sell-widget]'),
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
  await page.goto('/examples/mount-api/cross-sell-banner.basic.html')

  await expect
    .poll(() =>
      getLightDomWidgetState(page, '#cross-sell-root [data-cross-sell-widget]'),
    )
    .toEqual({
      hasDarkBackground: false,
      hasLightBackground: true,
      hasDarkColorScheme: false,
      hasLightColorScheme: true,
    })
})
