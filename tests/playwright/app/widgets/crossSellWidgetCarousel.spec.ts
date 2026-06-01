import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

type CrossSellWidgetItemSelectEventDetail = {
  sectionId?: string
  item?: {
    id?: string
    title?: string
  }
}

type CrossSellWidgetCarouselTestWindow = Window & {
  __crossSellWidgetItemSelectEvents?: Array<{
    type: string
    detail: CrossSellWidgetItemSelectEventDetail
  }>
}

const desktopCarouselViewportWidth = 980
const hotelSectionId = 'hotel-recommendations'
const maxDensityCarouselViewportWidth = 1190
const firstHotelTitle = '上海外灘精選飯店'
const finalPageFirstHotelTitle = '靜安設計酒店'
const secondHotelTitle = '浦東江景商旅'
const hotelSectionTestId = `section-${hotelSectionId}`

const crossSellWidgetCarouselData = {
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

async function getCrossSellWidgetCarouselState(page: Page) {
  return page.locator('cross-sell-widget').evaluate((element, testId) => {
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
    const viewportRect =
      viewport instanceof HTMLElement ? viewport.getBoundingClientRect() : null
    const fullyVisibleCards = viewportRect
      ? Array.from(content.querySelectorAll('article')).filter((card) => {
          const cardRect = card.getBoundingClientRect()

          return (
            cardRect.left >= viewportRect.left &&
            cardRect.right <= viewportRect.right
          )
        })
      : []
    const visibleCards = viewportRect
      ? Array.from(content.querySelectorAll('article')).filter((card) => {
          const cardRect = card.getBoundingClientRect()
          const visibleWidth =
            Math.min(cardRect.right, viewportRect.right) -
            Math.max(cardRect.left, viewportRect.left)
          const visibleHeight =
            Math.min(cardRect.bottom, viewportRect.bottom) -
            Math.max(cardRect.top, viewportRect.top)

          return visibleWidth > 1 && visibleHeight > 1
        })
      : []
    const placeholder = content.querySelector(
      '[data-testid="cross-sell-view-more-placeholder"]',
    )
    const placeholderRect =
      placeholder instanceof HTMLElement
        ? placeholder.getBoundingClientRect()
        : null
    const placeholderPartiallyVisible =
      !!viewportRect &&
      !!placeholderRect &&
      Math.min(placeholderRect.right, viewportRect.right) -
        Math.max(placeholderRect.left, viewportRect.left) >
        1 &&
      Math.min(placeholderRect.bottom, viewportRect.bottom) -
        Math.max(placeholderRect.top, viewportRect.top) >
        1

    return {
      contentTransform: getComputedStyle(content).transform,
      firstCardWidth:
        firstCard instanceof HTMLElement
          ? firstCard.getBoundingClientRect().width
          : null,
      firstFullyVisibleCardText: fullyVisibleCards[0]?.textContent ?? null,
      fullyVisibleCardCount: fullyVisibleCards.length,
      placeholderExists: placeholder instanceof HTMLElement,
      placeholderFullyVisible: viewportRect
        ? (() => {
            if (!placeholderRect) {
              return false
            }

            return (
              placeholderRect.left >= viewportRect.left &&
              placeholderRect.right <= viewportRect.right
            )
          })()
        : false,
      placeholderPartiallyVisible,
      placeholderItemWidth:
        placeholder?.parentElement instanceof HTMLElement
          ? placeholder.parentElement.getBoundingClientRect().width
          : null,
      nextDisplay:
        next instanceof HTMLElement ? getComputedStyle(next).display : null,
      nextExists: next instanceof HTMLElement,
      nextVisible:
        next instanceof HTMLElement
          ? getComputedStyle(next).display !== 'none'
          : false,
      previousDisplay:
        previous instanceof HTMLElement
          ? getComputedStyle(previous).display
          : null,
      previousExists: previous instanceof HTMLElement,
      previousVisible:
        previous instanceof HTMLElement
          ? getComputedStyle(previous).display !== 'none'
          : false,
      secondCardVisibleRatio: viewportRect
        ? (() => {
            const secondCard = content.querySelectorAll('article')[1]

            if (!(secondCard instanceof HTMLElement)) {
              return 0
            }

            const cardRect = secondCard.getBoundingClientRect()
            const visibleWidth =
              Math.min(cardRect.right, viewportRect.right) -
              Math.max(cardRect.left, viewportRect.left)

            return Math.max(0, visibleWidth) / cardRect.width
          })()
        : 0,
      viewportRect: viewportRect
        ? {
            bottom: viewportRect.bottom,
            height: viewportRect.height,
            left: viewportRect.left,
            right: viewportRect.right,
            top: viewportRect.top,
            width: viewportRect.width,
          }
        : null,
      viewportOverflowX: viewportStyles?.overflowX ?? null,
      viewportWidth:
        viewport instanceof HTMLElement
          ? viewport.getBoundingClientRect().width
          : null,
      visibleCardTexts: visibleCards.map((card) => card.textContent ?? ''),
    }
  }, hotelSectionTestId)
}

async function getCrossSellWidgetCarouselVisibleText(page: Page) {
  const state = await getCrossSellWidgetCarouselState(page)
  const visibleTexts = state?.visibleCardTexts ?? []

  return state?.placeholderPartiallyVisible
    ? [...visibleTexts, 'cross-sell-view-more-placeholder']
    : visibleTexts
}

async function dragCrossSellWidgetCarousel(page: Page, deltaX = 240) {
  const state = await getCrossSellWidgetCarouselState(page)
  const viewportRect = state?.viewportRect

  if (!viewportRect) {
    throw new Error('預期 carousel viewport 已經完成渲染。')
  }

  const startX = viewportRect.left + viewportRect.width * 0.8
  const endX = startX - deltaX
  const y = viewportRect.top + viewportRect.height / 2

  await page.mouse.move(startX, y)
  await page.mouse.down()
  await page.mouse.move(endX, y, { steps: 12 })
  await page.mouse.up()
  await page.waitForTimeout(250)
}

async function listenCrossSellWidgetEvents(page: Page) {
  await page.locator('cross-sell-widget').evaluate((element) => {
    const testWindow = window as CrossSellWidgetCarouselTestWindow

    testWindow.__crossSellWidgetItemSelectEvents = []
    element.addEventListener('cross-sell-widget:item-select', (event) => {
      const customEvent =
        event as CustomEvent<CrossSellWidgetItemSelectEventDetail>

      testWindow.__crossSellWidgetItemSelectEvents?.push({
        type: customEvent.type,
        detail: {
          sectionId: customEvent.detail.sectionId,
          item: {
            id: customEvent.detail.item?.id,
            title: customEvent.detail.item?.title,
          },
        },
      })
    })
  })
}

async function getCrossSellWidgetItemSelectEvents(page: Page) {
  return page.evaluate(
    () =>
      (window as CrossSellWidgetCarouselTestWindow)
        .__crossSellWidgetItemSelectEvents ?? [],
  )
}

async function clickVisibleCrossSellWidgetProduct(page: Page, title: string) {
  await page.locator('cross-sell-widget').evaluate(
    (element, { testId, title }) => {
      const root = element.shadowRoot
      const content = root?.querySelector(`[data-testid="${testId}-items"]`)
      const viewport = content?.parentElement

      if (!(viewport instanceof HTMLElement)) {
        throw new Error('預期 carousel viewport 已經完成渲染。')
      }

      const viewportRect = viewport.getBoundingClientRect()
      const button = Array.from(
        content?.querySelectorAll('article button') ?? [],
      ).find((candidate) => {
        const buttonRect = candidate.getBoundingClientRect()
        const visibleWidth =
          Math.min(buttonRect.right, viewportRect.right) -
          Math.max(buttonRect.left, viewportRect.left)

        return candidate.textContent?.includes(title) && visibleWidth > 1
      })

      if (!(button instanceof HTMLButtonElement)) {
        throw new Error(`預期 carousel 中會有可見商品「${title}」。`)
      }

      button.click()
    },
    {
      testId: hotelSectionTestId,
      title,
    },
  )
}

async function clickCrossSellWidgetCarouselNext(page: Page) {
  await page.locator('cross-sell-widget').evaluate((element, testId) => {
    const next = element.shadowRoot?.querySelector(
      `[data-testid="${testId}-next"]`,
    )

    if (next instanceof HTMLButtonElement) {
      next.click()
    }
  }, hotelSectionTestId)
}

async function gotoCrossSellWidgetExample(page: Page) {
  await page.goto('/examples/cross-sell-widget/wc/basic.html', {
    waitUntil: 'domcontentloaded',
  })

  await page.locator('cross-sell-widget').evaluate((element, data) => {
    ;(element as HTMLElement & { data?: unknown }).data = data
  }, crossSellWidgetCarouselData)
}

async function focusFirstCrossSellWidgetProduct(page: Page) {
  await page.locator('cross-sell-widget').evaluate((element, testId) => {
    const button = element.shadowRoot?.querySelector(
      `[data-testid="${testId}-items"] button`,
    )

    if (button instanceof HTMLButtonElement) {
      button.focus()
    }
  }, hotelSectionTestId)
}

test('cross sell widget carousel 會使用 browser scrolling 且不顯示 scrollbar', async ({
  page,
}) => {
  await page.setViewportSize({
    height: 900,
    width: desktopCarouselViewportWidth,
  })
  await gotoCrossSellWidgetExample(page)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextDisplay: 'flex',
      nextExists: true,
      previousExists: false,
      viewportOverflowX: 'hidden',
    })

  const initialState = await getCrossSellWidgetCarouselState(page)
  await clickCrossSellWidgetCarouselNext(page)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .not.toMatchObject({
      contentTransform: initialState?.contentTransform,
    })

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      previousDisplay: 'flex',
      previousExists: true,
    })

  for (let index = 0; index < 8; index += 1) {
    const state = await getCrossSellWidgetCarouselState(page)

    if (!state?.nextExists) {
      break
    }

    await clickCrossSellWidgetCarouselNext(page)
    await page.waitForTimeout(100)
  }

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextExists: false,
      previousDisplay: 'flex',
      previousExists: true,
    })
})

