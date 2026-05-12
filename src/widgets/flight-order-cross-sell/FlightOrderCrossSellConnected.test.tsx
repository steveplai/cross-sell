import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { RequestClient } from '@/shared/request'

import { FlightOrderCrossSellConnected } from './FlightOrderCrossSellConnected'
import { flightOrderCrossSellSampleData } from './sampleData'
import type { FlightOrderCrossSellData } from './types'

type MockRequestClientRequest = (
  pathname: string,
  init?: RequestInit,
) => Promise<unknown>

function cloneSampleData(overrides: Partial<FlightOrderCrossSellData> = {}) {
  const sampleData = JSON.parse(
    JSON.stringify(flightOrderCrossSellSampleData),
  ) as FlightOrderCrossSellData

  return {
    ...sampleData,
    ...overrides,
  }
}

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

  it('renders provided data without calling the API', () => {
    const get = vi.fn<MockRequestClientRequest>()
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnected
        data={cloneSampleData()}
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(get).not.toHaveBeenCalled()
  })

  it('loads AP-56 carousel data by order number and keeps static content', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56CrossSellingResponse)
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnected
        orderNumber="2026-123456"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(screen.getByText('您已解鎖限時優惠！')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /東京灣精選飯店/ }),
    ).toHaveAttribute('href', 'https://uhotel.liontravel.com/detail/JPTYO001')
    expect(screen.getByRole('link', { name: /東京 旅遊/ })).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /LA VISTA 東京灣/ }),
    ).not.toBeInTheDocument()
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
      <FlightOrderCrossSellConnected
        orderNumber="2026-123456"
        recommendProductTypes={['htl', 'etk', 'flt']}
        requestClient={requestClient}
      />,
    )

    await waitFor(() => {
      expect(get).toHaveBeenCalledWith(
        '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk%2Cflt',
        {
          signal: expect.any(AbortSignal),
        },
      )
    })
  })

  it('hides the widget when API loading fails in hidden error mode', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('failed'))
    const requestClient = createMockRequestClient(get)

    const { container } = render(
      <FlightOrderCrossSellConnected
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
      <FlightOrderCrossSellConnected
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
