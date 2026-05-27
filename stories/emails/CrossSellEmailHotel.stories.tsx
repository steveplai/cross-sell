import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  hotelEstablishedCrossSellEmailContent,
  hotelSalesCrossSellEmailContent,
} from '../../src/emails/cross-sell-email/content/index'
import { EmailPreview } from './CrossSellEmailPreview'

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

export const Sales: Story = {
  args: {
    data: hotelSalesCrossSellEmailContent,
  },
}
