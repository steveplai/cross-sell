import type {
  CrossSellWidgetDefaultData,
  CrossSellWidgetSectionContentOverrides,
  CrossSellWidgetSectionContentOverridesByKind,
} from './types'

const defaultPromoStartsAt = new Date().toISOString()
const defaultPromoDurationSeconds = 30 * 24 * 60 * 60
export const defaultCrossSellWidgetOrderDestination = '地區'

export const crossSellWidgetDefaultData: CrossSellWidgetDefaultData = {
  locale: 'zh-TW',
  currency: 'TWD',
  domainMode: 'uat',
  serviceAgent: {
    email: 'customer-service@liontravel.com',
  },
  promo: {
    id: 'limited-offer',
    activeTitle: '您已解鎖限時優惠！',
    expiredTitle: '發現更多旅遊靈感！',
    startsAt: defaultPromoStartsAt,
    durationSeconds: defaultPromoDurationSeconds,
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
  hsrAddon: {
    id: 'hsr',
    title: '加購高鐵 行程更順暢',
    description: '購買國內外行程，最高享 8 折 優惠',
    ctaLabel: '前往加購',
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
          '受理代辦中華民國護照、台胞證、各國簽證、國際學生證辦理等，雄獅帶你輕鬆玩遍全球。',
      },
      {
        id: 'travel-insurance',
        icon: 'insurance',
        title: '旅遊綜合險',
        description:
          '於出發前七個工作天聯繫業務專員，為您的旅行提供全方位的保障！',
      },
    ],
  },
}

export function normalizeCrossSellWidgetOrderDestination(
  orderDestination?: string,
) {
  return (
    (orderDestination?.trim() ?? defaultCrossSellWidgetOrderDestination) ||
    defaultCrossSellWidgetOrderDestination
  )
}

export function createCrossSellWidgetSectionContentDefaults(
  orderDestination?: string,
): CrossSellWidgetSectionContentOverridesByKind {
  const destination = normalizeCrossSellWidgetOrderDestination(orderDestination)
  const defaultContent: Pick<
    CrossSellWidgetSectionContentOverrides,
    'viewMoreLabel'
  > = {
    viewMoreLabel: '探索更多',
  }

  return {
    hotel: {
      ...defaultContent,
      title: `探索${destination}飯店`,
      viewMorePlaceholderLabel: '更多精選飯店',
    },
    attraction: {
      ...defaultContent,
      title: `探索${destination} 景點不錯過`,
      viewMorePlaceholderLabel: '更多精選景點',
    },
    transport: {
      ...defaultContent,
      title: '當地交通 一次搞定',
      viewMorePlaceholderLabel: '更多交通選擇',
    },
    flight: {
      ...defaultContent,
      title: `探索${destination}機票`,
      viewMorePlaceholderLabel: '更多精選機票',
    },
  }
}
