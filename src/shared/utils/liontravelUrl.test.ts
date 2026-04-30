import { describe, expect, it } from 'vitest'

import {
  createLiontravelOrigin,
  createLiontravelUrl,
  isLiontravelDomainMode,
  resolveLiontravelDomainMode,
} from './liontravelUrl'

describe('liontravel URL helpers', () => {
  it('prefixes a production hostname with u for UAT', () => {
    expect(createLiontravelOrigin('vacation.liontravel.com', 'uat')).toBe(
      'https://uvacation.liontravel.com',
    )
  })

  it('keeps the production hostname for production', () => {
    expect(
      createLiontravelOrigin('vacation.liontravel.com', 'production'),
    ).toBe('https://vacation.liontravel.com')
  })

  it('builds a URL with encoded query params', () => {
    expect(
      createLiontravelUrl({
        domainMode: 'uat',
        pathname: '/thsrdetail',
        productionHostname: 'vacation.liontravel.com',
        query: {
          sYear: '2026',
          sOrdr: '16575',
        },
      }),
    ).toBe('https://uvacation.liontravel.com/thsrdetail?sYear=2026&sOrdr=16575')
  })

  it('validates supported domain modes', () => {
    expect(isLiontravelDomainMode('uat')).toBe(true)
    expect(isLiontravelDomainMode('production')).toBe(true)
    expect(isLiontravelDomainMode('staging')).toBe(false)
  })

  it('prefers an explicit domain mode over hostname inference', () => {
    expect(resolveLiontravelDomainMode('uat', 'flight.liontravel.com')).toBe(
      'uat',
    )
    expect(
      resolveLiontravelDomainMode('production', 'uflight.liontravel.com'),
    ).toBe('production')
  })

  it.each([
    ['uflight.liontravel.com', 'uat'],
    ['flight.liontravel.com', 'production'],
  ] as const)('infers %s as %s', (hostname, expectedMode) => {
    expect(resolveLiontravelDomainMode(undefined, hostname)).toBe(expectedMode)
  })

  it.each(['holiday.xxx.com', 'localhost', 'www.liontravel.com'] as const)(
    'does not infer unknown hostname %s',
    (hostname) => {
      expect(resolveLiontravelDomainMode(undefined, hostname)).toBeUndefined()
    },
  )
})
