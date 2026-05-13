import '../../../src/widgets/flight-order-cross-sell/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import { FlightOrderCrossSellConnected } from '../../../src/widgets/flight-order-cross-sell'
import {
  createStorybookProxyRequestClient,
  errorRequestClient,
  loadingRequestClient,
  successRequestClient,
} from './fixtures'

type ConnectedStoryArgs = Omit<
  ComponentProps<typeof FlightOrderCrossSellConnected>,
  'requestClient'
> & {
  useMockResponse?: boolean
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
