import type { Meta, StoryObj } from '@storybook/react-vite'

import { CrossSellWidget } from '@/widgets/cross-sell-widget'
import { crossSellWidgetSampleData } from '@/widgets/cross-sell-widget/sampleData'

const meta = {
  title: 'Widgets/CrossSellWidget',
  component: CrossSellWidget,
  parameters: {
    layout: 'fullscreen',
  },
  args: crossSellWidgetSampleData,
} satisfies Meta<typeof CrossSellWidget>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutFeaturedAddon: Story = {
  args: {
    ...crossSellWidgetSampleData,
    featuredAddon: undefined,
  },
}

export const ExpiredPromo: Story = {
  args: {
    ...crossSellWidgetSampleData,
    promo: {
      ...crossSellWidgetSampleData.promo,
      startsAt: new Date(
        Date.now() - 60 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      durationSeconds: 60,
    },
  },
}
