import { describe, expect, it } from 'vitest'

import type { FlightOrderCrossSellSection } from '../types'
import {
  getFlightOrderCrossSellSectionKind,
  groupFlightOrderCrossSellSections,
} from './groupSections'

function createSection(
  section: Partial<FlightOrderCrossSellSection>,
): FlightOrderCrossSellSection {
  return {
    id: 'section',
    items: [],
    title: 'Section',
    ...section,
  }
}

describe('groupFlightOrderCrossSellSections', () => {
  it('uses explicit section kind before fallback classification', () => {
    const section = createSection({
      id: 'tokyo-hotels',
      kind: 'flight',
      title: '探索東京飯店',
    })

    expect(getFlightOrderCrossSellSectionKind(section)).toBe('flight')
  })

  it('classifies legacy sections by id and title', () => {
    const sections = [
      createSection({ id: 'tokyo-hotels', title: '探索東京飯店' }),
      createSection({ id: 'tokyo-attractions', title: '探索東京 景點不錯過' }),
      createSection({ id: 'local-transport', title: '當地交通 一次搞定' }),
      createSection({ id: 'cross-sell-flights', title: '精選機票優惠' }),
      createSection({ id: 'recommended-products', title: '推薦商品' }),
    ]

    const groups = groupFlightOrderCrossSellSections(sections)

    expect(groups.hotel).toEqual([sections[0]])
    expect(groups.attraction).toEqual([sections[1]])
    expect(groups.transport).toEqual([sections[2]])
    expect(groups.flight).toEqual([sections[3]])
    expect(groups.other).toEqual([sections[4]])
  })
})
