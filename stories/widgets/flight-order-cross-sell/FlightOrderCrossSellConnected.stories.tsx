import '../../../src/widgets/flight-order-cross-sell/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import type { RequestClient } from '../../../src/shared/request'
import {
  FlightOrderCrossSellConnected,
  flightOrderCrossSellSampleData,
} from '../../../src/widgets/flight-order-cross-sell'

type ConnectedStoryArgs = Omit<
  ComponentProps<typeof FlightOrderCrossSellConnected>,
  'requestClient'
> & {
  useMockResponse?: boolean
}

type MockRequestHandler = (
  pathname: string,
  init?: RequestInit,
) => Promise<unknown>

function createMockRequestClient(handler: MockRequestHandler): RequestClient {
  return {
    get: <T,>(pathname: string, init?: RequestInit) =>
      handler(pathname, init) as Promise<T>,
    request: <T,>(pathname: string, init?: RequestInit) =>
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

const successRequestClient = createMockRequestClient(
  async () => ap56CrossSellingStoryResponse,
)

const errorRequestClient = createMockRequestClient(async () => {
  throw new Error('Failed to load flight order cross-sell data.')
})

const loadingRequestClient = createMockRequestClient(
  () => new Promise(() => {}),
)

const storybookAp56ProxyPathnames = {
  production: '/__liontravel-ap56-production-proxy',
  uat: '/__liontravel-ap56-uat-proxy',
}

function createStorybookProxyRequestClient(
  domainMode: ConnectedStoryArgs['domainMode'],
): RequestClient {
  const proxyPathname =
    domainMode === 'uat'
      ? storybookAp56ProxyPathnames.uat
      : storybookAp56ProxyPathnames.production

  return {
    get: <T,>(pathname: string, init?: RequestInit) =>
      proxyRequest<T>(proxyPathname, pathname, {
        ...init,
        method: 'GET',
      }),
    request: <T,>(pathname: string, init?: RequestInit) =>
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

const meta = {
  id: 'flight-order-cross-sell-connected',
  title: 'Widgets/Flight Order Cross Sell/Connected',
  component: FlightOrderCrossSellConnected,
  args: {
    domainMode: 'uat',
    errorMode: 'message',
    orderNumber: '2026-123456',
    recommendProductTypes: 'htl,etk',
  },
  argTypes: {
    domainMode: {
      control: 'inline-radio',
      options: ['uat', 'production'],
    },
    errorMode: {
      control: 'inline-radio',
      options: ['hidden', 'message'],
    },
    recommendProductTypes: {
      control: 'text',
    },
    useMockResponse: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  render: ({ useMockResponse, ...args }) => (
    <FlightOrderCrossSellConnected
      {...args}
      requestClient={
        useMockResponse
          ? successRequestClient
          : createStorybookProxyRequestClient(args.domainMode)
      }
    />
  ),
} satisfies Meta<ConnectedStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const StaticData: Story = {
  args: {
    data: flightOrderCrossSellSampleData,
  },
}

export const ApiSuccess: Story = {
  args: {
    orderNumber: '2026-17631',
    useMockResponse: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Toggle useMockResponse off to call the selected AP-56 domain through the Storybook dev proxy.',
      },
    },
  },
}

export const ApiErrorHidden: Story = {
  args: {
    errorMode: 'hidden',
  },
  render: ({ useMockResponse: _useMockResponse, ...args }) => (
    <FlightOrderCrossSellConnected
      {...args}
      requestClient={errorRequestClient}
    />
  ),
}

export const ApiErrorMessage: Story = {
  args: {
    errorMode: 'message',
  },
  render: ({ useMockResponse: _useMockResponse, ...args }) => (
    <FlightOrderCrossSellConnected
      {...args}
      requestClient={errorRequestClient}
    />
  ),
}

export const Loading: Story = {
  render: ({ useMockResponse: _useMockResponse, ...args }) => (
    <FlightOrderCrossSellConnected
      {...args}
      requestClient={loadingRequestClient}
    />
  ),
}
