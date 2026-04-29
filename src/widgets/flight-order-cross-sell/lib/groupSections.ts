import type {
  FlightOrderCrossSellSection,
  FlightOrderCrossSellSectionKind,
} from '../types'

export type FlightOrderCrossSellSectionGroups = Record<
  FlightOrderCrossSellSectionKind,
  FlightOrderCrossSellSection[]
> & {
  other: FlightOrderCrossSellSection[]
}

export function getFlightOrderCrossSellSectionKind(
  section: FlightOrderCrossSellSection,
): FlightOrderCrossSellSectionKind | undefined {
  if (section.kind) {
    return section.kind
  }

  const sectionText = `${section.id} ${section.title}`.toLowerCase()

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

export function groupFlightOrderCrossSellSections(
  sections: FlightOrderCrossSellSection[],
): FlightOrderCrossSellSectionGroups {
  const groups: FlightOrderCrossSellSectionGroups = {
    hotel: [],
    attraction: [],
    transport: [],
    flight: [],
    other: [],
  }

  sections.forEach((section) => {
    const kind = getFlightOrderCrossSellSectionKind(section)

    if (kind) {
      groups[kind].push(section)
      return
    }

    groups.other.push(section)
  })

  return groups
}
