import type {
  CrossSellWidgetSection,
  CrossSellWidgetSectionKind,
} from '../types'

export type CrossSellWidgetSectionGroups = Record<
  CrossSellWidgetSectionKind,
  CrossSellWidgetSection[]
> & {
  other: CrossSellWidgetSection[]
}

export function getCrossSellWidgetSectionKind(
  section: CrossSellWidgetSection,
): CrossSellWidgetSectionKind | undefined {
  if (section.kind) {
    return section.kind
  }

  const sectionText = `${section.id} ${section.title ?? ''}`.toLowerCase()

  if (sectionText.includes('hotel') || sectionText.includes('飯店')) {
    return 'hotel'
  }

  if (
    sectionText.includes('attraction') ||
    sectionText.includes('景點') ||
    sectionText.includes('票券')
  ) {
    return 'attraction'
  }

  if (
    sectionText.includes('transport') ||
    sectionText.includes('交通') ||
    sectionText.includes('transfer')
  ) {
    return 'transport'
  }

  if (sectionText.includes('flight') || sectionText.includes('機票')) {
    return 'flight'
  }

  return undefined
}

export function groupCrossSellWidgetSections<
  TSection extends CrossSellWidgetSection,
>(sections: TSection[]) {
  const groups: Record<CrossSellWidgetSectionKind, TSection[]> & {
    other: TSection[]
  } = {
    hotel: [],
    attraction: [],
    transport: [],
    flight: [],
    other: [],
  }

  sections.forEach((section) => {
    const kind = getCrossSellWidgetSectionKind(section)

    if (kind) {
      groups[kind].push(section)
      return
    }

    groups.other.push(section)
  })

  return groups
}
