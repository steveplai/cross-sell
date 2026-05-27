import type { TravelPlanCrossSellSectionKey } from './section-catalog'

export type TravelPlanCrossSellLinkProfileKey =
  | 'flightInsurance'
  | 'flightOrderConfirmation'
  | 'flightSales'
  | 'hotelOrderConfirmation'

export type TravelPlanCrossSellLinkTarget =
  | TravelPlanCrossSellSectionKey
  | 'hotelRecommendation'
  | 'transportationRecommendation'

interface LinkProfile {
  basePath: string
  content: string
  source: string
  visaPassportBasePath?: string
}

const linkProfiles: Record<TravelPlanCrossSellLinkProfileKey, LinkProfile> = {
  flightInsurance: {
    basePath: 'insurance-cross-sell',
    content: 'flight',
    source: 'insurance',
  },
  flightOrderConfirmation: {
    basePath: 'order-cross-sell',
    content: 'flight',
    source: 'orderconfirmation',
    visaPassportBasePath: 'insurance-cross-sell',
  },
  flightSales: {
    basePath: 'sales-cross-sell',
    content: 'flight',
    source: 'crosssell',
    visaPassportBasePath: 'insurance-cross-sell',
  },
  hotelOrderConfirmation: {
    basePath: 'hotel-order-cross-sell',
    content: 'hotel',
    source: 'orderconfirmation',
  },
}

const campaignByTarget: Record<
  TravelPlanCrossSellLinkProfileKey,
  Partial<Record<TravelPlanCrossSellLinkTarget, string>>
> = {
  flightInsurance: {
    hotel: 'hotel-addon',
    localExperience: 'activity-diy-addon',
    rail: 'thsrc-addon',
    transportation: 'activity-traffic-addon',
    visaPassport: 'visa-addon',
  },
  flightOrderConfirmation: {
    hotel: 'hotel-addon',
    localExperience: 'activity-addon',
    rail: 'thsrc-addon',
    transportation: 'activity-traffic-more-addon',
    transportationRecommendation: 'activity-traffic-addon',
    visaPassport: 'visa-addon',
  },
  flightSales: {
    hotel: 'hotel-more-addon',
    hotelRecommendation: 'hotel-addon',
    localExperience: 'activity-addon',
    rail: 'thsrc-addon',
    transportation: 'activity-traffic-more-addon',
    visaPassport: 'visa-addon',
  },
  hotelOrderConfirmation: {
    localExperience: 'activity-addon',
    rail: 'thsrc-addon',
    transportation: 'activity-traffic-more-addon',
    transportationRecommendation: 'activity-traffic-addon',
  },
}

const pathByTarget = {
  hotel: 'hotels',
  hotelRecommendation: 'hotels',
  localExperience: 'experiences',
  rail: 'rail',
  transportation: 'transportation',
  transportationRecommendation: 'transportation',
  visaPassport: 'visa-passport',
} satisfies Record<TravelPlanCrossSellLinkTarget, string>

export function createTravelPlanCrossSellUrl(
  profileKey: TravelPlanCrossSellLinkProfileKey,
  target: TravelPlanCrossSellLinkTarget,
  pathSuffix?: string,
) {
  const profile = linkProfiles[profileKey]
  const campaign = campaignByTarget[profileKey][target]

  if (!campaign) {
    throw new Error(
      `Missing UTM campaign for ${profileKey} ${target} cross-sell link.`,
    )
  }

  const basePath =
    target === 'visaPassport' && profile.visaPassportBasePath
      ? profile.visaPassportBasePath
      : profile.basePath
  const path = [basePath, pathByTarget[target], pathSuffix]
    .filter(Boolean)
    .join('/')
  const utmQuery = new URLSearchParams({
    utm_source: profile.source,
    utm_medium: 'email',
    utm_campaign: campaign,
    utm_content: profile.content,
  })

  return `https://example.com/${path}?${utmQuery.toString()}`
}
