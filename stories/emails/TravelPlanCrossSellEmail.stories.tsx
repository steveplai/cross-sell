import type { Meta, StoryObj } from '@storybook/react-vite'

import { flightEstablishedCrossSellEmailContent } from '../../src/emails/travel-plan-cross-sell/content/established'
import { flightInsuranceCrossSellEmailContent } from '../../src/emails/travel-plan-cross-sell/content/insurance'
import { flightSalesCrossSellEmailContent } from '../../src/emails/travel-plan-cross-sell/content/sales'
import { EmailPreview } from './TravelPlanCrossSellEmailPreview'

const meta = {
  title: 'Emails/Cross Sell/Email/Flight',
  component: EmailPreview,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Established: Story = {
  args: {
    data: flightEstablishedCrossSellEmailContent,
  },
}

export const Sales: Story = {
  args: {
    data: flightSalesCrossSellEmailContent,
  },
}

export const Insurance: Story = {
  args: {
    data: flightInsuranceCrossSellEmailContent,
  },
}