test('cross sell widget carousel 會移動一個 desktop page 並以 placeholder 補齊最後一頁', async ({
  page,
}) => {
  await page.setViewportSize({
    height: 900,
    width: maxDensityCarouselViewportWidth,
  })
  await gotoCrossSellWidgetExample(page)

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.firstFullyVisibleCardText ?? ''
    })
    .toContain(firstHotelTitle)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      placeholderExists: true,
      placeholderFullyVisible: false,
    })

  await clickCrossSellWidgetCarouselNext(page)

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.firstFullyVisibleCardText ?? ''
    })
    .toContain(finalPageFirstHotelTitle)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextExists: false,
      placeholderExists: true,
      placeholderFullyVisible: true,
      previousDisplay: 'flex',
      previousExists: true,
    })

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

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
      const state = await getCrossSellWidgetCarouselState(page)

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

test('cross sell widget carousel 會支援 mobile exposure 與 keyboard navigation', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 })
  await gotoCrossSellWidgetExample(page)

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.firstCardWidth ?? 0
    })
    .toBeGreaterThanOrEqual(199)

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.secondCardVisibleRatio ?? 0
    })
    .toBeGreaterThanOrEqual(0.5)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextDisplay: 'none',
      previousExists: false,
    })

  const initialState = await getCrossSellWidgetCarouselState(page)
  await focusFirstCrossSellWidgetProduct(page)
  await page.keyboard.press('ArrowRight')

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .not.toMatchObject({
      contentTransform: initialState?.contentTransform,
    })
})

