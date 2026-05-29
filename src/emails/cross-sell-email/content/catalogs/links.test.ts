import { describe, expect, it } from 'vitest'

import { createCrossSellEmailUrl } from './links'

describe('createCrossSellEmailUrl', () => {
  it('會保留 product query parameters 並加上 UTM parameters', () => {
    expect(createCrossSellEmailUrl('flightEstablished', 'transportation')).toBe(
      'https://uactivity.liontravel.com/search?Foreign=1&SearchKindName=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8&utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-traffic-more-addon&utm_content=flight',
    )
  })

  it('production domain mode 會使用 production hostnames', () => {
    expect(
      createCrossSellEmailUrl(
        'flightEstablished',
        'transportation',
        undefined,
        'production',
      ),
    ).toBe(
      'https://activity.liontravel.com/search?Foreign=1&SearchKindName=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8&utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-traffic-more-addon&utm_content=flight',
    )
  })

  it('會使用符合 placeholder product destinations 的 target routes', () => {
    expect(createCrossSellEmailUrl('flightEstablished', 'hotel')).toBe(
      'https://uhotel.liontravel.com/search?searchParam=&utm_source=orderconfirmation&utm_medium=email&utm_campaign=hotel-addon&utm_content=flight',
    )
    expect(
      createCrossSellEmailUrl('flightEstablished', 'localExperience'),
    ).toBe(
      'https://uactivity.liontravel.com/search?Foreign=1&SearchKindName=%E9%81%8A%E7%A8%8B&utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-addon&utm_content=flight',
    )
    expect(createCrossSellEmailUrl('flightEstablished', 'rail')).toBe(
      'https://uvacation.liontravel.com/thsrdetail?utm_source=orderconfirmation&utm_medium=email&utm_campaign=thsrc-addon&utm_content=flight',
    )
    expect(createCrossSellEmailUrl('flightEstablished', 'visaPassport')).toBe(
      'https://uvisa.liontravel.com/search?Countrylicensing=TW&utm_source=orderconfirmation&utm_medium=email&utm_campaign=visa-addon&utm_content=flight',
    )
  })

  it('會保留 recommendation suffixes 作為 product route path segments', () => {
    expect(
      createCrossSellEmailUrl(
        'flightSales',
        'hotelRecommendation',
        'omo5-tokyo-otsuka',
        'production',
      ),
    ).toBe(
      'https://hotel.liontravel.com/detail/omo5-tokyo-otsuka?utm_source=crosssell&utm_medium=email&utm_campaign=hotel-addon&utm_content=flight',
    )
    expect(
      createCrossSellEmailUrl(
        'flightEstablished',
        'transportationRecommendation',
        'airport-transfer',
      ),
    ).toBe(
      'https://uactivity.liontravel.com/search/airport-transfer?Foreign=1&SearchKindName=%E4%BA%A4%E9%80%9A%E7%A5%A8%E5%88%B8&utm_source=orderconfirmation&utm_medium=email&utm_campaign=activity-traffic-addon&utm_content=flight',
    )
  })

  it('profile 缺少 target campaign 時會 throw', () => {
    expect(() => createCrossSellEmailUrl('hotelSales', 'hotel')).toThrowError(
      'Missing UTM campaign for hotelSales hotel cross-sell link.',
    )
  })
})
