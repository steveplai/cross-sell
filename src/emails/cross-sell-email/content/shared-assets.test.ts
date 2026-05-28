import { describe, expect, it } from 'vitest'

import {
  createCrossSellEmailAssetUrls,
  resolveCrossSellEmailDomainMode,
} from './shared-assets'

describe('cross-sell email email shared assets', () => {
  it('defaults to the UAT domain mode', () => {
    expect(resolveCrossSellEmailDomainMode()).toBe('uat')
  })

  it.each(['uat', 'production'] as const)(
    'resolves %s as a valid domain mode',
    (mode) => {
      expect(resolveCrossSellEmailDomainMode(mode)).toBe(mode)
    },
  )

  it.each([
    ['uat', 'https://uwww.liontravel.com'],
    ['production', 'https://www.liontravel.com'],
  ] as const)('creates %s asset URLs', (mode, expectedDomain) => {
    const assetUrls = createCrossSellEmailAssetUrls(mode)
    const expectedBaseUrl = `${expectedDomain}/_webassets/lightspeed/subsitebundles/common/imgs/crossSale/icons`

    expect(assetUrls).toEqual({
      arrowIconUrl: `${expectedBaseUrl}/arrowIcon.png`,
      bedIconUrl: `${expectedBaseUrl}/bedIcon.png`,
      checkIconUrl: `${expectedBaseUrl}/checkIcon.png`,
      domainMode: mode,
      mountainIconUrl: `${expectedBaseUrl}/mountainIcon.png`,
      passportIconUrl: `${expectedBaseUrl}/passportIcon.png`,
      searchIconUrl: `${expectedBaseUrl}/searchIcon.png`,
      trainIconUrl: `${expectedBaseUrl}/trainIcon.png`,
      transportIconUrl: `${expectedBaseUrl}/transportIcon.png`,
    })
  })

  it('rejects unknown domain modes', () => {
    expect(() => resolveCrossSellEmailDomainMode('staging')).toThrow(
      'Invalid EMAIL_DOMAIN_MODE "staging". Expected "uat" or "production".',
    )
  })
})