test('cross sell widget carousel mobile swipe 會移動內容且不顯示 desktop controls', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 })
  await gotoCrossSellWidgetExample(page)

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.firstFullyVisibleCardText ?? ''
    })
    .toContain(firstHotelTitle)

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.secondCardVisibleRatio ?? 0
    })
    .toBeGreaterThanOrEqual(0.5)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextVisible: false,
      previousVisible: false,
    })

  const initialState = await getCrossSellWidgetCarouselState(page)

  await dragCrossSellWidgetCarousel(page)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .not.toMatchObject({
      contentTransform: initialState?.contentTransform,
    })

  await expect
    .poll(async () => {
      const visibleText = await getCrossSellWidgetCarouselVisibleText(page)

      return visibleText.join(' ')
    })
    .toContain(secondHotelTitle)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextVisible: false,
      previousVisible: false,
    })
})

test('cross sell widget carousel mobile swipe 到尾端仍會顯示內容', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 })
  await gotoCrossSellWidgetExample(page)

  for (let index = 0; index < 10; index += 1) {
    const state = await getCrossSellWidgetCarouselState(page)

    if (state?.placeholderPartiallyVisible) {
      break
    }

    await dragCrossSellWidgetCarousel(page)
  }

  await expect
    .poll(async () => {
      const visibleText = await getCrossSellWidgetCarouselVisibleText(page)

      return visibleText.join(' ')
    })
    .not.toBe('')

  await expect
    .poll(async () => {
      const state = await getCrossSellWidgetCarouselState(page)

      return state?.placeholderPartiallyVisible ?? false
    })
    .toBe(true)

  await expect
    .poll(() => getCrossSellWidgetCarouselState(page))
    .toMatchObject({
      nextVisible: false,
      previousVisible: false,
    })
})

test('cross sell widget carousel mobile swipe 後仍可選取商品並 emit event', async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 390 })
  await gotoCrossSellWidgetExample(page)
  await listenCrossSellWidgetEvents(page)

  await dragCrossSellWidgetCarousel(page)

  await expect
    .poll(async () => {
      const visibleText = await getCrossSellWidgetCarouselVisibleText(page)

      return visibleText.join(' ')
    })
    .toContain(secondHotelTitle)

  await clickVisibleCrossSellWidgetProduct(page, secondHotelTitle)

  await expect
    .poll(() => getCrossSellWidgetItemSelectEvents(page))
    .toEqual([
      {
        type: 'cross-sell-widget:item-select',
        detail: {
          sectionId: hotelSectionId,
          item: {
            id: 'pudong-river-view-hotel',
            title: secondHotelTitle,
          },
        },
      },
    ])
})
