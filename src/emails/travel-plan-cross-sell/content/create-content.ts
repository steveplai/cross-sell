import type {
  TravelPlanCrossSellEmailProps,
  TravelPlanCrossSellSection,
  TravelPlanCrossSellSectionVariant,
} from '../types'
import {
  createTravelPlanCrossSellHighlights,
  type TravelPlanCrossSellHighlightKey,
} from './highlight-catalog'
import {
  createTravelPlanCrossSellUrl,
  type TravelPlanCrossSellLinkProfileKey,
} from './link-profiles'
import {
  createTravelPlanCrossSellRecommendations,
  type TravelPlanCrossSellRecommendationSetKey,
} from './recommendation-catalog'
import {
  createTravelPlanCrossSellSection,
  type TravelPlanCrossSellSectionKey,
} from './section-catalog'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

export type TravelPlanCrossSellLifecycle = 'established' | 'insurance' | 'sales'

export type TravelPlanCrossSellSourceProduct = 'flight' | 'hotel'

export interface CreateTravelPlanCrossSellEmailContentOptions {
  assetUrls?: TravelPlanCrossSellAssetUrls
  lifecycle: TravelPlanCrossSellLifecycle
  sourceProduct: TravelPlanCrossSellSourceProduct
}

interface TravelPlanCrossSellPlan {
  deadlineText?: string
  highlights?: TravelPlanCrossSellHighlightKey[]
  linkProfileKey: TravelPlanCrossSellLinkProfileKey
  previewText: string
  sections: TravelPlanCrossSellSectionPlan[]
  title: string
}

interface TravelPlanCrossSellSectionPlan {
  ctaIcon?: 'search'
  ctaLabel?: string
  description?: string
  key: TravelPlanCrossSellSectionKey
  recommendations?: TravelPlanCrossSellRecommendationSetKey
  recommendationsTitle?: string
  showHeaderDescriptionAndCta?: boolean
  variant?: TravelPlanCrossSellSectionVariant
}

const establishedDeadlineText = '加購優惠於2026/04/10 13:49 截止！'
const offerPreviewText = '旅遊計劃書與限時加購優惠'
const title = '旅遊計劃書'

const plans: Partial<
  Record<
    TravelPlanCrossSellLifecycle,
    Partial<Record<TravelPlanCrossSellSourceProduct, TravelPlanCrossSellPlan>>
  >
> = {
  insurance: {
    flight: {
      linkProfileKey: 'flightInsurance',
      previewText: '旅遊計劃書與簽證護照提醒',
      sections: [
        { key: 'transportation' },
        { key: 'hotel' },
        { key: 'localExperience' },
        { key: 'rail' },
        { key: 'visaPassport', variant: 'emphasis' },
      ],
      title,
    },
  },
  established: {
    flight: {
      deadlineText: establishedDeadlineText,
      highlights: ['hotelDiscount', 'flightHotelFreeCancel', 'railDiscount'],
      linkProfileKey: 'flightEstablished',
      previewText: offerPreviewText,
      sections: [
        {
          ctaIcon: 'search',
          ctaLabel: '立即預訂交通票券',
          key: 'transportation',
          recommendations: 'tokyoTransportation',
          recommendationsTitle: '推薦熱門交通：',
          variant: 'featured',
        },
        { key: 'hotel' },
        { key: 'localExperience' },
        { key: 'rail' },
        { key: 'visaPassport' },
      ],
      title,
    },
    hotel: {
      deadlineText: establishedDeadlineText,
      highlights: ['hotelDiscount', 'railDiscount'],
      linkProfileKey: 'hotelEstablished',
      previewText: offerPreviewText,
      sections: [
        {
          ctaIcon: 'search',
          ctaLabel: '立即預訂交通票券',
          description: '抵達後先搞定交通，行程更順暢',
          key: 'transportation',
          recommendations: 'tokyoTransportation',
          recommendationsTitle: '推薦熱門交通：',
          variant: 'featured',
        },
        { key: 'localExperience' },
        { key: 'rail' },
      ],
      title,
    },
  },
  sales: {
    flight: {
      deadlineText: establishedDeadlineText,
      highlights: ['hotelDiscount', 'flightHotelFreeCancel', 'railDiscount'],
      linkProfileKey: 'flightSales',
      previewText: offerPreviewText,
      sections: [
        { key: 'transportation' },
        {
          ctaIcon: 'search',
          ctaLabel: '立即搜尋飯店',
          key: 'hotel',
          recommendations: 'tokyoHotels',
          recommendationsTitle: '推薦熱門住宿：',
          showHeaderDescriptionAndCta: true,
          variant: 'featured',
        },
        { key: 'localExperience' },
        { key: 'rail' },
        { key: 'visaPassport' },
      ],
      title,
    },
  },
}

export function createTravelPlanCrossSellEmailContent({
  assetUrls = defaultTravelPlanCrossSellAssetUrls,
  lifecycle,
  sourceProduct,
}: CreateTravelPlanCrossSellEmailContentOptions): TravelPlanCrossSellEmailProps {
  const plan = plans[lifecycle]?.[sourceProduct]

  if (!plan) {
    throw new Error(
      `Unsupported travel plan cross-sell content: ${lifecycle} ${sourceProduct}.`,
    )
  }

  return {
    deadlineText: plan.deadlineText,
    highlights: plan.highlights
      ? createTravelPlanCrossSellHighlights(plan.highlights, assetUrls)
      : undefined,
    previewText: plan.previewText,
    sections: plan.sections.map((section) =>
      createSection(section, plan.linkProfileKey, assetUrls),
    ),
    title: plan.title,
  }
}

function createSection(
  sectionPlan: TravelPlanCrossSellSectionPlan,
  linkProfileKey: TravelPlanCrossSellLinkProfileKey,
  assetUrls: TravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellSection {
  const recommendations = sectionPlan.recommendations
    ? createTravelPlanCrossSellRecommendations(sectionPlan.recommendations, {
        assetUrls,
        linkProfileKey,
      })
    : undefined

  const section = createTravelPlanCrossSellSection(sectionPlan.key, {
    assetUrls,
    ctaIconUrl:
      sectionPlan.ctaIcon === 'search' ? assetUrls.searchIconUrl : undefined,
    ctaUrl: createTravelPlanCrossSellUrl(linkProfileKey, sectionPlan.key),
    description: sectionPlan.description,
    recommendations,
    recommendationsTitle: sectionPlan.recommendationsTitle,
    showHeaderDescriptionAndCta: sectionPlan.showHeaderDescriptionAndCta,
    variant: sectionPlan.variant,
  })

  return sectionPlan.ctaLabel
    ? { ...section, ctaLabel: sectionPlan.ctaLabel }
    : section
}
