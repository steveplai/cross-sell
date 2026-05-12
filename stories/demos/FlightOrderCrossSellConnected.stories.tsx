import '../../src/widgets/flight-order-cross-sell/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'

import type { RequestClient } from '../../src/shared/request'
import {
  FlightOrderCrossSellConnected,
  flightOrderCrossSellSampleData,
} from '../../src/widgets/flight-order-cross-sell'

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

const successRequestClient = createMockRequestClient(async () => ({
  data: flightOrderCrossSellSampleData,
}))

const errorRequestClient = createMockRequestClient(async () => {
  throw new Error('Failed to load flight order cross-sell data.')
})

const loadingRequestClient = createMockRequestClient(
  () => new Promise(() => {}),
)

const meta = {
  id: 'flight-order-cross-sell-connected',
  title: 'Demos/Flight Order Cross Sell/Connected',
  component: FlightOrderCrossSellConnected,
  args: {
    domainMode: 'uat',
    errorMode: 'message',
    orderNumber: '16575',
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
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FlightOrderCrossSellConnected>

export default meta

type Story = StoryObj<typeof meta>

export const StaticData: Story = {
  args: {
    data: flightOrderCrossSellSampleData,
  },
}

export const ApiSuccess: Story = {
  args: {
    requestClient: successRequestClient,
  },
}

export const ApiErrorHidden: Story = {
  args: {
    errorMode: 'hidden',
    requestClient: errorRequestClient,
  },
}

export const ApiErrorMessage: Story = {
  args: {
    errorMode: 'message',
    requestClient: errorRequestClient,
  },
}

export const Loading: Story = {
  args: {
    requestClient: loadingRequestClient,
  },
}
