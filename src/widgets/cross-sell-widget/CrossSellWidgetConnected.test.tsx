import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { RequestClient } from '@/shared/request'

import {
  widgetRootNameAttribute,
  widgetRootSelector,
} from '../../runtime/widgetRoot'
import { CrossSellWidgetConnectedForTesting } from './CrossSellWidgetConnected'

type MockRequestClientRequest = (
  pathname: string,
  init?: RequestInit,
) => Promise<unknown>

function createMockRequestClient(get: MockRequestClientRequest): RequestClient {
  return {
    get: <T,>(pathname: string, init?: RequestInit) =>
      get(pathname, init) as Promise<T>,
    request: <T,>(pathname: string, init?: RequestInit) =>
      get(pathname, init) as Promise<T>,
  }
}

const ap56CrossSellResponse = [
  {
    Type: '訂房',
    CombineTagList: ['東京 旅遊', '東京 鐵塔'],
    pList: [
      {
        ID: 'JPTYO001',
        Title: '東京灣精選飯店',
        ProductUrl: 'https://uhotel.liontravel.com/detail/JPTYO001',
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
      {
        ID: 'JPTYO002',
        Title: '東京非常好飯店',
        ProductUrl: 'https://uhotel.liontravel.com/detail/JPTYO002',
        Price: 4200,
        SaleCurr: 'TWD',
        CityName: ['東京'],
        Level: 4,
        Rating: 4,
        RatingCount: 88,
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
  {
    Type: '票券(玩樂)',
    pList: [
      {
        ID: 'ETK001',
        Title: '東京很不錯票券',
        ProductUrl: 'https://activity.liontravel.com/detail/ETK001',
        Price: 1200,
        SaleCurr: 'TWD',
        CityName: ['東京'],
        Rating: 3.5,
        RatingCount: 45,
      },
    ],
  },
  {
    Type: '票券(交通)',
    pList: [
      {
        ID: 'TRF001',
        Title: '低分交通票券',
        ProductUrl: 'https://activity.liontravel.com/detail/TRF001',
        Price: 800,
        SaleCurr: 'TWD',
        Rating: 3.4,
        RatingCount: 34,
      },
    ],
  },
]

describe('CrossSellWidgetConnected', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('會在 connected states 渲染 widget root marker', () => {
    const { container } = render(
      <CrossSellWidgetConnectedForTesting errorMode="message" />,
    )

    const root = container.querySelector(widgetRootSelector)

    expect(root).not.toBeNull()
    expect(root?.getAttribute(widgetRootNameAttribute)).toBe(
      'cross-sell-widget-connected',
    )
  })

  it('message error mode 缺少 order number 時會顯示 error message', () => {
    const get = vi.fn<MockRequestClientRequest>()
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        errorMode="message"
        requestClient={requestClient}
      />,
    )

    expect(
      screen.getByText('缺少訂單編號，無法載入推薦內容。'),
    ).toBeInTheDocument()
    expect(get).not.toHaveBeenCalled()
  })

  it('會依 order number 載入 AP-56 carousel data 並保留 static content', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        environment="uat"
        orderNumber="2026-123456"
        requestClient={requestClient}
        travelInsuranceContactEmail="insurance@example.com"
      />,
    )

    expect(
      await screen.findByRole('heading', { name: '探索地區飯店' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '訂房' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /東京灣精選飯店/ }),
    ).toHaveAttribute('href', 'https://uhotel.liontravel.com/detail/JPTYO001')
    expect(screen.getByRole('link', { name: /東京 旅遊/ })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /LA VISTA 東京灣/ }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toHaveAttribute(
      'href',
      'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=123456',
    )

    const insuranceHref =
      screen.getByRole('link', { name: /旅遊綜合險/ }).getAttribute('href') ??
      ''
    const insuranceSearchParams = new URLSearchParams(
      insuranceHref.split('?')[1],
    )

    expect(insuranceSearchParams.get('subject')).toBe(
      '加購保險【訂單編號: 2026-123456】',
    )
    expect(insuranceHref).toContain('mailto:insurance@example.com')
    expect(get).toHaveBeenCalledWith(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
      {
        signal: expect.any(AbortSignal),
      },
    )
  })

  it('flight source product 會保留所有既有 blocks 可見', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        requestClient={requestClient}
        sourceProduct="flight"
      />,
    )

    expect(
      await screen.findByRole('heading', { name: '探索地區飯店' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
    expect(screen.getByText('簽證護照')).toBeInTheDocument()
    expect(screen.getByText('旅遊綜合險')).toBeInTheDocument()
  })

  it('hotel source product 會隱藏 hotel recommendations 與 reminders', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        requestClient={requestClient}
        sourceProduct="hotel"
      />,
    )

    expect(
      await screen.findByRole('link', { name: /東京很不錯票券/ }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索地區飯店' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
    expect(screen.queryByText('簽證護照')).not.toBeInTheDocument()
    expect(screen.queryByText('旅遊綜合險')).not.toBeInTheDocument()
  })

  it('ticket source product 會隱藏 hotel、HSR 與 reminders', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        requestClient={requestClient}
        sourceProduct="ticket"
      />,
    )

    expect(
      await screen.findByRole('link', { name: /東京很不錯票券/ }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索地區飯店' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: '前往加購' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('簽證護照')).not.toBeInTheDocument()
    expect(screen.queryByText('旅遊綜合險')).not.toBeInTheDocument()
  })

  it('會讓 visible blocks override source product preset', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        requestClient={requestClient}
        sourceProduct="ticket"
        visibleBlocks={{ hsr: true }}
      />,
    )

    expect(
      await screen.findByRole('link', { name: /東京很不錯票券/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '探索地區飯店' }),
    ).not.toBeInTheDocument()
  })

  it('會依 spec thresholds 渲染 AP-56 rating content', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByRole('link', { name: /東京灣精選飯店/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /東京非常好飯店/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /東京很不錯票券/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /低分交通票券/ }),
    ).toBeInTheDocument()

    expect(screen.getByText('太讚了')).toBeInTheDocument()
    expect(screen.getByText('非常好')).toBeInTheDocument()
    expect(screen.getByText('很不錯')).toBeInTheDocument()
    expect(screen.queryByText('3.4')).not.toBeInTheDocument()
    expect(screen.queryByText('(34)')).not.toBeInTheDocument()
  })

  it('會將 custom recommend product types 傳給 API', async () => {
    const get = vi.fn<MockRequestClientRequest>().mockResolvedValue([])
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        environment="uat"
        orderNumber="202605120001"
        recommendProductTypes={['htl', 'etk', 'flt']}
        requestClient={requestClient}
      />,
    )

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith(
        '/category/_fringe/CrossSelling?OrderNo=202605120001&RecommendProductType=htl%2Cetk%2Cflt',
        {
          signal: expect.any(AbortSignal),
        },
      )
    })
    expect(
      await screen.findByRole('link', { name: '前往加購' }),
    ).toHaveAttribute(
      'href',
      'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=202605120001',
    )
  })

  it('會將 section content overrides 套用到 API sections', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        requestClient={requestClient}
        sectionContentOverrides={{
          hotel: {
            viewMoreLabel: '查看更多飯店',
            viewMorePlaceholderLabel: '全部飯店推薦',
          },
        }}
      />,
    )

    expect(
      await screen.findByRole('link', { name: /查看更多飯店/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: '全部飯店推薦' }),
    ).toBeInTheDocument()
  })

  it('會將 order destination 套用到 API section titles', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderDestination="上海"
        orderNumber="2026-123456"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: '探索上海飯店' }),
    ).toBeInTheDocument()
  })

  it('AP-56 回傳 empty sections 時會渲染 static content', async () => {
    const get = vi.fn<MockRequestClientRequest>().mockResolvedValue([])
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        environment="uat"
        orderNumber="2026-123456"
        requestClient={requestClient}
      />,
    )

    expect(await screen.findByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: '訂房' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: '前往加購' })).toHaveAttribute(
      'href',
      'https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=123456',
    )
  })

  it('會讓 first-level promo timing props override promo content timing', async () => {
    const get = vi.fn<MockRequestClientRequest>().mockResolvedValue([])
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="2026-123456"
        promo={{
          activeTitle: '一級倒數優惠',
          expiredTitle: '倒數已結束',
          startsAt: '2000-01-01T00:00:00.000Z',
          durationSeconds: 1,
        }}
        promoDurationSeconds={40 * 60 * 60}
        promoStartsAt={new Date(Date.now() - 10 * 60 * 1000).toISOString()}
        requestClient={requestClient}
      />,
    )

    expect(await screen.findByText('一級倒數優惠')).toBeInTheDocument()
    expect(screen.queryByText('倒數已結束')).not.toBeInTheDocument()
  })

  it('hidden error mode 中 API loading 失敗時會隱藏 widget', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('失敗'))
    const requestClient = createMockRequestClient(get)

    const { container } = render(
      <CrossSellWidgetConnectedForTesting
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    await waitFor(() => {
      expect(get).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement()
    })
  })

  it('message error mode 中 API loading 失敗時會顯示 error message', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('失敗'))
    const requestClient = createMockRequestClient(get)

    render(
      <CrossSellWidgetConnectedForTesting
        errorMode="message"
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByText('目前無法載入推薦內容，請稍後再試。'),
    ).toBeInTheDocument()
  })
})
