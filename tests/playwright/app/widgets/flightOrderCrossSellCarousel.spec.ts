import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const desktopCarouselViewportWidth = 980
const hotelSectionId = 'hotel-recommendations'
const maxDensityCarouselViewportWidth = 1190
const firstHotelTitle = '上海外灘精選飯店'
const finalPageFirstHotelTitle = '靜安設計酒店'
const hotelSectionTestId = `section-${hotelSectionId}`

const flightOrderCarouselData = {
  orderDestination: '上海',
  sections: [
    {
      id: hotelSectionId,
      kind: 'hotel',
      items: [
        {
          id: 'shanghai-bund-hotel',
          title: firstHotelTitle,
          location: '距離南京東路站 0.4 公里',
          detailLocation: '黃浦區',
          starRating: 5,
          rating: '4.5',
          ratingLabel: '太讚了',
          reviewCount: 1132,
          cancellationLabel: '免費取消',
          price: 4160,
          priceSuffix: '起',
        },
        {
          id: 'pudong-river-view-hotel',
          title: '浦東江景商旅',
          location: '陸家嘴',
          detailLocation: '浦東新區',
          starRating: 4,
          rating: '4.4',
          ratingLabel: '很棒',
          reviewCount: 864,
          cancellationLabel: '免費取消',
          price: 3978,
          priceSuffix: '起',
        },
        {
          id: 'xintiandi-boutique-stay',
          title: '新天地設計旅宿',
          location: '新天地',
          detailLocation: '黃浦區',
          starRating: 4,
          rating: '4.6',
          ratingLabel: '太讚了',
          reviewCount: 529,
          cancellationLabel: '免費取消',
          price: 3432,
          priceSuffix: '起',
        },
        {
          id: 'people-square-family-hotel',
          title: '人民廣場親子飯店',
          location: '人民廣場',
          detailLocation: '黃浦區',
          starRating: 4,
          rating: '4.3',
          ratingLabel: '很棒',
          reviewCount: 721,
          cancellationLabel: '免費取消',
          price: 3680,
          priceSuffix: '起',
        },
        {
          id: 'hongqiao-business-hotel',
          title: '虹橋商務飯店',
          location: '虹橋',
          detailLocation: '長寧區',
          starRating: 4,
          rating: '4.2',
          ratingLabel: '很棒',
          reviewCount: 438,
          cancellationLabel: '免費取消',
          price: 2980,
          priceSuffix: '起',
        },
        {
          id: 'jing-an-design-hotel',
          title: finalPageFirstHotelTitle,
          location: '靜安寺',
          detailLocation: '靜安區',
          starRating: 5,
          rating: '4.7',
          ratingLabel: '太讚了',
          reviewCount: 652,
          cancellationLabel: '免費取消',
          price: 4860,
          priceSuffix: '起',
        },
        {
          id: 'french-concession-stay',
          title: '衡山路精品旅宿',
          location: '徐匯區',
          detailLocation: '徐匯區',
          starRating: 4,
          rating: '4.5',
          ratingLabel: '太讚了',
          reviewCount: 394,
          cancellationLabel: '免費取消',
          price: 3560,
          priceSuffix: '起',
        },
        {
          id: 'yu-garden-city-hotel',
          title: '豫園城市旅店',
          location: '豫園',
          detailLocation: '黃浦區',
          starRating: 3,
          rating: '4.1',
          ratingLabel: '很好',
          reviewCount: 287,
          cancellationLabel: '免費取消',
          price: 2460,
          priceSuffix: '起',
        },
      ],
    },
  ],
}

async function getFlightOrderCarouselState(page: Page) {
  return page.locator('flight-order-cross-sell').evaluate((element, testId) => {
    const root = element.shadowRoot
    const content = root?.querySelector(`[data-testid="${testId}-items"]`)
    const viewport = content?.parentElement
    const previous = root?.querySelector(`[data-testid="${testId}-previous"]`)
    const next = root?.querySelector(`[data-testid="${testId}-next"]`)

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
  }, hotelSectionTestId)
}

async function clickFlightOrderCarouselNext(page: Page) {
  await page.locator('flight-order-cross-sell').evaluate((element, testId) => {
    const next = element.shadowRoot?.querySelector(
      `[data-testid="${testId}-next"]`,
    )

    if (next instanceof HTMLButtonElement) {
      next.click()
    }
  }, hotelSectionTestId)
}

async function gotoFlightOrderCrossSellExample(page: Page) {
  await page.goto(
    '/examples/web-component/flight-order-cross-sell.basic.html',
    {
      waitUntil: 'domcontentloaded',
    },
  )

  await page.locator('flight-order-cross-sell').evaluate((element, data) => {
    ;(element as HTMLElement & { data?: unknown }).data = data
  }, flightOrderCarouselData)
}

async function focusFirstFlightOrderProduct(page: Page) {
  await page.locator('flight-order-cross-sell').evaluate((element, testId) => {
    const button = element.shadowRoot?.querySelector(
      `[data-testid="${testId}-items"] button`,
    )

    if (button instanceof HTMLButtonElement) {
      button.focus()
    }
  }, hotelSectionTestId)
}

test('flight order carousel uses browser scrolling without a visible scrollbar', async ({
  page,
}) => {
  await page.setViewportSize({
    height: 900,
    width: desktopCarouselViewportWidth,
  })
  await gotoFlightOrderCrossSellExample(page)

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
  await page.setViewportSize({
    height: 900,
    width: maxDensityCarouselViewportWidth,
  })
  await gotoFlightOrderCrossSellExample(page)

  await expect
    .poll(async () => {
      const state = await getFlightOrderCarouselState(page)

      return state?.firstFullyVisibleCardText ?? ''
    })
    .toContain(firstHotelTitle)

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
    .toContain(finalPageFirstHotelTitle)

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
  await gotoFlightOrderCrossSellExample(page)

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
