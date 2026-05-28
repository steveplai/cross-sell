import { createLiontravelOrigin } from '../../../../shared/utils/liontravelUrl'
import type { CrossSellEmailDomainMode } from '../shared-assets'
import type { CrossSellEmailSectionKey } from './sections'

export type CrossSellEmailLinkProfileKey =
  | 'flightEstablished'
  | 'flightInsurance'
  | 'flightSales'
  | 'hotelEstablished'
  | 'hotelSales'

export type CrossSellEmailLinkTarget =
  | CrossSellEmailSectionKey
  | 'hotelRecommendation'
  | 'transportationRecommendation'

interface LinkProfile {
  content: string
  source: string
}

const linkProfiles: Record<CrossSellEmailLinkProfileKey, LinkProfile> = {
  flightInsurance: {
    content: 'flight',
    source: 'insurance',
  },
  flightEstablished: {
    content: 'flight',
    source: 'orderconfirmation',
  },
  flightSales: {
    content: 'flight',
    source: 'crosssell',
  },
  hotelEstablished: {
    content: 'hotel',
    source: 'orderconfirmation',
  },
  hotelSales: {
    content: 'hotel',
    source: 'crosssell',
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
  hotelSales: {
    localExperience: 'activity-addon',
    rail: 'thsrc-addon',
    transportation: 'activity-traffic-more-addon',
    transportationRecommendation: 'activity-traffic-addon',
  },
}

const productionHostnameByTarget = {
  hotel: 'hotel.liontravel.com',
  localExperience: 'activity.liontravel.com',
  rail: 'vacation.liontravel.com',
  transportation: 'activity.liontravel.com',
  visaPassport: 'visa.liontravel.com',
} satisfies Record<CrossSellEmailSectionKey, string>

const recommendationProductionHostnameByTarget = {
  hotelRecommendation: 'hotel.liontravel.com',
  transportationRecommendation: 'activity.liontravel.com',
} satisfies Record<
  Exclude<CrossSellEmailLinkTarget, CrossSellEmailSectionKey>,
  string
>

function createUrl(
  domainMode: CrossSellEmailDomainMode,
  productionHostname: string,
  pathname: string,
  query?: Record<string, string>,
) {
  const url = new URL(
    pathname,
    createLiontravelOrigin(productionHostname, domainMode),
  )

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }

  return url
}

function createProductUrl(
  target: CrossSellEmailLinkTarget,
  domainMode: CrossSellEmailDomainMode,
  pathSuffix?: string,
) {
  if (target === 'hotelRecommendation') {
    return createUrl(
      domainMode,
      recommendationProductionHostnameByTarget.hotelRecommendation,
      ['/detail', pathSuffix].filter(Boolean).join('/'),
    )
  }

  if (target === 'transportationRecommendation') {
    return createUrl(
      domainMode,
      recommendationProductionHostnameByTarget.transportationRecommendation,
      ['/search', pathSuffix].filter(Boolean).join('/'),
      {
        Foreign: '1',
        SearchKindName: '交通票券',
      },
    )
  }

  const queryByTarget = {
    hotel: { searchParam: '' },
    localExperience: { Foreign: '1', SearchKindName: '遊程' },
    rail: undefined,
    transportation: { Foreign: '1', SearchKindName: '交通票券' },
    visaPassport: { Countrylicensing: 'TW' },
  } satisfies Record<
    CrossSellEmailSectionKey,
    Record<string, string> | undefined
  >

  const pathnameByTarget = {
    hotel: '/search',
    localExperience: '/search',
    rail: '/thsrdetail',
    transportation: '/search',
    visaPassport: '/search',
  } satisfies Record<CrossSellEmailSectionKey, string>

  return createUrl(
    domainMode,
    productionHostnameByTarget[target],
    pathnameByTarget[target],
    queryByTarget[target],
  )
}

export function createCrossSellEmailUrl(
  profileKey: CrossSellEmailLinkProfileKey,
  target: CrossSellEmailLinkTarget,
  pathSuffix?: string,
  domainMode: CrossSellEmailDomainMode = 'uat',
) {
  const profile = linkProfiles[profileKey]
  const campaign = campaignByTarget[profileKey][target]

  if (!campaign) {
    throw new Error(
      `Missing UTM campaign for ${profileKey} ${target} cross-sell link.`,
    )
  }

  const url = createProductUrl(target, domainMode, pathSuffix)
  const utmQuery = {
    utm_source: profile.source,
    utm_medium: 'email',
    utm_campaign: campaign,
    utm_content: profile.content,
  }

  Object.entries(utmQuery).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  return url.toString()
}
