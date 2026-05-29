import { describe, expect, it } from 'vitest'

import {
  createLiontravelOrigin,
  createLiontravelUrl,
  isLiontravelDomainMode,
  resolveLiontravelDomainMode,
} from './liontravelUrl'

describe('liontravel URL helpers', () => {
  it('會為 UAT 在 production hostname 前加上 u', () => {
    expect(createLiontravelOrigin('vacation.liontravel.com', 'uat')).toBe(
      'https://uvacation.liontravel.com',
    )
  })

  it('會在 production 模式保留 production hostname', () => {
    expect(
      createLiontravelOrigin('vacation.liontravel.com', 'production'),
    ).toBe('https://vacation.liontravel.com')
  })

  it('會建立含編碼 query params 的 URL', () => {
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

  it('會驗證支援的 domain modes', () => {
    expect(isLiontravelDomainMode('uat')).toBe(true)
    expect(isLiontravelDomainMode('production')).toBe(true)
    expect(isLiontravelDomainMode('staging')).toBe(false)
  })

  it('會優先使用明確指定的 domain mode，而不是 hostname 推斷', () => {
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
  ] as const)('會將 %s 推斷為 %s', (hostname, expectedMode) => {
    expect(resolveLiontravelDomainMode(undefined, hostname)).toBe(expectedMode)
  })

  it.each(['holiday.xxx.com', 'localhost', 'www.liontravel.com'] as const)(
    '不會推斷未知 hostname %s',
    (hostname) => {
      expect(resolveLiontravelDomainMode(undefined, hostname)).toBeUndefined()
    },
  )
})
