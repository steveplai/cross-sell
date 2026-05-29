import { describe, expect, it } from 'vitest'

import { getRemainingPromoSeconds, parsePromoStartsAt } from './countdown'

describe('parsePromoStartsAt', () => {
  it('會接受帶有明確 UTC marker 的 ISO datetimes', () => {
    expect(parsePromoStartsAt('2026-05-14T09:30:00.000Z')).toBe(
      Date.parse('2026-05-14T09:30:00.000Z'),
    )
  })

  it('會接受帶有明確 timezone offset 的 ISO datetimes', () => {
    expect(parsePromoStartsAt('2026-05-14T09:30:00+08:00')).toBe(
      Date.parse('2026-05-14T09:30:00+08:00'),
    )
  })

  it('會接受有效 Date objects 作為 runtime fallback input', () => {
    const value = new Date('2026-05-14T09:30:00.000Z')

    expect(parsePromoStartsAt(value)).toBe(value.getTime())
  })

  it('會拒絕 date-only 與缺少 timezone 的 datetimes', () => {
    expect(parsePromoStartsAt('2026-05-14')).toBeUndefined()
    expect(parsePromoStartsAt('2026-05-14T09:30:00')).toBeUndefined()
  })

  it('會拒絕 browser-dependent date strings', () => {
    expect(parsePromoStartsAt('Thu, 14 May 2026 09:30:00 GMT')).toBeUndefined()
    expect(parsePromoStartsAt('2026/05/14 09:30:00')).toBeUndefined()
  })

  it('會拒絕無效 calendar dates 與 time values', () => {
    expect(parsePromoStartsAt('2026-02-31T09:30:00Z')).toBeUndefined()
    expect(parsePromoStartsAt('2026-05-14T24:30:00Z')).toBeUndefined()
  })

  it('會拒絕無效 Date objects 與不支援的 value types', () => {
    expect(parsePromoStartsAt(new Date(Number.NaN))).toBeUndefined()
    expect(parsePromoStartsAt(1778749200000)).toBeUndefined()
    expect(parsePromoStartsAt(null)).toBeUndefined()
  })
})

describe('getRemainingPromoSeconds', () => {
  it('會將不支援的 promo start formats 視為已過期', () => {
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
