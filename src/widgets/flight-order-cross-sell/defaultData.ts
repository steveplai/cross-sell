import type { FlightOrderCrossSellDefaultData } from './types'

const activeStartsAt = new Date(
  Date.now() - 15 * 24 * 60 * 60 * 1000,
).toISOString()

export const flightOrderCrossSellDefaultData: FlightOrderCrossSellDefaultData =
  {
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
      startsAt: activeStartsAt,
      durationSeconds: 30 * 24 * 60 * 60,
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
      description: '購買國內外行程，最高享 8 折優惠',
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
