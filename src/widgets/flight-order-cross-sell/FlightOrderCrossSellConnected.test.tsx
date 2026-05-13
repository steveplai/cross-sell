import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { RequestClient } from '@/shared/request'

import { FlightOrderCrossSellConnectedForTesting } from './FlightOrderCrossSellConnected'

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

const ap56CrossSellingResponse = [
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

describe('FlightOrderCrossSellConnected', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('shows an error message when order number is missing in message error mode', () => {
    const get = vi.fn<MockRequestClientRequest>()
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnectedForTesting
        errorMode="message"
        requestClient={requestClient}
      />,
    )

    expect(
      screen.getByText('缺少訂單編號，無法載入推薦內容。'),
    ).toBeInTheDocument()
    expect(get).not.toHaveBeenCalled()
  })

  it('loads AP-56 carousel data by order number and keeps static content', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellingResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnectedForTesting
        domainMode="uat"
        orderNumber="2026-123456"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: '訂房' }),
    ).toBeInTheDocument()
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
    expect(get).toHaveBeenCalledWith(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
      {
        signal: expect.any(AbortSignal),
      },
    )
  })

  it('passes custom recommend product types to the API', async () => {
    const get = vi.fn<MockRequestClientRequest>().mockResolvedValue([])
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnectedForTesting
        domainMode="uat"
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

  it('renders static content when AP-56 returns empty sections', async () => {
    const get = vi.fn<MockRequestClientRequest>().mockResolvedValue([])
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnectedForTesting
        domainMode="uat"
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

  it('hides the widget when API loading fails in hidden error mode', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('failed'))
    const requestClient = createMockRequestClient(get)

    const { container } = render(
      <FlightOrderCrossSellConnectedForTesting
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

  it('shows an error message when API loading fails in message error mode', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('failed'))
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnectedForTesting
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
