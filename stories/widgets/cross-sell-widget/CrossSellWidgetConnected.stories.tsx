import '../../../src/widgets/cross-sell-widget/style.css'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentProps } from 'react'

import {
  CrossSellWidgetConnected,
  CrossSellWidgetConnectedForTesting,
} from '../../../src/widgets/cross-sell-widget/CrossSellWidgetConnected'
import {
  createStorybookProxyRequestClient,
  errorRequestClient,
  loadingRequestClient,
  successRequestClient,
} from './fixtures'

type ConnectedStoryArgs = ComponentProps<typeof CrossSellWidgetConnected> & {
  useMockResponse?: boolean
}

function createActivePromoStartsAt() {
  return new Date(Date.now() - 10 * 60 * 1000).toISOString()
}

const meta = {
  id: 'cross-sell-widget-connected',
  title: 'Widgets/Cross Sell Widget/Connected',
  component: CrossSellWidgetConnected,
  args: {
    environment: 'uat',
    errorMode: 'message',
    currency: 'TWD',
    locale: 'zh-TW',
    orderNumber: '2026-123456',
    orderDestination: '東京',
    promoStartsAt: createActivePromoStartsAt(),
    promoDurationSeconds: 30 * 24 * 60 * 60,
    recommendProductTypes: 'htl,etk',
    sourceProduct: 'flight',
    travelInsuranceContactEmail: 'customer-service@liontravel.com',
  },
  argTypes: {
    environment: {
      control: 'inline-radio',
      options: ['uat', 'production'],
    },
    errorMode: {
      control: 'inline-radio',
      options: ['hidden', 'message'],
    },
    locale: {
      control: 'text',
    },
    currency: {
      control: 'text',
    },
    orderNumber: {
      control: 'text',
    },
    orderDestination: {
      control: 'text',
    },
    travelInsuranceContactEmail: {
      control: 'text',
    },
    recommendProductTypes: {
      control: 'text',
    },
    sourceProduct: {
      control: 'inline-radio',
      options: ['flight', 'hotel', 'ticket'],
    },
    visibleBlocks: {
      control: 'object',
    },
    useMockResponse: {
      control: 'boolean',
    },
    promoDurationSeconds: {
      control: 'number',
    },
    promoStartsAt: {
      control: 'text',
      description: [
        'ISO 8601 datetime with an explicit timezone,',
        'for example 2026-05-14T00:00:00.000Z or 2026-05-14T08:00:00+08:00.',
      ].join(' '),
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
  render: ({ useMockResponse, ...args }) => (
    <CrossSellWidgetConnectedForTesting
      {...args}
      requestClient={
        useMockResponse
          ? successRequestClient
          : createStorybookProxyRequestClient(args.environment)
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
          'Turn useMockResponse on to inspect local AP-56 mock data, or off to call the selected AP-56 origin through the Storybook dev proxy.',
      },
    },
  },
}

export const ContentOverrides: Story = {
  args: {
    useMockResponse: true,
    orderDestination: '上海',
    promo: {
      activeTitle: 'Connected Storybook 限時優惠',
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
  },
}

export const ApiErrorHidden: Story = {
  args: {
    errorMode: 'hidden',
  },
  render: ({ useMockResponse: _useMockResponse, ...args }) => (
    <CrossSellWidgetConnectedForTesting
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
    <CrossSellWidgetConnectedForTesting
      {...args}
      requestClient={errorRequestClient}
    />
  ),
}

export const Loading: Story = {
  render: ({ useMockResponse: _useMockResponse, ...args }) => (
    <CrossSellWidgetConnectedForTesting
      {...args}
      requestClient={loadingRequestClient}
    />
  ),
}
