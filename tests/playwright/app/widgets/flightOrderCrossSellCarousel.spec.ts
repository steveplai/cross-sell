import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

async function getFlightOrderCarouselState(page: Page) {
  return page.locator('flight-order-cross-sell').evaluate((element) => {
    const root = element.shadowRoot
    const content = root?.querySelector(
      '[data-testid="section-tokyo-hotels-items"]',
    )
    const viewport = content?.parentElement
    const previous = root?.querySelector(
      '[data-testid="section-tokyo-hotels-previous"]',
    )
    const next = root?.querySelector(
      '[data-testid="section-tokyo-hotels-next"]',
    )

    if (!(content instanceof HTMLElement)) {
      return null
    }

    const viewportStyles =
      viewport instanceof HTMLElement ? getComputedStyle(viewport) : null
    const firstCard = content.querySelector('article')
    const fullyVisibleCards =
      viewport instanceof HTMLElement
        ? Array.from(content.querySelectorAll('article')).filter((card) => {
            const cardRect = card.getBoundingClientRect()
            const viewportRect = viewport.getBoundingClientRect()

            return (
              cardRect.left >= viewportRect.left &&
              cardRect.right <= viewportRect.right
            )
          })
        : []
    const placeholder = content.querySelector(
      '[data-testid="cross-sell-view-more-placeholder"]',
    )

    return {
      contentTransform: getComputedStyle(content).transform,
      firstCardWidth:
        firstCard instanceof HTMLElement
          ? firstCard.getBoundingClientRect().width
          : null,
      firstFullyVisibleCardText: fullyVisibleCards[0]?.textContent ?? null,
      fullyVisibleCardCount: fullyVisibleCards.length,
      placeholderExists: placeholder instanceof HTMLElement,
      placeholderFullyVisible:
        viewport instanceof HTMLElement
          ? (() => {
              if (!(placeholder instanceof HTMLElement)) {
                return false
              }

              const placeholderRect = placeholder.getBoundingClientRect()
              const viewportRect = viewport.getBoundingClientRect()

              return (
                placeholderRect.left >= viewportRect.left &&
                placeholderRect.right <= viewportRect.right
              )
            })()
          : false,
      placeholderItemWidth:
        placeholder?.parentElement instanceof HTMLElement
          ? placeholder.parentElement.getBoundingClientRect().width
          : null,
      nextDisplay:
        next instanceof HTMLElement ? getComputedStyle(next).display : null,
      nextExists: next instanceof HTMLElement,
      previousDisplay:
        previous instanceof HTMLElement
          ? getComputedStyle(previous).display
          : null,
      previousExists: previous instanceof HTMLElement,
      secondCardVisibleRatio:
        viewport instanceof HTMLElement
          ? (() => {
              const secondCard = content.querySelectorAll('article')[1]

              if (!(secondCard instanceof HTMLElement)) {
                return 0
              }

              const cardRect = secondCard.getBoundingClientRect()
              const viewportRect = viewport.getBoundingClientRect()
              const visibleWidth =
                Math.min(cardRect.right, viewportRect.right) -
                Math.max(cardRect.left, viewportRect.left)

              return Math.max(0, visibleWidth) / cardRect.width
            })()
          : 0,
      viewportOverflowX: viewportStyles?.overflowX ?? null,
      viewportWidth:
        viewport instanceof HTMLElement
          ? viewport.getBoundingClientRect().width
          : null,
    }
  })
}

async function clickFlightOrderCarouselNext(page: Page) {
  await page.locator('flight-order-cross-sell').evaluate((element) => {
    const next = element.shadowRoot?.querySelector(
      '[data-testid="section-tokyo-hotels-next"]',
    )

    if (next instanceof HTMLButtonElement) {
      next.click()
    }
  })
}

async function focusFirstFlightOrderProduct(page: Page) {
  await page.locator('flight-order-cross-sell').evaluate((element) => {
    const button = element.shadowRoot?.querySelector(
      '[data-testid="section-tokyo-hotels-items"] button',
    )

    if (button instanceof HTMLButtonElement) {
      button.focus()
    }
  })
}

test('flight order carousel uses browser scrolling without a visible scrollbar', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 768 })
  await page.goto('/examples/web-component/flight-order-cross-sell.basic.html')

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .toMatchObject({
      nextDisplay: 'flex',
      nextExists: true,
      previousExists: false,
      viewportOverflowX: 'hidden',
    })

  const initialState = await getFlightOrderCarouselState(page)
  await clickFlightOrderCarouselNext(page)

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .not.toMatchObject({
      contentTransform: initialState?.contentTransform,
    })

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .toMatchObject({
      previousDisplay: 'flex',
      previousExists: true,
    })

  for (let index = 0; index < 8; index += 1) {
    const state = await getFlightOrderCarouselState(page)

    if (!state?.nextExists) {
      break
    }

    await clickFlightOrderCarouselNext(page)
    await page.waitForTimeout(100)
  }

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .toMatchObject({
      nextExists: false,
      previousDisplay: 'flex',
      previousExists: true,
    })
})

test('flight order carousel moves one desktop page and fills the final page with a placeholder', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1190 })
  await page.goto('/examples/web-component/flight-order-cross-sell.basic.html')

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      return state?.firstFullyVisibleCardText ?? ''
    })
    .toContain('LA VISTA 東京灣')

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .toMatchObject({
      placeholderExists: true,
      placeholderFullyVisible: false,
    })

  await clickFlightOrderCarouselNext(page)

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      return state?.firstFullyVisibleCardText ?? ''
    })
    .toContain('銀座設計旅店')

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .toMatchObject({
      nextExists: false,
      placeholderExists: true,
      placeholderFullyVisible: true,
      previousDisplay: 'flex',
      previousExists: true,
    })

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      if (
        !state?.placeholderItemWidth ||
        !state.firstCardWidth ||
        !state.viewportWidth
      ) {
        return 0
      }

      const expectedRemainingWidth =
        state.viewportWidth - state.firstCardWidth * 3

      return state.placeholderItemWidth / expectedRemainingWidth
    })
    .toBeGreaterThanOrEqual(0.95)

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      if (
        !state?.placeholderItemWidth ||
        !state.firstCardWidth ||
        !state.viewportWidth
      ) {
        return 0
      }

      const expectedRemainingWidth =
        state.viewportWidth - state.firstCardWidth * 3

      return state.placeholderItemWidth / expectedRemainingWidth
    })
    .toBeLessThan(1.05)
})

test('flight order carousel supports mobile exposure and keyboard navigation', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 })
  await page.goto('/examples/web-component/flight-order-cross-sell.basic.html')

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      return state?.firstCardWidth ?? 0
    })
    .toBeGreaterThanOrEqual(199)

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      return state?.secondCardVisibleRatio ?? 0
    })
    .toBeGreaterThanOrEqual(0.5)

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .toMatchObject({
      nextDisplay: 'none',
      previousExists: false,
    })

  const initialState = await getFlightOrderCarouselState(page)
  await focusFirstFlightOrderProduct(page)
  await page.keyboard.press('ArrowRight')

  await expect
    .poll(() => getFlightOrderCarouselState(page))
    .not.toMatchObject({
      contentTransform: initialState?.contentTransform,
    })
})
