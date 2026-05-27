import type { Meta, StoryObj } from '@storybook/react-vite'

import { hotelEstablishedCrossSellEmailContent } from '../../src/emails/travel-plan-cross-sell/content/index'
import { EmailPreview } from './TravelPlanCrossSellEmailPreview'

const meta = {
  title: 'Emails/Cross Sell/Email/Hotel',
  component: EmailPreview,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Established: Story = {
  args: {
    data: hotelEstablishedCrossSellEmailContent,
  },
}
