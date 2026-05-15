import type { CrossSellWidgetDefaultData } from './types'

const defaultPromoStartsAt = new Date().toISOString()
const defaultPromoDurationSeconds = 30 * 24 * 60 * 60

export const crossSellWidgetDefaultData: CrossSellWidgetDefaultData = {
  locale: 'zh-TW',
  currency: 'TWD',
  promo: {
    id: 'cross-sell-default-promo',
    activeTitle: '您已解鎖限時優惠！',
    expiredTitle: '發現更多精選推薦！',
    startsAt: defaultPromoStartsAt,
    durationSeconds: defaultPromoDurationSeconds,
    serviceLabel: '精選加購商品與服務推薦',
  },
}
