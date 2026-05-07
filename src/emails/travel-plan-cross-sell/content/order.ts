import type { TravelPlanCrossSellEmailProps } from '../types'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

const orderCrossSellUtmQuery = {
  hotel:
    '?utm_source=orderconfirmation&utm_medium=email&utm_campaign=hotel-addon&utm_content=flight',
  localExperience:
    '?utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-addon&utm_content=flight',
  rail: '?utm_source=orderconfirmation&utm_medium=email&utm_campaign=thsrc-addon&utm_content=flight',
  visaPassport:
    '?utm_source=orderconfirmation&utm_medium=email&utm_campaign=visa-addon&utm_content=flight',
} as const

export function createOrderCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  const {
    arrowIconUrl,
    bedIconUrl,
    checkIconUrl,
    mountainIconUrl,
    passportIconUrl,
    searchIconUrl,
    trainIconUrl,
    transportIconUrl,
  } = assetUrls

  return {
    previewText: '旅遊計劃書與限時加購優惠',
    title: '旅遊計劃書',
    deadlineText: '加購優惠於2026/04/10 13:49 截止！',
    highlights: [
      {
        id: 'hotel-discount',
        label: '加購優惠',
        text: '訂房最高可省 25%',
        checkIconSrc: checkIconUrl,
      },
      {
        id: 'hotel-cancel',
        text: '航班異動可免費取消住宿',
        checkIconSrc: checkIconUrl,
      },
      {
        id: 'rail-discount',
        text: '加購高鐵享8折',
        checkIconSrc: checkIconUrl,
      },
    ],
    sections: [
      {
        id: 'transportation',
        title: '抵達啟程',
        description: '落地第一步，先搞定機場到市區交通',
        ctaLabel: '立即預訂交通票券',
        ctaUrl: 'https://example.com/order-cross-sell/transportation',
        ctaIconUrl: searchIconUrl,
        variant: 'featured',
        iconAlt: '交通',
        iconUrl: transportIconUrl,
        recommendationsTitle: '推薦熱門交通：',
        recommendations: [
          {
            text: '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
            url: 'https://example.com/order-cross-sell/transportation/airport-transfer',
            arrowIconUrl,
          },
          {
            text: '日本-東京地鐵乘車券 Tokyo Subway Ticket',
            url: 'https://example.com/order-cross-sell/transportation/tokyo-subway-ticket',
            arrowIconUrl,
          },
          {
            text: '日本-京成電鐵Skyliner特急券| 東京成田機場往返上野・日暮里...',
            url: 'https://example.com/order-cross-sell/transportation/keisei-skyliner',
            arrowIconUrl,
          },
        ],
      },
      {
        id: 'hotel',
        title: '飯店下榻',
        description: '熱門的優質住宿極易滿房，建議您優先卡位！',
        ctaLabel: '搜尋附近飯店',
        ctaUrl: `https://example.com/order-cross-sell/hotels${orderCrossSellUtmQuery.hotel}`,
        iconAlt: '訂房',
        iconUrl: bedIconUrl,
      },
      {
        id: 'local-experience',
        title: '在地探索',
        description: '行程沒頭緒？熱門票券與一日遊先卡位',
        ctaLabel: '探索遊玩體驗',
        ctaUrl: `https://example.com/order-cross-sell/experiences${orderCrossSellUtmQuery.localExperience}`,
        iconAlt: '當地遊',
        iconUrl: mountainIconUrl,
      },
      {
        id: 'rail',
        title: '高鐵加購',
        description: '結束完美旅程，預訂回程高鐵安心返家',
        ctaLabel: '查詢高鐵班次',
        ctaUrl: `https://example.com/order-cross-sell/rail${orderCrossSellUtmQuery.rail}`,
        iconAlt: '台灣高鐵',
        iconUrl: trainIconUrl,
      },
      {
        id: 'visa-passport',
        title: '簽證護照',
        description: '出發前最重要的事！確認效期與簽證早安心',
        ctaLabel: '申請簽證代辦',
        ctaUrl: `https://example.com/insurance-cross-sell/visa-passport${orderCrossSellUtmQuery.visaPassport}`,
        iconAlt: '簽證護照',
        iconUrl: passportIconUrl,
      },
    ],
  }
}

export const orderCrossSellEmailContent = createOrderCrossSellEmailContent()
