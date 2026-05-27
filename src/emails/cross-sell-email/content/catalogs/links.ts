import type { CrossSellEmailSectionKey } from './sections'

export type CrossSellEmailLinkProfileKey =
  | 'flightEstablished'
  | 'flightInsurance'
  | 'flightSales'
  | 'hotelEstablished'

export type CrossSellEmailLinkTarget =
  | CrossSellEmailSectionKey
  | 'hotelRecommendation'
  | 'transportationRecommendation'

interface LinkProfile {
  basePath: string
  content: string
  source: string
  visaPassportBasePath?: string
}

const linkProfiles: Record<CrossSellEmailLinkProfileKey, LinkProfile> = {
  flightInsurance: {
    basePath: 'flight-insurance',
    content: 'flight',
    source: 'insurance',
  },
  flightEstablished: {
    basePath: 'flight-established',
    content: 'flight',
    source: 'orderconfirmation',
    visaPassportBasePath: 'flight-insurance',
  },
  flightSales: {
    basePath: 'flight-sales',
    content: 'flight',
    source: 'crosssell',
    visaPassportBasePath: 'flight-insurance',
  },
  hotelEstablished: {
    basePath: 'hotel-established',
    content: 'hotel',
    source: 'orderconfirmation',
  },
}

const campaignByTarget: Record<
  CrossSellEmailLinkProfileKey,
  Partial<Record<CrossSellEmailLinkTarget, string>>
> = {
  flightInsurance: {
    hotel: 'hotel-addon',
    localExperience: 'activity-diy-addon',
    rail: 'thsrc-addon',
    transportation: 'activity-traffic-addon',
    visaPassport: 'visa-addon',
  },
  flightEstablished: {
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
  hotelEstablished: {
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
} satisfies Record<CrossSellEmailLinkTarget, string>

export function createCrossSellEmailUrl(
  profileKey: CrossSellEmailLinkProfileKey,
  target: CrossSellEmailLinkTarget,
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
