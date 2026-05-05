import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FlightOrderCrossSell } from './FlightOrderCrossSell'
import { flightOrderCrossSellSampleData } from './sampleData'
import type { FlightOrderCrossSellData } from './types'

interface JsdomGlobal {
  jsdom?: {
    reconfigure(options: { url: string }): void
  }
}

function cloneSampleData(overrides: Partial<FlightOrderCrossSellData> = {}) {
  const sampleData = JSON.parse(
    JSON.stringify(flightOrderCrossSellSampleData),
  ) as FlightOrderCrossSellData

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

const defaultProductImageUrl =
  'https://static.liontech.com.tw/CommonResources/images/lionTravel/default_img.png'

describe('FlightOrderCrossSell', () => {
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
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
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

    render(<FlightOrderCrossSell data={cloneSampleData()} />)

    expect(
      screen.getByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '探索東京 景點不錯過' }),
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
    const categoryLink = screen.getAllByRole('link', {
      name: '東京迪士尼',
    })[0]

    expect(categoryLink).toHaveAttribute(
      'href',
      'https://www.liontravel.com/search?keyword=%E6%9D%B1%E4%BA%AC%E8%BF%AA%E5%A3%AB%E5%B0%BC',
    )
    expect(categoryLink).toHaveAttribute('target', '_blank')
    expect(categoryLink).toHaveAttribute('rel', 'noopener noreferrer')

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

  it('keeps category overflow hints hidden when categories fit', () => {
    render(<FlightOrderCrossSell data={cloneSampleData()} />)

    const categoryScroller = screen.getByTestId(
      'section-tokyo-attractions-categories',
    )

    Object.defineProperties(categoryScroller, {
      clientWidth: { configurable: true, value: 320 },
      scrollWidth: { configurable: true, value: 320 },
    })

    fireEvent.scroll(categoryScroller)

    expect(
      screen.getByTestId('section-tokyo-attractions-categories-overflow-start'),
    ).toHaveClass('opacity-0')
    expect(
      screen.getByTestId('section-tokyo-attractions-categories-overflow-end'),
    ).toHaveClass('opacity-0')
  })

  it('updates category overflow hints while dragging horizontally', () => {
    render(<FlightOrderCrossSell data={cloneSampleData()} />)

    const categoryScroller = screen.getByTestId(
      'section-tokyo-attractions-categories',
    )
    let scrollLeft = 0

    Object.defineProperties(categoryScroller, {
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

    fireEvent.scroll(categoryScroller)

    const startOverflow = screen.getByTestId(
      'section-tokyo-attractions-categories-overflow-start',
    )
    const endOverflow = screen.getByTestId(
      'section-tokyo-attractions-categories-overflow-end',
    )

    expect(startOverflow).toHaveClass('opacity-0')
    expect(endOverflow).toHaveClass('opacity-100')

    fireEvent.pointerDown(categoryScroller, {
      button: 0,
      clientX: 120,
      pointerId: 1,
    })
    fireEvent.pointerMove(categoryScroller, {
      clientX: 60,
      pointerId: 1,
    })
    fireEvent.pointerUp(categoryScroller, { pointerId: 1 })

    expect(scrollLeft).toBe(60)
    expect(startOverflow).toHaveClass('opacity-0')
    expect(endOverflow).toHaveClass('opacity-100')

    scrollLeft = 220
    fireEvent.scroll(categoryScroller)

    expect(startOverflow).toHaveClass('opacity-100')
    expect(endOverflow).toHaveClass('opacity-0')
  })

  it('falls back to the insurance reminder button when service agent email is missing', () => {
    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          serviceAgent: undefined,
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

    render(<FlightOrderCrossSell data={cloneSampleData()} />)

    const hotelHeading = screen.getByRole('heading', {
      name: '探索東京飯店',
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

  it('uses the attraction banner title override when provided', () => {
    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          attractionBannerOverrides: {
            title: '東京票券精選推薦',
          },
        })}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '東京票券精選推薦' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索東京 景點不錯過' }),
    ).not.toBeInTheDocument()
  })

  it('renders the default product image when item image data is missing', () => {
    const data = cloneSampleData()
    data.sections[0].items[0].imageUrl = undefined

    const { container } = render(<FlightOrderCrossSell data={data} />)

    expect(
      container.querySelector(`img[src="${defaultProductImageUrl}"]`),
    ).toBeInTheDocument()
  })

  it('replaces a failed product image with the default image', () => {
    const brokenImageUrl = 'https://example.com/missing-product.jpg'
    const data = cloneSampleData()
    data.sections[0].items[0].imageUrl = brokenImageUrl

    const { container } = render(<FlightOrderCrossSell data={data} />)
    const image = container.querySelector(`img[src="${brokenImageUrl}"]`)

    expect(image).toBeInTheDocument()

    fireEvent.error(image as HTMLImageElement)

    expect(image).toHaveAttribute('src', defaultProductImageUrl)
  })

  it('renders HSR addon defaults and partial overrides', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()
    const { rerender } = render(
      <FlightOrderCrossSell
        data={cloneSampleData({ hsrAddon: undefined })}
        onSelectAddon={onSelectAddon}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '加購高鐵 行程更順暢' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('購買國內外行程，最高享 8 折優惠'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '前往加購' }))

    expect(onSelectAddon).toHaveBeenLastCalledWith({ addonId: 'hsr' })

    rerender(
      <FlightOrderCrossSell
        data={cloneSampleData({
          hsrAddon: {
            id: 'custom-hsr',
            title: '高鐵加購提醒',
          },
        })}
        onSelectAddon={onSelectAddon}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '高鐵加購提醒' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('購買國內外行程，最高享 8 折優惠'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: '前往加購' }))

    expect(onSelectAddon).toHaveBeenLastCalledWith({ addonId: 'custom-hsr' })
  })

  it('renders the HSR addon CTA as a UAT link when order data is provided', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
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
      <FlightOrderCrossSell
        data={cloneSampleData({
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

  it('infers the HSR addon CTA domain mode from a supported flight hostname', () => {
    reconfigureTestUrl('https://uflight.liontravel.com/orders')

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
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
      <FlightOrderCrossSell
        data={cloneSampleData({
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

  it('falls back to the HSR addon button when domain mode and hostname inference are unavailable', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()
    reconfigureTestUrl('https://holiday.xxx.com/orders')

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          domainMode: undefined,
          order: {
            orderNumber: '16575',
            orderYear: '2026',
          },
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

  it('shows the full duration before the promo starts', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
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
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
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

  it('renders expired state without special offer pricing', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-21T10:00:00Z'))

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
          promo: {
            ...flightOrderCrossSellSampleData.promo,
            durationSeconds: 3600,
            startsAt: '2026-04-21T08:00:00Z',
          },
        })}
      />,
    )

    expect(screen.getByText('發現更多旅遊靈感！')).toBeInTheDocument()
    expect(screen.queryByText('您已解鎖限時優惠！')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/優惠倒數/)).not.toBeInTheDocument()
    expect(screen.queryByText('折扣 20%')).not.toBeInTheDocument()
    expect(screen.queryByText(/1,825/)).not.toBeInTheDocument()
    expect(screen.getAllByText('1,224,152').length).toBeGreaterThan(0)
  })

  it('calls callbacks with product, section, and addon payloads', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()
    const onSelectItem = vi.fn()
    const onViewMore = vi.fn()

    render(
      <FlightOrderCrossSell
        data={cloneSampleData()}
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

  it('falls back to legacy section id and title classification without section kind', () => {
    const legacySections = cloneSampleData().sections.map((section) => ({
      ...section,
      kind: undefined,
    }))

    render(
      <FlightOrderCrossSell
        data={cloneSampleData({
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
