import type { TravelPlanCrossSellEmailProps } from '../types'

export const insuranceCrossSellSampleData: TravelPlanCrossSellEmailProps = {
  previewText: '旅遊計劃書與簽證護照提醒',
  title: '旅遊計劃書',
  sections: [
    {
      id: 'transportation',
      title: '抵達啟程',
      description: '落地第一步，先搞定機場到市區交通',
      ctaLabel: '預訂交通票券',
      ctaUrl: 'https://example.com/insurance-cross-sell/transportation',
      iconAlt: '交通',
      iconUrl: 'https://example.com/assets/icons/transportation.png',
    },
    {
      id: 'hotel',
      title: '飯店下榻',
      description: '熱門的優質住宿極易滿房，建議您優先卡位！',
      ctaLabel: '搜尋東京飯店',
      ctaUrl: 'https://example.com/insurance-cross-sell/hotels',
      iconAlt: '訂房',
      iconUrl: 'https://example.com/assets/icons/hotel.png',
    },
    {
      id: 'local-experience',
      title: '在地探索',
      description: '行程沒頭緒？熱門票券與一日遊先卡位',
      ctaLabel: '探索東京體驗',
      ctaUrl: 'https://example.com/insurance-cross-sell/experiences',
      iconAlt: '當地遊',
      iconUrl: 'https://example.com/assets/icons/local-experience.png',
    },
    {
      id: 'rail',
      title: '高鐵加購',
      description: '結束完美旅程，預訂回程高鐵安心返家',
      ctaLabel: '查詢高鐵班次',
      ctaUrl: 'https://example.com/insurance-cross-sell/rail',
      iconAlt: '台灣高鐵',
      iconUrl: 'https://example.com/assets/icons/rail.png',
    },
    {
      id: 'visa-passport',
      title: '簽證護照',
      description: '出發前最重要的事！確認效期與簽證早安心',
      ctaLabel: '申請簽證代辦',
      ctaUrl: 'https://example.com/insurance-cross-sell/visa-passport',
      iconAlt: '簽證護照',
      iconUrl: 'https://example.com/assets/icons/visa-passport.png',
      variant: 'emphasis',
    },
  ],
}
