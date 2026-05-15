import '../../../src/widgets/flight-order-cross-sell/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import {
  FlightOrderCrossSell,
  flightOrderCrossSellSampleData as sampleData,
} from '../../../src/widgets/flight-order-cross-sell'

type BaseStoryArgs = ComponentProps<typeof FlightOrderCrossSell>

const activeData: BaseStoryArgs = {
  domainMode: sampleData.domainMode,
  locale: sampleData.locale,
  currency: sampleData.currency,
  order: sampleData.order,
  orderDestination: sampleData.orderDestination,
  serviceAgent: sampleData.serviceAgent,
  sections: sampleData.sections,
  promo: sampleData.promo,
  sectionContentOverrides:
    sampleData.sectionContentOverrides,
  hsrAddon: sampleData.hsrAddon,
  reminders: sampleData.reminders,
}

const expiredData = {
  ...activeData,
  promo: {
    ...sampleData.promo,
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
  argTypes: {
    domainMode: {
      control: 'inline-radio',
      options: ['uat', 'production'],
    },
    locale: {
      control: 'text',
    },
    currency: {
      control: 'text',
    },
    order: {
      control: 'object',
    },
    orderDestination: {
      control: 'text',
    },
    serviceAgent: {
      control: 'object',
    },
    sections: {
      control: 'object',
    },
    promo: {
      control: 'object',
    },
    sectionContentOverrides: {
      control: 'object',
    },
    hsrAddon: {
      control: 'object',
    },
    reminders: {
      control: 'object',
    },
    onSelectAddon: {
      table: { disable: true },
    },
    onSelectItem: {
      table: { disable: true },
    },
    onViewMore: {
      table: { disable: true },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      sort: 'none',
    },
  },
} satisfies Meta<BaseStoryArgs>

export default meta

type Story = StoryObj<typeof meta>

export const ActiveOffer: Story = {}

export const ExpiredOffer: Story = {
  args: {
    ...expiredData,
  },
}

export const ContentOverrides: Story = {
  args: {
    orderDestination: '上海',
    promo: {
      activeTitle: 'Base Storybook 限時優惠',
      expiredTitle: '發現更多旅遊靈感！',
      serviceLabel: '加訂住宿、高鐵與票券享專屬折扣',
      benefits: [
        {
          id: 'addon-discount',
          tagLabel: '加購價',
          label: '最高可省 25%',
        },
        {
          id: 'flight-change-cancel',
          label: '航班異動可免費取消',
        },
      ],
    },
    sectionContentOverrides: {
      attraction: {
        title: '精選票券與當地體驗',
      },
    },
    hsrAddon: {
      id: 'hsr',
      title: '加購高鐵 行程更順暢',
      description: '購買國內外行程，最高享 8 折優惠',
      ctaLabel: '立即加購',
    },
    reminders: {
      title: '別忘了加購一份安心與便利',
      subtitle: '即將出門？',
      items: [
        {
          id: 'visa-passport',
          icon: 'passport',
          title: '簽證護照',
          description:
            '受理代辦中華民國護照、台胞證、各國簽證、國際學生證辦理等。',
        },
        {
          id: 'travel-insurance',
          icon: 'insurance',
          title: '旅遊綜合險',
          description: '於出發前七個工作天聯繫業務專員，提供旅行保障。',
        },
      ],
    },
    serviceAgent: {
      email: 'customer-service@liontravel.com',
    },
  },
}
