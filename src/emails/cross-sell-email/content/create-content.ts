import type {
  CrossSellEmailProps,
  CrossSellEmailSection,
  CrossSellEmailSectionVariant,
} from '../types'
import {
  createCrossSellEmailHighlights,
  type CrossSellEmailHighlightKey,
} from './catalogs/highlights'
import {
  createCrossSellEmailUrl,
  type CrossSellEmailLinkProfileKey,
} from './catalogs/links'
import {
  createCrossSellEmailRecommendations,
  type CrossSellEmailRecommendationSetKey,
} from './catalogs/recommendations'
import {
  createCrossSellEmailSection,
  type CrossSellEmailSectionKey,
} from './catalogs/sections'
import {
  type CrossSellEmailAssetUrls,
  defaultCrossSellEmailAssetUrls,
} from './shared-assets'

export type CrossSellEmailScenario = 'established' | 'insurance' | 'sales'

export type CrossSellEmailSourceProductLine = 'flight' | 'hotel'

export interface CreateCrossSellEmailContentOptions {
  assetUrls?: CrossSellEmailAssetUrls
  scenario: CrossSellEmailScenario
  sourceProductLine: CrossSellEmailSourceProductLine
}

interface CrossSellEmailPlan {
  deadlineText?: string
  highlights?: CrossSellEmailHighlightKey[]
  linkProfileKey: CrossSellEmailLinkProfileKey
  previewText: string
  sections: CrossSellEmailSectionPlan[]
  title: string
}

interface CrossSellEmailSectionPlan {
  ctaIcon?: 'search'
  ctaLabel?: string
  description?: string
  key: CrossSellEmailSectionKey
  recommendations?: CrossSellEmailRecommendationSetKey
  recommendationsTitle?: string
  showHeaderDescriptionAndCta?: boolean
  variant?: CrossSellEmailSectionVariant
}

const establishedDeadlineText = '加購優惠於2026/04/10 13:49 截止！'
const offerPreviewText = '旅遊計劃書與限時加購優惠'
const title = '旅遊計劃書'

const plans: Partial<
  Record<
    CrossSellEmailScenario,
    Partial<Record<CrossSellEmailSourceProductLine, CrossSellEmailPlan>>
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

export function createCrossSellEmailContent({
  assetUrls = defaultCrossSellEmailAssetUrls,
  scenario,
  sourceProductLine,
}: CreateCrossSellEmailContentOptions): CrossSellEmailProps {
  const plan = plans[scenario]?.[sourceProductLine]

  if (!plan) {
    throw new Error(
      `Unsupported cross-sell email content: ${scenario} ${sourceProductLine}.`,
    )
  }

  return {
    deadlineText: plan.deadlineText,
    highlights: plan.highlights
      ? createCrossSellEmailHighlights(plan.highlights, assetUrls)
      : undefined,
    previewText: plan.previewText,
    sections: plan.sections.map((section) =>
      createSection(section, plan.linkProfileKey, assetUrls),
    ),
    title: plan.title,
  }
}

function createSection(
  sectionPlan: CrossSellEmailSectionPlan,
  linkProfileKey: CrossSellEmailLinkProfileKey,
  assetUrls: CrossSellEmailAssetUrls,
): CrossSellEmailSection {
  const recommendations = sectionPlan.recommendations
    ? createCrossSellEmailRecommendations(sectionPlan.recommendations, {
        assetUrls,
        linkProfileKey,
      })
    : undefined

  const section = createCrossSellEmailSection(sectionPlan.key, {
    assetUrls,
    ctaIconUrl:
      sectionPlan.ctaIcon === 'search' ? assetUrls.searchIconUrl : undefined,
    ctaUrl: createCrossSellEmailUrl(linkProfileKey, sectionPlan.key),
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
