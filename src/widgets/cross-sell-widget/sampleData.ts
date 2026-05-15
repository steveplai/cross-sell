import type { CrossSellWidgetProps } from './types'

const activeStartsAt = new Date(
  Date.now() - 15 * 24 * 60 * 60 * 1000,
).toISOString()

const categorySearchBaseUrl = 'https://www.liontravel.com/search'
const sampleImageUrls = {
  airportTransfer:
    'https://picsum.photos/seed/cross-sell-airport-transfer/640/426',
  breakfast: 'https://picsum.photos/seed/cross-sell-breakfast/640/426',
  hotel: 'https://picsum.photos/seed/cross-sell-hotel/640/426',
  railPass: 'https://picsum.photos/seed/cross-sell-rail-pass/640/426',
  simCard: 'https://picsum.photos/seed/cross-sell-sim-card/640/426',
  themePark: 'https://picsum.photos/seed/cross-sell-theme-park/640/426',
}

function createCategorySearchUrl(keyword: string) {
  const searchParams = new URLSearchParams({ keyword })

  return `${categorySearchBaseUrl}?${searchParams.toString()}`
}

export const crossSellWidgetSampleData: CrossSellWidgetProps = {
  locale: 'zh-TW',
  currency: 'TWD',
  promo: {
    id: 'cross-sell-limited-offer',
    activeTitle: '您已解鎖限時優惠！',
    expiredTitle: '發現更多精選推薦！',
    startsAt: activeStartsAt,
    durationSeconds: 30 * 24 * 60 * 60,
    serviceLabel: '加購住宿、交通與票券享專屬折扣',
    benefits: [
      {
        id: 'addon-discount',
        tagLabel: '加購價',
        label: '最高可省 25%',
      },
      {
        id: 'flexible-cancel',
        label: '精選商品支援彈性取消',
      },
    ],
  },
  featuredAddon: {
    id: 'high-speed-rail',
    title: '加購交通 行程更順暢',
    description: '購買精選行程後，可搭配交通票券享更多優惠',
    ctaLabel: '前往加購',
    href: createCategorySearchUrl('交通票券'),
  },
  actionSection: {
    title: '別忘了加購一份安心與便利',
    subtitle: '出發前可以再確認這些服務',
    items: [
      {
        id: 'travel-insurance',
        icon: 'insurance',
        title: '旅遊綜合險',
        description: '為您的旅行提供更完整的保障。',
        href: createCategorySearchUrl('旅遊綜合險'),
      },
      {
        id: 'wifi-sim-card',
        icon: 'wifi',
        title: 'Wi-Fi / SIM 卡',
        description: '保持旅途中網路暢通，隨時分享美好回憶。',
        href: createCategorySearchUrl('日本 eSIM'),
      },
    ],
  },
  sections: [
    {
      id: 'featured-hotels',
      kind: 'hotel',
      title: '精選住宿推薦',
      subtitle: '依照目前行程推薦適合住宿',
      viewMoreLabel: '探索更多住宿',
      viewMoreHref: createCategorySearchUrl('東京飯店'),
      categories: [
        {
          id: 'tokyo-hotel',
          label: '東京飯店',
          href: createCategorySearchUrl('東京飯店'),
        },
        {
          id: 'family-hotel',
          label: '親子住宿',
          href: createCategorySearchUrl('親子住宿'),
        },
      ],
      items: [
        {
          id: 'tokyo-bay-hotel',
          title: '東京灣精選飯店',
          imageUrl: sampleImageUrls.hotel,
          location: '東京灣',
          badge: '熱銷 TOP1',
          rating: '4.6',
          ratingLabel: '很棒',
          reviewCount: 856,
          originalPrice: 12800,
          discountLabel: '折扣 20%',
          price: 9800,
          priceSuffix: '起',
          href: createCategorySearchUrl('東京灣精選飯店'),
        },
        {
          id: 'breakfast-plan',
          title: '含早餐舒適住宿方案',
          imageUrl: sampleImageUrls.breakfast,
          location: '市中心',
          badge: '加購推薦',
          rating: '4.4',
          ratingLabel: '太讚了',
          reviewCount: 420,
          originalPrice: 9800,
          discountLabel: '折扣 15%',
          price: 8200,
          priceSuffix: '起',
          href: createCategorySearchUrl('含早餐住宿'),
        },
      ],
    },
    {
      id: 'local-transport',
      kind: 'transport',
      title: '當地交通 一次搞定',
      viewMoreLabel: '探索更多交通',
      viewMoreHref: createCategorySearchUrl('當地交通'),
      items: [
        {
          id: 'airport-transfer',
          title: '機場至市區接送服務',
          imageUrl: sampleImageUrls.airportTransfer,
          location: '機場接送',
          rating: '4.7',
          ratingLabel: '好評推薦',
          reviewCount: 1132,
          interestLabel: '200K+ 人有興趣',
          originalPrice: 3600,
          discountLabel: '折扣 10%',
          price: 3200,
          priceSuffix: '起',
          href: createCategorySearchUrl('機場接送'),
        },
        {
          id: 'rail-pass',
          title: '城市周遊交通票券',
          imageUrl: sampleImageUrls.railPass,
          location: '交通票券',
          rating: '4.5',
          ratingLabel: '很方便',
          reviewCount: 642,
          originalPrice: 2100,
          discountLabel: '折扣 12%',
          price: 1850,
          priceSuffix: '起',
          href: createCategorySearchUrl('周遊券'),
        },
      ],
    },
    {
      id: 'tickets-and-services',
      kind: 'ticket',
      title: '票券與便利服務',
      subtitle: '讓旅程更完整',
      viewMoreLabel: '探索更多服務',
      viewMoreHref: createCategorySearchUrl('票券 服務'),
      items: [
        {
          id: 'theme-park-ticket',
          title: '熱門主題樂園門票',
          imageUrl: sampleImageUrls.themePark,
          location: '熱門票券',
          badge: '人氣商品',
          rating: '4.8',
          ratingLabel: '太讚了',
          reviewCount: 2048,
          interestLabel: '500K+ 人有興趣',
          originalPrice: 2900,
          discountLabel: '折扣 8%',
          price: 2650,
          priceSuffix: '起',
          href: createCategorySearchUrl('主題樂園門票'),
        },
        {
          id: 'sim-card',
          title: '海外上網 SIM / eSIM',
          imageUrl: sampleImageUrls.simCard,
          location: '上網服務',
          rating: '4.5',
          ratingLabel: '穩定方便',
          reviewCount: 968,
          originalPrice: 899,
          discountLabel: '折扣 18%',
          price: 699,
          priceSuffix: '起',
          href: createCategorySearchUrl('eSIM'),
        },
      ],
    },
  ],
}
