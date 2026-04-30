import { describe, expect, it } from 'vitest'

import {
  createLiontravelOrigin,
  createLiontravelUrl,
  isLiontravelDomainMode,
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
})
