export type TravelPlanCrossSellEmailDomainMode = 'uat' | 'production'

export interface TravelPlanCrossSellAssetUrls {
  arrowIconUrl: string
  bedIconUrl: string
  checkIconUrl: string
  mountainIconUrl: string
  passportIconUrl: string
  searchIconUrl: string
  trainIconUrl: string
  transportIconUrl: string
}

const defaultTravelPlanCrossSellEmailDomainMode: TravelPlanCrossSellEmailDomainMode =
  'uat'

const travelPlanCrossSellEmailDomains = {
  production: 'https://www.liontravel.com',
  uat: 'https://uwww.liontravel.com',
} satisfies Record<TravelPlanCrossSellEmailDomainMode, string>

const iconPath =
  '/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons'

export function resolveTravelPlanCrossSellEmailDomainMode(
  value?: string,
): TravelPlanCrossSellEmailDomainMode {
  if (!value) {
    return defaultTravelPlanCrossSellEmailDomainMode
  }

  if (value === 'uat' || value === 'production') {
    return value
  }

  throw new Error(
    `Invalid EMAIL_DOMAIN_MODE "${value}". Expected "uat" or "production".`,
  )
}

export function createTravelPlanCrossSellAssetUrls(
  mode: TravelPlanCrossSellEmailDomainMode = defaultTravelPlanCrossSellEmailDomainMode,
): TravelPlanCrossSellAssetUrls {
  const baseUrl = `${travelPlanCrossSellEmailDomains[mode]}${iconPath}`

  return {
    arrowIconUrl: `${baseUrl}/arrowIcon.png`,
    bedIconUrl: `${baseUrl}/bedIcon.png`,
    checkIconUrl: `${baseUrl}/checkIcon.png`,
    mountainIconUrl: `${baseUrl}/mountainIcon.png`,
    passportIconUrl: `${baseUrl}/passportIcon.png`,
    searchIconUrl: `${baseUrl}/searchIcon.png`,
    trainIconUrl: `${baseUrl}/trainIcon.png`,
    transportIconUrl: `${baseUrl}/transportIcon.png`,
  }
}

export const defaultTravelPlanCrossSellAssetUrls =
  createTravelPlanCrossSellAssetUrls()
