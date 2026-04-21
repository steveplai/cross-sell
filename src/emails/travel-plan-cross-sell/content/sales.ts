import type { TravelPlanCrossSellEmailProps } from '../types'

const recommendationArrowIconUrl =
  'https://example.com/assets/icons/chevron-right.svg'

export const salesCrossSellEmailContent: TravelPlanCrossSellEmailProps = {
  previewText: '旅遊計劃書與限時加購優惠',
  title: '旅遊計劃書',
  deadlineText: '加購優惠於2026/04/10 13:49 截止！',
  highlights: [
    {
      id: 'hotel-discount',
      label: '加購優惠',
      text: '訂房最高可省 25%',
    },
    {
      id: 'hotel-cancel',
      text: '航班異動可免費取消住宿',
    },
    {
      id: 'rail-discount',
      text: '加購高鐵享8折',
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
      iconUrl: 'https://example.com/assets/icons/transportation.png',
    },
    {
      id: 'hotel',
      title: '飯店下榻',
      description: '熱門的優質住宿極易滿房，建議您優先卡位！',
      ctaLabel: '立即搜尋東京飯店',
      ctaUrl: 'https://example.com/sales-cross-sell/hotels',
      variant: 'featured',
      iconAlt: '訂房',
      iconUrl: 'https://example.com/assets/icons/hotel.png',
      recommendationsTitle: '推薦熱門住宿：',
      recommendations: [
        {
          text: 'OMO5 東京大塚 by 星野集團',
          url: 'https://example.com/sales-cross-sell/hotels/omo5-tokyo-otsuka',
          arrowIconUrl: recommendationArrowIconUrl,
        },
        {
          text: '淺草田原町站前APA飯店',
          url: 'https://example.com/sales-cross-sell/hotels/apa-asakusa-tawaramachi',
          arrowIconUrl: recommendationArrowIconUrl,
        },
        {
          text: 'Super Hotel 淺草',
          url: 'https://example.com/sales-cross-sell/hotels/super-hotel-asakusa',
          arrowIconUrl: recommendationArrowIconUrl,
        },
      ],
    },
    {
      id: 'local-experience',
      title: '在地探索',
      description: '行程沒頭緒？熱門票券與一日遊先卡位',
      ctaLabel: '探索東京體驗',
      ctaUrl: 'https://example.com/sales-cross-sell/experiences',
      iconAlt: '當地遊',
      iconUrl: 'https://example.com/assets/icons/local-experience.png',
    },
    {
      id: 'rail',
      title: '高鐵加購',
      description: '結束完美旅程，預訂回程高鐵安心返家',
      ctaLabel: '查詢高鐵班次',
      ctaUrl: 'https://example.com/sales-cross-sell/rail',
      iconAlt: '台灣高鐵',
      iconUrl: 'https://example.com/assets/icons/rail.png',
    },
  ],
}
