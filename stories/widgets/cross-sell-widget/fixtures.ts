import type { RequestClient } from '../../../src/shared/request'
import type { LiontravelDomainMode } from '../../../src/shared/utils/liontravelUrl'

type MockRequestHandler = (
  pathname: string,
  init?: RequestInit,
) => Promise<unknown>

function createMockRequestClient(handler: MockRequestHandler): RequestClient {
  return {
    get: <T>(pathname: string, init?: RequestInit) =>
      handler(pathname, init) as Promise<T>,
    request: <T>(pathname: string, init?: RequestInit) =>
      handler(pathname, init) as Promise<T>,
  }
}

const ap56CrossSellStoryResponse = [
  {
    Type: '訂房',
    CombineTagList: ['東京 旅遊', '東京 鐵塔'],
    pList: [
      {
        ID: 'JP-TYO-001',
        Title: '東京太讚了飯店 Rating 4.5',
        ProductUrl: 'https://uhotel.liontravel.com/detail/JP-TYO-001',
        Price: 5830,
        ImgUrl: 'https://picsum.photos/seed/liontravel-city-hotel/640/426',
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
        ID: 'JP-TYO-002',
        Title: '東京非常好飯店 Rating 4.0',
        ProductUrl: 'https://uhotel.liontravel.com/detail/JP-TYO-002',
        Price: 4200,
        ImgUrl: 'https://picsum.photos/seed/liontravel-business-hotel/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        SalePrice: 4800,
        Discount: 10,
        Location: {
          Name: '上野站',
          Distance: 0.8,
          Unit: '公里',
        },
        Level: 4,
        Rating: 4,
        RatingCount: 88,
        Likeability: 89,
        CancelTag: '免費取消',
      },
      {
        ID: 'JP-TYO-003',
        Title: '東京很不錯飯店 Rating 3.5',
        ProductUrl: 'https://uhotel.liontravel.com/detail/JP-TYO-003',
        Price: 3600,
        ImgUrl: 'https://picsum.photos/seed/liontravel-cozy-hotel/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        SalePrice: 4000,
        Discount: 8,
        Location: {
          Name: '淺草站',
          Distance: 1.2,
          Unit: '公里',
        },
        Level: 3,
        Rating: 3.5,
        RatingCount: 42,
        Likeability: 82,
        CancelTag: '免費取消',
      },
      {
        ID: 'JP-TYO-004',
        Title: '東京低分飯店 Rating 3.4',
        ProductUrl: 'https://uhotel.liontravel.com/detail/JP-TYO-004',
        Price: 2900,
        ImgUrl: 'https://picsum.photos/seed/liontravel-budget-hotel/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        SalePrice: 3200,
        Discount: 6,
        Location: {
          Name: '池袋站',
          Distance: 1.5,
          Unit: '公里',
        },
        Level: 3,
        Rating: 3.4,
        RatingCount: 25,
        Likeability: 76,
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
    Type: '票券(玩樂)',
    CombineTagList: ['東京迪士尼', '淺草體驗', '晴空塔'],
    pList: [
      {
        ID: 'JP-TYO-TICKET-001',
        Title: '東京太讚了玩樂票券 Rating 4.5',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TICKET-001',
        Price: 1800,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-tokyo-ticket-excellent/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        Rating: 4.5,
        RatingCount: 168,
        Likeability: 91,
        CancelTag: '可免費取消',
      },
      {
        ID: 'JP-TYO-TICKET-002',
        Title: '東京非常好玩樂票券 Rating 4.0',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TICKET-002',
        Price: 1500,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-tokyo-ticket-great/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        Rating: 4,
        RatingCount: 76,
        Likeability: 88,
        CancelTag: '可免費取消',
      },
      {
        ID: 'JP-TYO-TICKET-003',
        Title: '東京很不錯玩樂票券 Rating 3.5',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TICKET-003',
        Price: 1200,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-tokyo-ticket-good/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        Rating: 3.5,
        RatingCount: 45,
        Likeability: 86,
        CancelTag: '可免費取消',
      },
      {
        ID: 'JP-TYO-TICKET-004',
        Title: '東京低分玩樂票券 Rating 3.4',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TICKET-004',
        Price: 900,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-tokyo-ticket-hidden/640/426',
        SaleCurr: 'TWD',
        CityName: ['東京'],
        Rating: 3.4,
        RatingCount: 18,
        Likeability: 72,
        CancelTag: '可免費取消',
      },
    ],
  },
  {
    Type: '票券(玩樂)-看更多(搜尋頁)',
    CombineTagList: ['東京迪士尼', '淺草體驗', '晴空塔'],
    pList: [
      {
        url: 'https://activity.liontravel.com/search?SearchKeyword=%E6%9D%B1%E4%BA%AC',
      },
    ],
  },
  {
    Type: '票券(交通)',
    pList: [
      {
        ID: 'JP-TYO-TRAFFIC-001',
        Title: '東京太讚了交通票券 Rating 4.5',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TRAFFIC-001',
        Price: 1400,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-traffic-ticket-excellent/640/426',
        SaleCurr: 'TWD',
        Rating: 4.5,
        RatingCount: 120,
      },
      {
        ID: 'JP-TYO-TRAFFIC-002',
        Title: '東京非常好交通票券 Rating 4.0',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TRAFFIC-002',
        Price: 1100,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-traffic-ticket-great/640/426',
        SaleCurr: 'TWD',
        Rating: 4,
        RatingCount: 62,
      },
      {
        ID: 'JP-TYO-TRAFFIC-003',
        Title: '東京很不錯交通票券 Rating 3.5',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TRAFFIC-003',
        Price: 950,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-traffic-ticket-good/640/426',
        SaleCurr: 'TWD',
        Rating: 3.5,
        RatingCount: 41,
      },
      {
        ID: 'JP-TYO-TRAFFIC-004',
        Title: '東京低分交通票券 Rating 3.4',
        ProductUrl: 'https://activity.liontravel.com/detail/JP-TYO-TRAFFIC-004',
        Price: 800,
        ImgUrl:
          'https://picsum.photos/seed/liontravel-traffic-ticket-hidden/640/426',
        SaleCurr: 'TWD',
        Rating: 3.4,
        RatingCount: 34,
      },
    ],
  },
  {
    Type: '票券(交通)-看更多(搜尋頁)',
    pList: [
      {
        url: 'https://activity.liontravel.com/search?searchkindname=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8',
      },
    ],
  },
]

const storybookAp56ProxyPathnames = {
  production: '/__liontravel-ap56-production-proxy',
  uat: '/__liontravel-ap56-uat-proxy',
}

export const successRequestClient = createMockRequestClient(
  async () => ap56CrossSellStoryResponse,
)

export const errorRequestClient = createMockRequestClient(async () => {
  throw new Error('Failed to load cross-sell widget data.')
})

export const loadingRequestClient = createMockRequestClient(
  () => new Promise(() => {}),
)

export function createStorybookProxyRequestClient(
  environment: LiontravelDomainMode | undefined,
): RequestClient {
  const proxyPathname =
    environment === 'uat'
      ? storybookAp56ProxyPathnames.uat
      : storybookAp56ProxyPathnames.production

  return {
    get: <T>(pathname: string, init?: RequestInit) =>
      proxyRequest<T>(proxyPathname, pathname, {
        ...init,
        method: 'GET',
      }),
    request: <T>(pathname: string, init?: RequestInit) =>
      proxyRequest<T>(proxyPathname, pathname, init),
  }
}

async function proxyRequest<T>(
  proxyPathname: string,
  pathname: string,
  init?: RequestInit,
) {
  const origin =
    typeof window === 'undefined'
      ? 'http://localhost:6006'
      : window.location.origin
  const response = await fetch(
    new URL(`${proxyPathname}${pathname}`, origin),
    init,
  )

  if (!response.ok) {
    throw new Error(
      `Storybook AP-56 proxy request failed: ${response.status} ${response.statusText}`,
    )
  }

  return (await response.json()) as T
}
