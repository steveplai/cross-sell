import '../src/widgets/themed-cross-sell-banner/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ThemedCrossSellBanner } from '../src/widgets/themed-cross-sell-banner'

const meta = {
  id: 'themed-crosssellbanner',
  title: 'CrossSell Banner/Themed',
  component: ThemedCrossSellBanner,
  args: {
    title: '推薦商品',
    locale: 'zh-TW',
    layout: 'grid',
    products: [
      { id: 'p1', name: '商品 A', price: 1200 },
      { id: 'p2', name: '商品 B', price: 900 },
    ],
  },
  argTypes: {
    layout: {
      control: 'inline-radio',
      options: ['compact', 'grid', 'carousel'],
    },
  },
} satisfies Meta<typeof ThemedCrossSellBanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Compact: Story = {
  args: {
    layout: 'compact',
  },
}

export const Carousel: Story = {
  args: {
    layout: 'carousel',
  },
}

export const Empty: Story = {
  args: {
    products: [],
  },
}

export const Loading: Story = {
  args: {
    loading: true,
    products: [],
  },
}

export const Dark: Story = {
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
}
