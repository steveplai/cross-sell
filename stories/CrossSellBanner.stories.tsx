import type { Meta, StoryObj } from '@storybook/react-vite'
import { CrossSellBanner } from '../src/widgets/cross-sell-banner'

const meta = {
  component: CrossSellBanner,
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
} satisfies Meta<typeof CrossSellBanner>

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
