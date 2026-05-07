import type { TravelPlanCrossSellEmailProps } from '../types'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

const salesCrossSellUtmQuery = {
  visaPassport:
    '?utm_source=insurance&utm_medium=email&utm_campaign=visa-addon&utm_content=flight',
} as const

export function createSalesCrossSellEmailContent(
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
        ctaLabel: '預訂交通票券',
        ctaUrl: 'https://example.com/sales-cross-sell/transportation',
        iconAlt: '交通',
        iconUrl: transportIconUrl,
      },
      {
        id: 'hotel',
        title: '飯店下榻',
        description: '熱門的優質住宿極易滿房，建議您優先卡位！',
        ctaLabel: '立即搜尋飯店',
        ctaUrl: 'https://example.com/sales-cross-sell/hotels',
        ctaIconUrl: searchIconUrl,
        variant: 'featured',
        showHeaderDescriptionAndCta: true,
        iconAlt: '訂房',
        iconUrl: bedIconUrl,
        recommendationsTitle: '推薦熱門住宿：',
        recommendations: [
          {
            text: 'OMO5 東京大塚 by 星野集團',
            url: 'https://example.com/sales-cross-sell/hotels/omo5-tokyo-otsuka',
            arrowIconUrl,
          },
          {
            text: '淺草田原町站前APA飯店',
            url: 'https://example.com/sales-cross-sell/hotels/apa-asakusa-tawaramachi',
            arrowIconUrl,
          },
          {
            text: 'Super Hotel 淺草',
            url: 'https://example.com/sales-cross-sell/hotels/super-hotel-asakusa',
            arrowIconUrl,
          },
        ],
      },
      {
        id: 'local-experience',
        title: '在地探索',
        description: '行程沒頭緒？熱門票券與一日遊先卡位',
        ctaLabel: '探索遊玩體驗',
        ctaUrl: 'https://example.com/sales-cross-sell/experiences',
        iconAlt: '當地遊',
        iconUrl: mountainIconUrl,
      },
      {
        id: 'rail',
        title: '高鐵加購',
        description: '結束完美旅程，預訂回程高鐵安心返家',
        ctaLabel: '查詢高鐵班次',
        ctaUrl: 'https://example.com/sales-cross-sell/rail',
        iconAlt: '台灣高鐵',
        iconUrl: trainIconUrl,
      },
      {
        id: 'visa-passport',
        title: '簽證護照',
        description: '出發前最重要的事！確認效期與簽證早安心',
        ctaLabel: '申請簽證代辦',
        ctaUrl: `https://example.com/insurance-cross-sell/visa-passport${salesCrossSellUtmQuery.visaPassport}`,
        iconAlt: '簽證護照',
        iconUrl: passportIconUrl,
      },
    ],
  }
}

export const salesCrossSellEmailContent = createSalesCrossSellEmailContent()
