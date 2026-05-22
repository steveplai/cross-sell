import { describe, expect, it, vi } from 'vitest'

import type { RequestClient } from '@/shared/request'

import {
  createAp56CrossSellApi,
  createAp56CrossSellPath,
  resolveAp56CrossSellBaseUrl,
} from './ap56CrossSellApi'
import { mapAp56CrossSellResponseToSections } from './ap56CrossSellMapper'

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

const ap56EnvelopeResponse = {
  ProductDataList: [
    {
      Type: '訂房',
      CombineTagList: null,
      pList: [
        {
          ID: 'CVSID036',
          Title: '薩梅杜薩爾青年旅舍',
          ProductUrl:
            'https://uhotelzkk.liontravel.com/detail/cv-island-of-sal-xamedu-sal-hostel',
          Price: 4610,
          ImgUrl: 'https://static.liontech.com.tw/hotelpics/TAIWAN_FANS.jpg',
          SaleCurr: 'TWD',
          CountryName: ['維德角'],
          CityName: ['ISLAND OF SAL'],
          SalePrice: 4610,
          Discount: null,
          Location: {
            Name: '聖瑪莉亞市廣場',
            Distance: 0,
            Unit: '公里',
          },
          Level: 2,
          Rating: 5,
          RatingCount: 2,
          Likeability: 87,
          CancelTag: null,
        },
      ],
    },
    {
      Type: '訂房-看更多(搜尋頁)',
      CombineTagList: null,
      pList: [
        {
          ProductUrl: 'https://uhotelzkk.liontravel.com/search?searchParam=abc',
        },
      ],
    },
  ],
}

