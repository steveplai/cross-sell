import { describe, expect, it } from 'vitest'

import {
  createTravelPlanCrossSellAssetUrls,
  resolveTravelPlanCrossSellEmailDomainMode,
} from './shared-assets'

describe('travel plan cross-sell email shared assets', () => {
  it('defaults to the UAT domain mode', () => {
    expect(resolveTravelPlanCrossSellEmailDomainMode()).toBe('uat')
  })

  it.each([
    ['uat', 'https://uwww.liontravel.com'],
    ['production', 'https://www.liontravel.com'],
  ] as const)('creates %s asset URLs', (mode, expectedDomain) => {
    const assetUrls = createTravelPlanCrossSellAssetUrls(mode)
    const expectedBaseUrl = `${expectedDomain}/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons`

    expect(assetUrls).toEqual({
      arrowIconUrl: `${expectedBaseUrl}/arrowIcon.png`,
      bedIconUrl: `${expectedBaseUrl}/bedIcon.png`,
      checkIconUrl: `${expectedBaseUrl}/checkIcon.png`,
      mountainIconUrl: `${expectedBaseUrl}/mountainIcon.png`,
      passportIconUrl: `${expectedBaseUrl}/passportIcon.png`,
      searchIconUrl: `${expectedBaseUrl}/searchIcon.png`,
      trainIconUrl: `${expectedBaseUrl}/trainIcon.png`,
      transportIconUrl: `${expectedBaseUrl}/transportIcon.png`,
    })
  })

  it('rejects unknown domain modes', () => {
    expect(() => resolveTravelPlanCrossSellEmailDomainMode('staging')).toThrow(
      'Invalid EMAIL_DOMAIN_MODE "staging". Expected "uat" or "production".',
    )
  })
})
