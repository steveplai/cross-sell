import { describe, expect, it } from 'vitest'

import { getRemainingPromoSeconds, parsePromoStartsAt } from './countdown'

describe('parsePromoStartsAt', () => {
  it('accepts ISO datetimes with an explicit UTC marker', () => {
    expect(parsePromoStartsAt('2026-05-14T09:30:00.000Z')).toBe(
      Date.parse('2026-05-14T09:30:00.000Z'),
    )
  })

  it('accepts ISO datetimes with an explicit timezone offset', () => {
    expect(parsePromoStartsAt('2026-05-14T09:30:00+08:00')).toBe(
      Date.parse('2026-05-14T09:30:00+08:00'),
    )
  })

  it('accepts valid Date objects as runtime fallback input', () => {
    const value = new Date('2026-05-14T09:30:00.000Z')

    expect(parsePromoStartsAt(value)).toBe(value.getTime())
  })

  it('rejects date-only and timezone-less datetimes', () => {
    expect(parsePromoStartsAt('2026-05-14')).toBeUndefined()
    expect(parsePromoStartsAt('2026-05-14T09:30:00')).toBeUndefined()
  })

  it('rejects browser-dependent date strings', () => {
    expect(parsePromoStartsAt('Thu, 14 May 2026 09:30:00 GMT')).toBeUndefined()
    expect(parsePromoStartsAt('2026/05/14 09:30:00')).toBeUndefined()
  })

  it('rejects invalid calendar dates and time values', () => {
    expect(parsePromoStartsAt('2026-02-31T09:30:00Z')).toBeUndefined()
    expect(parsePromoStartsAt('2026-05-14T24:30:00Z')).toBeUndefined()
  })

  it('rejects invalid Date objects and unsupported value types', () => {
    expect(parsePromoStartsAt(new Date(Number.NaN))).toBeUndefined()
    expect(parsePromoStartsAt(1778749200000)).toBeUndefined()
    expect(parsePromoStartsAt(null)).toBeUndefined()
  })
})

describe('getRemainingPromoSeconds', () => {
  it('treats unsupported promo start formats as expired', () => {
    expect(
      getRemainingPromoSeconds(
        {
          startsAt: '2026-05-14',
          durationSeconds: 3600,
        },
        Date.parse('2026-05-14T00:00:00.000Z'),
      ),
    ).toBe(0)
  })
})