describe('AP-56 cross-sell API', () => {
  it('creates the AP-56 endpoint path with default recommend product types', () => {
    expect(createAp56CrossSellPath('2026-123456')).toBe(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
    )
  })

  it('supports custom recommend product types', () => {
    expect(createAp56CrossSellPath('2026-123456', ['htl', 'etk'])).toBe(
      '/category/_fringe/CrossSelling?OrderNo=2026-123456&RecommendProductType=htl%2Cetk',
    )
  })

  it('prefers an explicit API base URL', () => {
    expect(
      resolveAp56CrossSellBaseUrl('https://proxy.example.com', 'uat', {
        hostname: 'uflight.liontravel.com',
        origin: 'https://uflight.liontravel.com',
      }),
    ).toBe('https://proxy.example.com')
  })

  it('uses the current Lion Travel origin to keep browser requests same-origin', () => {
    expect(
      resolveAp56CrossSellBaseUrl(undefined, 'uat', {
        hostname: 'uflight.liontravel.com',
        origin: 'https://uflight.liontravel.com',
      }),
    ).toBe('https://uflight.liontravel.com')

    expect(
      resolveAp56CrossSellBaseUrl(undefined, 'production', {
        hostname: 'flight.liontravel.com',
        origin: 'https://flight.liontravel.com',
      }),
    ).toBe('https://flight.liontravel.com')
  })

  it('falls back to the AP-56 www origin outside Lion Travel pages', () => {
    expect(
      resolveAp56CrossSellBaseUrl(undefined, 'uat', {
        hostname: 'localhost',
        origin: 'http://localhost:6006',
      }),
    ).toBe('https://uwww.liontravel.com')

    expect(resolveAp56CrossSellBaseUrl(undefined, 'production')).toBe(
      'https://www.liontravel.com',
    )
  })

  it('requests AP-56 and maps the raw array to carousel sections', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56Response)
    const requestClient = createMockRequestClient(get)
    const api = createAp56CrossSellApi({ requestClient })

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
    const sections = mapAp56CrossSellResponseToSections(ap56Response)
    const hotelSection = sections.find((section) => section.kind === 'hotel')

    expect(hotelSection).toMatchObject({
      kind: 'hotel',
      popularSearches: [
        {
          id: '東京 旅遊',
          label: '東京 旅遊',
          href: 'https://activity.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC+%E6%97%85%E9%81%8A',
        },
        {
          id: '東京 鐵塔',
          label: '東京 鐵塔',
          href: 'https://activity.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC+%E9%90%B5%E5%A1%94',
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
    expect(hotelSection?.items[0]).not.toHaveProperty('recommendationBadge')
    expect(hotelSection).not.toHaveProperty('title')
  })

  it('assigns recommendation badges from the AP-56 product order', () => {
    const createProduct = (index: number) => ({
      ID: `badge-${index}`,
      Title: `推薦商品 ${index}`,
      Price: 1000 + index,
      Likeability: 90 - index,
    })

    const oneItemSection = mapAp56CrossSellResponseToSections([
      {
        Type: '訂房',
        pList: [createProduct(1)],
      },
    ])[0]
    const fourItemSection = mapAp56CrossSellResponseToSections([
      {
        Type: '訂房',
        pList: [1, 2, 3, 4].map(createProduct),
      },
    ])[0]
    const fiveItemSection = mapAp56CrossSellResponseToSections([
      {
        Type: '訂房',
        pList: [1, 2].map(createProduct),
      },
      {
        Type: '訂房',
        pList: [3, 4, 5].map(createProduct),
      },
    ])[0]

    expect(
      oneItemSection.items.map((item) => item.recommendationBadge),
    ).toEqual([undefined])
    expect(
      fourItemSection.items.map((item) => item.recommendationBadge),
    ).toEqual(['熱銷 TOP1', undefined, undefined, undefined])
    expect(
      fiveItemSection.items.map((item) => item.recommendationBadge),
    ).toEqual([
      '熱銷 TOP1',
      '熱銷 TOP2',
      '熱銷 TOP3',
      '最多旅客喜愛',
      undefined,
    ])
  })

  it('maps AP-56 product display fields by section kind', () => {
    const createProduct = (index: number) => ({
      ID: `kind-${index}`,
      Title: `推薦商品 ${index}`,
      ProductUrl: `https://example.com/products/${index}`,
      Price: 1000 + index,
      CityName: ['東京'],
      Level: 5,
      Location: {
        Name: '東京車站',
        Distance: 0.5,
        Unit: '公里',
      },
    })
    const sections = mapAp56CrossSellResponseToSections([
      {
        Type: '訂房',
        pList: [1, 2].map(createProduct),
      },
      {
        Type: '票券(玩樂)',
        pList: [3, 4].map(createProduct),
      },
      {
        Type: '票券(交通)',
        pList: [5, 6].map(createProduct),
      },
    ])
    const hotelItem = sections.find((section) => section.kind === 'hotel')
      ?.items[0]
    const attractionItem = sections.find(
      (section) => section.kind === 'attraction',
    )?.items[0]
    const transportItem = sections.find(
      (section) => section.kind === 'transport',
    )?.items[0]

    expect(hotelItem).toBeDefined()
    expect(attractionItem).toBeDefined()
    expect(transportItem).toBeDefined()
    expect(hotelItem).toMatchObject({
      recommendationBadge: '熱銷 TOP1',
      location: '距離東京車站0.5公里',
      detailLocation: '東京',
      starRating: 5,
    })
    expect(attractionItem).toMatchObject({
      recommendationBadge: '熱銷 TOP1',
      location: '東京',
    })
    expect(attractionItem).not.toHaveProperty('detailLocation')
    expect(attractionItem).not.toHaveProperty('starRating')
    expect(transportItem).not.toHaveProperty('recommendationBadge')
    expect(transportItem).toMatchObject({
      location: '東京',
    })
    expect(transportItem).not.toHaveProperty('detailLocation')
    expect(transportItem).not.toHaveProperty('starRating')
  })

  it('maps AP-56 rating labels by the spec thresholds', () => {
    const sections = mapAp56CrossSellResponseToSections([
      {
        Type: '訂房',
        pList: [
          {
            ID: 'rating-hidden',
            Title: '低分不顯示評論',
            Price: 1000,
            Rating: 3.4,
            RatingCount: 10,
          },
          {
            ID: 'rating-good',
            Title: '很不錯評論',
            Price: 1000,
            Rating: 3.5,
            RatingCount: 20,
          },
          {
            ID: 'rating-great',
            Title: '非常好評論',
            Price: 1000,
            Rating: 4,
            RatingCount: 30,
          },
          {
            ID: 'rating-excellent',
            Title: '太讚了評論',
            Price: 1000,
            Rating: 4.5,
            RatingCount: 40,
          },
        ],
      },
    ])
    const hotelSection = sections.find((section) => section.kind === 'hotel')

    expect(hotelSection?.items).toEqual([
      expect.objectContaining({
        id: 'rating-hidden',
        rating: undefined,
        ratingLabel: undefined,
        reviewCount: undefined,
      }),
      expect.objectContaining({
        id: 'rating-good',
        rating: '3.5',
        ratingLabel: '很不錯',
        reviewCount: 20,
      }),
      expect.objectContaining({
        id: 'rating-great',
        rating: '4',
        ratingLabel: '非常好',
        reviewCount: 30,
      }),
      expect.objectContaining({
        id: 'rating-excellent',
        rating: '4.5',
        ratingLabel: '太讚了',
        reviewCount: 40,
      }),
    ])
  })

  it('maps AP-56 popular search links with the configured domain mode', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockResolvedValue(ap56Response)
    const requestClient = createMockRequestClient(get)
    const api = createAp56CrossSellApi({
      domainMode: 'uat',
      requestClient,
    })

    const sections = await api.getByOrderNumber('2026-123456')
    const hotelSection = sections.find((section) => section.kind === 'hotel')

    expect(hotelSection?.popularSearches?.[0]).toMatchObject({
      id: '東京 旅遊',
      label: '東京 旅遊',
      href: 'https://uactivity.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC+%E6%97%85%E9%81%8A',
    })
  })

  it('maps enveloped AP-56 responses and ProductUrl view-more rows', () => {
    const sections = mapAp56CrossSellResponseToSections(ap56EnvelopeResponse)
    const hotelSection = sections.find((section) => section.kind === 'hotel')

    expect(hotelSection).toMatchObject({
      kind: 'hotel',
      viewMoreHref: 'https://uhotelzkk.liontravel.com/search?searchParam=abc',
      items: [
        expect.objectContaining({
          id: 'CVSID036',
          title: '薩梅杜薩爾青年旅舍',
          href: 'https://uhotelzkk.liontravel.com/detail/cv-island-of-sal-xamedu-sal-hostel',
          detailLocation: 'ISLAND OF SAL',
          location: '距離聖瑪莉亞市廣場0公里',
          price: 4610,
          pricePrefix: 'TWD',
          rating: '5',
          ratingLabel: '太讚了',
          reviewCount: 2,
        }),
      ],
    })
  })

  it('maps an empty AP-56 response to empty carousel sections', () => {
    expect(mapAp56CrossSellResponseToSections([])).toEqual([])
  })
})
