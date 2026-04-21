import type { TravelPlanCrossSellEmailProps } from '../types'

const transportIconSrcUrl =
  'https://uwww.liontravel.com/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons/transportIcon.png'
const bedIconSrcUrl =
  'https://uwww.liontravel.com/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons/bedIcon.png'
const mountainIconSrcUrl =
  'https://uwww.liontravel.com/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons/mountainIcon.png'
const trainIconSrcUrl =
  'https://uwww.liontravel.com/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons/trainIcon.png'
const checkIconSrcUrl =
  'https://uwww.liontravel.com/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons/checkIcon.png'
const recommendationArrowIconUrl =
  'https://uwww.liontravel.com/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons/arrowIcon.png'

export const orderCrossSellEmailContent: TravelPlanCrossSellEmailProps = {
  previewText: '旅遊計劃書與限時加購優惠',
  title: '旅遊計劃書',
  deadlineText: '加購優惠於2026/04/10 13:49 截止！',
  highlights: [
    {
      id: 'hotel-discount',
      label: '加購優惠',
      text: '訂房最高可省 25%',
      checkIconSrc: checkIconSrcUrl,
    },
    {
      id: 'hotel-cancel',
      text: '航班異動可免費取消住宿',
      checkIconSrc: checkIconSrcUrl,
    },
    {
      id: 'rail-discount',
      text: '加購高鐵享8折',
      checkIconSrc: checkIconSrcUrl,
    },
  ],
  sections: [
    {
      id: 'transportation',
      title: '抵達啟程',
      description: '落地第一步，先搞定機場到市區交通',
      ctaLabel: '立即預訂交通票券',
      ctaUrl: 'https://example.com/order-cross-sell/transportation',
      variant: 'featured',
      iconAlt: '交通',
      iconUrl: transportIconSrcUrl,
      recommendationsTitle: '推薦熱門交通：',
      recommendations: [
        {
          text: '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
          url: 'https://example.com/order-cross-sell/transportation/airport-transfer',
          arrowIconUrl: recommendationArrowIconUrl,
        },
        {
          text: '日本-東京地鐵乘車券 Tokyo Subway Ticket',
          url: 'https://example.com/order-cross-sell/transportation/tokyo-subway-ticket',
          arrowIconUrl: recommendationArrowIconUrl,
        },
        {
          text: '日本-京成電鐵Skyliner特急券| 東京成田機場往返上野・日暮里...',
          url: 'https://example.com/order-cross-sell/transportation/keisei-skyliner',
          arrowIconUrl: recommendationArrowIconUrl,
        },
      ],
    },
    {
      id: 'hotel',
      title: '飯店下榻',
      description: '熱門的優質住宿極易滿房，建議您優先卡位！',
      ctaLabel: '搜尋東京飯店',
      ctaUrl: 'https://example.com/order-cross-sell/hotels',
      iconAlt: '訂房',
      iconUrl: bedIconSrcUrl,
    },
    {
      id: 'local-experience',
      title: '在地探索',
      description: '行程沒頭緒？熱門票券與一日遊先卡位',
      ctaLabel: '探索東京體驗',
      ctaUrl: 'https://example.com/order-cross-sell/experiences',
      iconAlt: '當地遊',
      iconUrl: mountainIconSrcUrl,
    },
    {
      id: 'rail',
      title: '高鐵加購',
      description: '結束完美旅程，預訂回程高鐵安心返家',
      ctaLabel: '查詢高鐵班次',
      ctaUrl: 'https://example.com/order-cross-sell/rail',
      iconAlt: '台灣高鐵',
      iconUrl: trainIconSrcUrl,
    },
  ],
}
