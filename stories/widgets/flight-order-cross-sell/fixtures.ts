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

const ap56CrossSellingStoryResponse = [
  {
    Type: '訂房',
    CombineTagList: ['東京 旅遊', '東京 鐵塔'],
    pList: [
      {
        ID: 'JP-TYO-001',
        Title: '東京灣精選飯店',
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

const storybookAp56ProxyPathnames = {
  production: '/__liontravel-ap56-production-proxy',
  uat: '/__liontravel-ap56-uat-proxy',
}

export const successRequestClient = createMockRequestClient(
  async () => ap56CrossSellingStoryResponse,
)

export const errorRequestClient = createMockRequestClient(async () => {
  throw new Error('Failed to load flight order cross-sell data.')
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
