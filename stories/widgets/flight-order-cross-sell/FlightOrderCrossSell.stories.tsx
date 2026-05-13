import '../../../src/widgets/flight-order-cross-sell/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  FlightOrderCrossSell,
  flightOrderCrossSellSampleData,
} from '../../../src/widgets/flight-order-cross-sell'

const activeData = {
  ...flightOrderCrossSellSampleData,
}

const expiredData = {
  ...flightOrderCrossSellSampleData,
  promo: {
    ...flightOrderCrossSellSampleData.promo,
    startsAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    durationSeconds: 60 * 60,
  },
}

const meta = {
  id: 'flight-order-cross-sell',
  title: 'Widgets/Flight Order Cross Sell/Base',
  component: FlightOrderCrossSell,
  args: {
    ...activeData,
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FlightOrderCrossSell>

export default meta

type Story = StoryObj<typeof meta>

export const ActiveOffer: Story = {}

export const ExpiredOffer: Story = {
  args: {
    ...expiredData,
  },
}
