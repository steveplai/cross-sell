import '../../src/widgets/flight-order-cross-sell/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  FlightOrderCrossSell,
  flightOrderCrossSellSampleData,
} from '../../src/widgets/flight-order-cross-sell'

const activeData = {
  ...flightOrderCrossSellSampleData,
  promo: {
    ...flightOrderCrossSellSampleData.promo,
    startsAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    durationSeconds: 40 * 60 * 60,
  },
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
  title: 'Demos/Flight Order Cross Sell',
  component: FlightOrderCrossSell,
  args: {
    data: activeData,
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
    data: expiredData,
  },
}

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-93.75">
        <Story />
      </div>
    ),
  ],
}
