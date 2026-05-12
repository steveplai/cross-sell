import { describe, expect, it, vi } from 'vitest'

import type { RequestClient } from '@/shared/request'

import { mapAp56CrossSellingResponseToSections } from './ap56CrossSellingMapper'
import {
  createFlightOrderCrossSellApi,
  createFlightOrderCrossSellPath,
} from './flightOrderCrossSellApi'

type MockRequestClientRequest = (
  pathname: string,
  init?: RequestInit,
) => Promise<unknown>

function createMockRequestClient(get: MockRequestClientRequest): RequestClient {
  return {
    get: <T>(pathname: string, init?: RequestInit) =>
      get(pathname, init) as Promise<T>,
    request: <T>(pathname: string, init?: RequestInit) =>
      get(pathname, init) as Promise<T>,
  }
}

const ap56Response = [
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
  {
    Type: '票券(交通)-看更多(搜尋頁)',
    pList: [
      {
        url: 'https://uactivity.liontravel.com/search?searchkindname=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8',
      },
    ],
  },
]

describe('flight order cross-sell AP-56 API', () => {
  it('creates the AP-56 endpoint path with default recommend product types', () => {
    expect(createFlightOrderCrossSellPath('2026-123456')).toBe(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
    )
  })

  it('supports custom recommend product types', () => {
    expect(createFlightOrderCrossSellPath('2026-123456', ['htl', 'etk'])).toBe(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
    )
  })

  it('requests AP-56 and maps the raw array to carousel sections', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56Response)
    const requestClient = createMockRequestClient(get)
    const api = createFlightOrderCrossSellApi({ requestClient })

    await expect(api.getByOrderNumber('2026-123456')).resolves.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'hotel',
          viewMoreHref:
            'https://uhotel.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC',
        }),
      ]),
    )
    expect(get).toHaveBeenCalledWith(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
      undefined,
    )
  })

  it('maps AP-56 product fields to widget product fields', () => {
    const sections = mapAp56CrossSellingResponseToSections(ap56Response)
    const hotelSection = sections.find((section) => section.kind === 'hotel')

    expect(hotelSection).toMatchObject({
      kind: 'hotel',
      categories: [
        {
          id: '東京 旅遊',
          label: '東京 旅遊',
          href: 'https://uhotel.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC',
        },
        {
          id: '東京 鐵塔',
          label: '東京 鐵塔',
          href: 'https://uhotel.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC',
        },
      ],
      items: [
        expect.objectContaining({
          id: 'JPTYO001',
          title: '東京灣精選飯店',
          href: 'https://uhotel.liontravel.com/detail/JPTYO001',
          imageUrl: 'https://static.liontech.com.tw/hotel.jpg',
          location: '距離東京車站0.5公里',
          detailLocation: '東京',
          promoBadge: '95%旅客喜愛',
          starRating: 5,
          rating: '4.5',
          ratingLabel: '太讚了',
          reviewCount: 156,
          cancellationLabel: '免費取消',
          originalPrice: 6200,
          discountLabel: '折扣 5%',
          price: 5830,
          pricePrefix: 'TWD',
          priceSuffix: '起',
        }),
      ],
    })
  })

  it('maps an empty AP-56 response to empty carousel sections', () => {
    expect(mapAp56CrossSellingResponseToSections([])).toEqual([])
  })
})
