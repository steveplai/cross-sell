export type CrossSellEmailDomainMode = 'uat' | 'production'

export interface CrossSellEmailAssetUrls {
  arrowIconUrl: string
  bedIconUrl: string
  checkIconUrl: string
  mountainIconUrl: string
  passportIconUrl: string
  searchIconUrl: string
  trainIconUrl: string
  transportIconUrl: string
}

const defaultCrossSellEmailDomainMode: CrossSellEmailDomainMode = 'uat'

const crossSellEmailDomains = {
  production: 'https://www.liontravel.com',
  uat: 'https://uwww.liontravel.com',
} satisfies Record<CrossSellEmailDomainMode, string>

const iconPath =
  '/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons'

export function resolveCrossSellEmailDomainMode(
  value?: string,
): CrossSellEmailDomainMode {
  if (!value) {
    return defaultCrossSellEmailDomainMode
  }

  if (value === 'uat' || value === 'production') {
    return value
  }

  throw new Error(
    `Invalid EMAIL_DOMAIN_MODE "${value}". Expected "uat" or "production".`,
  )
}

export function createCrossSellEmailAssetUrls(
  mode: CrossSellEmailDomainMode = defaultCrossSellEmailDomainMode,
): CrossSellEmailAssetUrls {
  const baseUrl = `${crossSellEmailDomains[mode]}${iconPath}`

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

export const defaultCrossSellEmailAssetUrls = createCrossSellEmailAssetUrls()
