import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { CrossSellWidget } from './CrossSellWidget'
import { crossSellWidgetSampleData } from './sampleData'
import type { CrossSellWidgetProps } from './types'

interface JsdomGlobal {
  jsdom?: {
    reconfigure(options: { url: string }): void
  }
}

function cloneSampleData(overrides: Partial<CrossSellWidgetProps> = {}) {
  const sampleData = JSON.parse(
    JSON.stringify(crossSellWidgetSampleData),
  ) as CrossSellWidgetProps

  return {
    ...sampleData,
    ...overrides,
  }
}

function reconfigureTestUrl(url: string) {
  const jsdom = (globalThis as typeof globalThis & JsdomGlobal).jsdom

  if (!jsdom) {
    throw new Error('Expected Vitest jsdom environment to expose jsdom global.')
  }

  jsdom.reconfigure({ url })
}

function resetTestUrl() {
  const jsdom = (globalThis as typeof globalThis & JsdomGlobal).jsdom

  jsdom?.reconfigure({ url: 'http://localhost/' })
}

function expectElementsInDocumentOrder(elements: Element[]) {
  elements.slice(0, -1).forEach((element, index) => {
    expect(
      element.compareDocumentPosition(elements[index + 1]) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
}

function getCrossSellBlock(blockKey: string) {
  const block = document.querySelector(`[data-cross-sell-block="${blockKey}"]`)

  expect(block).not.toBeNull()

  return block as HTMLElement
}

function expectNoCrossSellBlock(blockKey: string) {
  expect(
    document.querySelector(`[data-cross-sell-block="${blockKey}"]`),
  ).toBeNull()
}

function expectCrossSellBlockTopMargin(
  blockKey: string,
  hasTopMargin: boolean,
) {
  const block = getCrossSellBlock(blockKey)

  if (hasTopMargin) {
    expect(block).toHaveClass('mt-2.5')
    return
  }

  expect(block).not.toHaveClass('mt-2.5')
}

const defaultProductImageUrl =
  'https://static.liontech.com.tw/CommonResources/images/lionTravel/default_img.png'

describe('CrossSellWidget', () => {
  afterEach(() => {
    cleanup()
    resetTestUrl()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders active promo countdown and title', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <CrossSellWidget
        {...cloneSampleData({
          promo: {
            ...crossSellWidgetSampleData.promo,
            durationSeconds: 7200,
            startsAt: '2026-04-21T09:00:00Z',
          },
        })}
      />,
    )

    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(
      screen.getByLabelText('優惠倒數 0 天 1 時 0 分 0 秒'),
    ).toBeInTheDocument()
  })

  it('renders sections, products, and action CTAs', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(<CrossSellWidget {...cloneSampleData()} />)

    expect(
      screen.getByRole('heading', { name: '探索地區飯店' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '探索地區 景點不錯過' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '當地交通 一次搞定' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /LA VISTA 東京灣/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /東京迪士尼門票/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /東京成田\/羽田機場至東京都市區/ }),
    ).toBeInTheDocument()
    expect(screen.getAllByLabelText('飯店星等 5 顆星').length).toBeGreaterThan(
      0,
    )
    expect(screen.getAllByText('江東區').length).toBeGreaterThan(0)

    expect(screen.getAllByRole('link', { name: /探索更多/ }).length).toBe(3)
    const popularSearchLink = screen.getAllByRole('link', {
      name: '東京迪士尼',
    })[0]

    expect(popularSearchLink).toHaveAttribute(
      'href',
      'https://www.liontravel.com/search?keyword=%E6%9D%B1%E4%BA%AC%E8%BF%AA%E5%A3%AB%E5%B0%BC',
    )
    expect(popularSearchLink).toHaveAttribute('target', '_blank')
    expect(popularSearchLink).toHaveAttribute('rel', 'noopener noreferrer')

    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
    const passportLink = screen.getByRole('link', { name: /簽證護照/ })

    expect(passportLink).toHaveAttribute(
      'href',
      'https://uvisa.liontravel.com/search?Countrylicensing=TW',
    )
    expect(passportLink).toHaveAttribute('target', '_blank')
    expect(passportLink).toHaveAttribute('rel', 'noopener noreferrer')

    const insuranceLink = screen.getByRole('link', { name: /旅遊綜合險/ })
    const insuranceHref = insuranceLink.getAttribute('href') ?? ''
    const insuranceSearchParams = new URLSearchParams(
      insuranceHref.split('?')[1],
    )

    expect(
      insuranceHref.startsWith('mailto:customer-service@liontravel.com?'),
    ).toBe(true)
    expect(insuranceLink).not.toHaveAttribute('target')
    expect(insuranceLink).not.toHaveAttribute('rel')
    expect(insuranceSearchParams.get('subject')).toBe(
      '加購保險【訂單編號: 2026-16575】',
    )
    expect(insuranceSearchParams.get('body')).toContain(
      ['要保人資訊', '姓名：', '居住地址：'].join('\n'),
    )
    expect(insuranceSearchParams.get('body')).toContain(
      ['所有旅客資訊', '旅客1：', '身分證字號：', '生日：', '關係：'].join(
        '\n',
      ),
    )
  })

  it('renders static content when recommendation sections are empty', () => {
    render(<CrossSellWidget {...cloneSampleData({ sections: [] })} />)

    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
    expect(screen.getByText('簽證護照')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索地區飯店' }),
    ).not.toBeInTheDocument()
  })

  it('hides selected recommendation and reminder blocks', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            hotel: false,
            reminders: false,
          },
        })}
      />,
    )

    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索地區飯店' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '探索地區 景點不錯過' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '當地交通 一次搞定' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('簽證護照')).not.toBeInTheDocument()
    expect(screen.queryByText('旅遊綜合險')).not.toBeInTheDocument()
  })

  it('can hide the promo header while keeping the hotel block', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            promoHeader: false,
          },
        })}
      />,
    )

    expect(screen.queryByText('您已解鎖限時優惠！')).not.toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '探索地區飯店' }),
    ).toBeInTheDocument()
  })

  it('hides the promo and hotel panel content when both blocks are hidden', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            promoHeader: false,
            hotel: false,
          },
        })}
      />,
    )

    expect(screen.queryByText('您已解鎖限時優惠！')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索地區飯店' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
  })

  it('attaches the promo header to the hotel block by default', () => {
    render(<CrossSellWidget {...cloneSampleData()} />)

    expectCrossSellBlockTopMargin('promoHeader', false)
    expectCrossSellBlockTopMargin('hotel', false)
    expectCrossSellBlockTopMargin('hsr', true)
    expect(getCrossSellBlock('promoHeader')).toHaveClass(
      'lion-desktop:rounded-t-(--lion-panel-radius)',
    )
    expect(getCrossSellBlock('hotel')).toHaveClass(
      'lion-desktop:rounded-b-(--lion-panel-radius)',
    )
  })

  it('attaches the promo header to HSR when hotel recommendations are hidden', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            hotel: false,
          },
        })}
      />,
    )

    expectNoCrossSellBlock('hotel')
    expectCrossSellBlockTopMargin('hsr', false)
    expectCrossSellBlockTopMargin('attraction', true)
    expect(getCrossSellBlock('hsr')).toHaveClass(
      'lion-desktop:rounded-b-(--lion-panel-radius)',
    )
  })

  it('attaches the promo header to attraction recommendations when hotel and HSR are hidden', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            hotel: false,
            hsr: false,
          },
        })}
      />,
    )

    expectNoCrossSellBlock('hotel')
    expectNoCrossSellBlock('hsr')
    expectCrossSellBlockTopMargin('attraction', false)
    expectCrossSellBlockTopMargin('transport', true)
  })

  it('does not add top margin to the first content block when the promo header is hidden', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            promoHeader: false,
          },
        })}
      />,
    )

    expectNoCrossSellBlock('promoHeader')
    expectCrossSellBlockTopMargin('hotel', false)
    expectCrossSellBlockTopMargin('hsr', true)
  })

  it('keeps a gap after the promo header when no attachable product block is visible', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          visibleBlocks: {
            attraction: false,
            hotel: false,
            hsr: false,
          },
        })}
      />,
    )

    expectCrossSellBlockTopMargin('promoHeader', false)
    expectCrossSellBlockTopMargin('transport', true)
  })

  it('keeps popular search overflow hints hidden when popular searches fit', () => {
    render(<CrossSellWidget {...cloneSampleData()} />)

    const popularSearchScroller = screen.getByTestId(
      'section-tokyo-attractions-popular-searches',
    )

    Object.defineProperties(popularSearchScroller, {
      clientWidth: { configurable: true, value: 320 },
      scrollWidth: { configurable: true, value: 320 },
    })

    fireEvent.scroll(popularSearchScroller)

    expect(
      screen.getByTestId(
        'section-tokyo-attractions-popular-searches-overflow-start',
      ),
    ).toHaveClass('opacity-0')
    expect(
      screen.getByTestId(
        'section-tokyo-attractions-popular-searches-overflow-end',
      ),
    ).toHaveClass('opacity-0')
  })

  it('updates popular search overflow hints while dragging horizontally', () => {
    render(<CrossSellWidget {...cloneSampleData()} />)

    const popularSearchScroller = screen.getByTestId(
      'section-tokyo-attractions-popular-searches',
    )
    let scrollLeft = 0

    Object.defineProperties(popularSearchScroller, {
      clientWidth: { configurable: true, value: 100 },
      scrollLeft: {
        configurable: true,
        get: () => scrollLeft,
        set: (value: number) => {
          scrollLeft = value
        },
      },
      scrollWidth: { configurable: true, value: 320 },
    })

    fireEvent.scroll(popularSearchScroller)

    const startOverflow = screen.getByTestId(
      'section-tokyo-attractions-popular-searches-overflow-start',
    )
    const endOverflow = screen.getByTestId(
      'section-tokyo-attractions-popular-searches-overflow-end',
    )

    expect(startOverflow).toHaveClass('opacity-0')
    expect(endOverflow).toHaveClass('opacity-100')

    fireEvent.pointerDown(popularSearchScroller, {
      button: 0,
      clientX: 120,
      pointerId: 1,
    })
    fireEvent.pointerMove(popularSearchScroller, {
      clientX: 60,
      pointerId: 1,
    })
    fireEvent.pointerUp(popularSearchScroller, { pointerId: 1 })

    expect(scrollLeft).toBe(60)
    expect(startOverflow).toHaveClass('opacity-0')
    expect(endOverflow).toHaveClass('opacity-100')

    scrollLeft = 220
    fireEvent.scroll(popularSearchScroller)

    expect(startOverflow).toHaveClass('opacity-100')
    expect(endOverflow).toHaveClass('opacity-0')
  })

  it('falls back to the insurance reminder button when service agent email is missing', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          serviceAgent: {
            email: '',
          },
        })}
      />,
    )

    expect(
      screen.queryByRole('link', { name: /旅遊綜合險/ }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /旅遊綜合險/ }),
    ).toBeInTheDocument()
  })

  it('renders product slots in the new layout order', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(<CrossSellWidget {...cloneSampleData()} />)

    const hotelHeading = screen.getByRole('heading', {
      name: '探索地區飯店',
    })
    const hsrCta = screen.getByRole('link', { name: '前往加購' })
    const attractionBanner = screen.getByTestId('attraction-decor')
    const attractionProduct = screen.getByRole('button', {
      name: /東京迪士尼門票/,
    })
    const transportHeading = screen.getByRole('heading', {
      name: '當地交通 一次搞定',
    })
    const reminderLink = screen.getByRole('link', { name: /簽證護照/ })

    expectElementsInDocumentOrder([
      hotelHeading,
      hsrCta,
      attractionBanner,
      attractionProduct,
      transportHeading,
      reminderLink,
    ])
  })

  it('uses order destination for destination-aware section titles', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          orderDestination: '上海',
        })}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '探索上海飯店' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '探索上海 景點不錯過' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '當地交通 一次搞定' }),
    ).toBeInTheDocument()
  })

  it('falls back to the default destination when order destination is blank', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          orderDestination: '   ',
        })}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '探索地區飯店' }),
    ).toBeInTheDocument()
  })

  it('uses section content title overrides before order destination defaults', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData({
          orderDestination: '上海',
          sectionContentOverrides: {
            attraction: {
              title: '東京票券精選推薦',
            },
          },
        })}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '東京票券精選推薦' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索上海 景點不錯過' }),
    ).not.toBeInTheDocument()
  })

  it('uses resolved section content overrides for view-more labels', () => {
    render(
      <CrossSellWidget
        {...cloneSampleData()}
        sectionContentOverrides={{
          hotel: {
            title: '住宿推薦',
            viewMoreLabel: '看更多住宿',
            viewMorePlaceholderLabel: '全部住宿推薦',
          },
        }}
      />,
    )

    expect(screen.getByRole('link', { name: /看更多住宿/ })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '住宿推薦' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '全部住宿推薦' }),
    ).toBeInTheDocument()
  })

  it('renders the default product image when item image data is missing', () => {
    const data = cloneSampleData()
    data.sections[0].items[0].imageUrl = undefined

    const { container } = render(<CrossSellWidget {...data} />)

    expect(
      container.querySelector(`img[src="${defaultProductImageUrl}"]`),
    ).toBeInTheDocument()
  })

  it('replaces a failed product image with the default image', () => {
    const brokenImageUrl = 'https://example.com/missing-product.jpg'
    const data = cloneSampleData()
    data.sections[0].items[0].imageUrl = brokenImageUrl

    const { container } = render(<CrossSellWidget {...data} />)
    const image = container.querySelector(`img[src="${brokenImageUrl}"]`)

    expect(image).toBeInTheDocument()

    fireEvent.error(image as HTMLImageElement)

    expect(image).toHaveAttribute('src', defaultProductImageUrl)
  })

  it('renders HSR addon defaults and overrides', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()
    const { rerender } = render(
      <CrossSellWidget
        {...cloneSampleData({ hsrAddon: undefined })}
        onSelectAddon={onSelectAddon}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '加購高鐵 行程更順暢' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText((_content, element) => {
        return (
          element?.tagName.toLowerCase() === 'p' &&
          element.textContent === '購買國內外行程，最高享 8 折 優惠'
        )
      }),
    ).toBeInTheDocument()
    expect(screen.getByText('8 折')).toHaveClass('text-primary')
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '前往加購' }))

    expect(onSelectAddon).toHaveBeenLastCalledWith({ addonId: 'hsr' })

    rerender(
      <CrossSellWidget
        {...cloneSampleData({
          hsrAddon: {
            id: 'custom-hsr',
            title: '高鐵加購提醒',
            description: '客製高鐵加購說明',
            ctaLabel: '立即加購高鐵',
          },
        })}
        onSelectAddon={onSelectAddon}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '高鐵加購提醒' }),
    ).toBeInTheDocument()
    expect(screen.getByText('客製高鐵加購說明')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '立即加購高鐵' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '立即加購高鐵' }))

    expect(onSelectAddon).toHaveBeenLastCalledWith({ addonId: 'custom-hsr' })
  })

  it('renders the HSR addon CTA as a UAT link when order data is provided', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()

    render(
      <CrossSellWidget
        {...cloneSampleData({
          domainMode: 'uat',
          order: {
            orderNumber: '16575',
            orderYear: '2026',
          },
        })}
        onSelectAddon={onSelectAddon}
      />,
    )

    const hsrLink = screen.getByRole('link', { name: '前往加購' })

    expect(hsrLink).toHaveAttribute(
      'href',
      'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575',
    )
    expect(hsrLink).toHaveAttribute('target', '_blank')
    expect(hsrLink).toHaveAttribute('rel', 'noopener noreferrer')

    await user.click(hsrLink)

    expect(onSelectAddon).toHaveBeenCalledWith({ addonId: 'hsr' })
  })

  it('renders the HSR addon CTA as a production link when production domain mode is provided', () => {
    reconfigureTestUrl('https://uflight.liontravel.com/orders')

    render(
      <CrossSellWidget
        {...cloneSampleData({
          domainMode: 'production',
          order: {
            orderNumber: '16575',
            orderYear: '2026',
          },
        })}
      />,
    )

    expect(screen.getByRole('link', { name: '前往加購' })).toHaveAttribute(
      'href',
      'https://vacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575',
    )
  })

  it('uses the default UAT domain mode before hostname inference', () => {
    reconfigureTestUrl('https://uflight.liontravel.com/orders')

    render(
      <CrossSellWidget
        {...cloneSampleData({
          domainMode: undefined,
          order: {
            orderNumber: '16575',
            orderYear: '2026',
          },
        })}
      />,
    )

    expect(screen.getByRole('link', { name: '前往加購' })).toHaveAttribute(
      'href',
      'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575',
    )
  })

  it('falls back to the HSR addon button when order data is incomplete', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()

    render(
      <CrossSellWidget
        {...cloneSampleData({
          domainMode: 'uat',
          order: undefined,
        })}
        onSelectAddon={onSelectAddon}
      />,
    )

    expect(
      screen.queryByRole('link', { name: '前往加購' }),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '前往加購' }))

    expect(onSelectAddon).toHaveBeenCalledWith({ addonId: 'hsr' })
  })

  it('uses the default UAT domain mode when domain mode is omitted', () => {
    reconfigureTestUrl('https://holiday.xxx.com/orders')

    render(
      <CrossSellWidget
        {...cloneSampleData({
          domainMode: undefined,
          order: {
            orderNumber: '16575',
            orderYear: '2026',
          },
        })}
      />,
    )

    expect(screen.getByRole('link', { name: '前往加購' })).toHaveAttribute(
      'href',
      'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575',
    )
  })

  it('shows the full duration before the promo starts', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <CrossSellWidget
        {...cloneSampleData({
          promo: {
            ...crossSellWidgetSampleData.promo,
            durationSeconds: 3600,
            startsAt: '2026-04-21T10:10:00Z',
          },
        })}
      />,
    )

    expect(
      screen.getByLabelText('優惠倒數 0 天 1 時 0 分 0 秒'),
    ).toBeInTheDocument()
  })

  it('updates countdown every second and clears the interval on unmount', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')

    const { unmount } = render(
      <CrossSellWidget
        {...cloneSampleData({
          promo: {
            ...crossSellWidgetSampleData.promo,
            durationSeconds: 10,
            startsAt: '2026-04-21T10:00:00Z',
          },
        })}
      />,
    )

    expect(
      screen.getByLabelText('優惠倒數 0 天 0 時 0 分 10 秒'),
    ).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(
      screen.getByLabelText('優惠倒數 0 天 0 時 0 分 9 秒'),
    ).toBeInTheDocument()

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
  })

  it('renders expired state while keeping API-provided product discounts', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <CrossSellWidget
        {...cloneSampleData({
          promo: {
            ...crossSellWidgetSampleData.promo,
            durationSeconds: 3600,
            startsAt: '2026-04-21T08:00:00Z',
          },
        })}
      />,
    )

    expect(screen.getByText('發現更多旅遊靈感！')).toBeInTheDocument()
    expect(screen.queryByText('您已解鎖限時優惠！')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/優惠倒數/)).not.toBeInTheDocument()
    expect(screen.getAllByText('86%東京旅客喜愛').length).toBeGreaterThan(0)
    expect(screen.getAllByText('折扣 20%').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/1,825/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('1,224,152').length).toBeGreaterThan(0)
  })

  it('calls callbacks with product, section, and addon payloads', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()
    const onSelectItem = vi.fn()
    const onViewMore = vi.fn()

    render(
      <CrossSellWidget
        {...cloneSampleData()}
        onSelectAddon={onSelectAddon}
        onSelectItem={onSelectItem}
        onViewMore={onViewMore}
      />,
    )

    const viewMoreLink = screen.getAllByRole('link', { name: /探索更多/ })[0]

    expect(viewMoreLink).toHaveAttribute('href', 'https://www.liontravel.com/')
    expect(viewMoreLink).toHaveAttribute('target', '_blank')
    expect(viewMoreLink).toHaveAttribute('rel', 'noopener noreferrer')

    await user.click(viewMoreLink)
    await user.click(screen.getByRole('button', { name: /LA VISTA 東京灣/ }))
    await user.click(screen.getByRole('link', { name: /前往加購/ }))

    expect(onViewMore).toHaveBeenCalledWith({ sectionId: 'tokyo-hotels' })
    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionId: 'tokyo-hotels',
        item: expect.objectContaining({ id: 'la-vista-tokyo-bay' }),
      }),
    )
    expect(onSelectAddon).toHaveBeenCalledWith({ addonId: 'hsr' })
  })

  it('renders linked API products and still calls the select callback', async () => {
    const user = userEvent.setup()
    const onSelectItem = vi.fn()
    const data = cloneSampleData()
    data.sections[0].items[0] = {
      ...data.sections[0].items[0],
      href: 'https://uhotel.liontravel.com/detail/JPTYO001',
    }

    render(<CrossSellWidget {...data} onSelectItem={onSelectItem} />)

    const productLink = screen.getByRole('link', { name: /LA VISTA 東京灣/ })

    expect(productLink).toHaveAttribute(
      'href',
      'https://uhotel.liontravel.com/detail/JPTYO001',
    )
    expect(productLink).toHaveAttribute('target', '_blank')
    expect(productLink).toHaveAttribute('rel', 'noopener noreferrer')

    await user.click(productLink)

    expect(onSelectItem).toHaveBeenCalledWith(
      expect.objectContaining({
        sectionId: 'tokyo-hotels',
        item: expect.objectContaining({ id: 'la-vista-tokyo-bay' }),
      }),
    )
  })

  it('uses the section view-more href when provided', () => {
    const data = cloneSampleData()
    data.sections[0].viewMoreHref =
      'https://uhotel.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC'

    render(<CrossSellWidget {...data} />)

    expect(
      screen.getAllByRole('link', { name: /探索更多/ })[0],
    ).toHaveAttribute(
      'href',
      'https://uhotel.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC',
    )
  })

  it('falls back to legacy section id and title classification without section kind', () => {
    const legacySections = cloneSampleData().sections.map((section) => {
      if (section.kind === 'hotel') {
        return { ...section, kind: undefined, title: '探索東京飯店' }
      }

      if (section.kind === 'attraction') {
        return { ...section, kind: undefined, title: '探索東京 景點不錯過' }
      }

      if (section.kind === 'transport') {
        return { ...section, kind: undefined, title: '當地交通 一次搞定' }
      }

      return { ...section, kind: undefined }
    })

    render(
      <CrossSellWidget
        {...cloneSampleData({
          sections: legacySections,
        })}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(screen.getByTestId('attraction-decor')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /東京迪士尼門票/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '當地交通 一次搞定' }),
    ).toBeInTheDocument()
  })
})
