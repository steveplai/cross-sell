import {
  createLiontravelUrl,
  type LiontravelDomainMode,
} from '@/shared/utils/liontravelUrl'
import type {
  CrossSellWidgetPopularSearch,
  CrossSellWidgetSection,
  CrossSellWidgetSectionKind,
} from '@/widgets/cross-sell-widget'

import { asString, getFirstUrl } from './ap56CrossSellParsers'
import {
  type Ap56ProductItemCandidate,
  isProductItemCandidate,
  mapProductInfoToCandidate,
  mapProductInfoToItem,
} from './ap56CrossSellProductMapper'
import type {
  Ap56CrossSellResponseSection,
  Ap56ProductInfo,
} from './ap56CrossSellTypes'

const popularSearchProductionHostname = 'search.liontravel.com'

const popularSearchTaglistBySectionKind: Record<
  CrossSellWidgetSectionKind,
  string
> = {
  attraction: 'etk',
  flight: 'flt',
  hotel: 'htl',
  transport: 'etk',
}

interface MapAp56SectionsToWidgetSectionsOptions {
  domainMode: LiontravelDomainMode
}

interface Ap56SectionAccumulator extends CrossSellWidgetSection {
  kind: CrossSellWidgetSectionKind
  popularSearchLabels: string[]
  popularSearchTrackingParams?: PopularSearchTrackingParams
  productCandidates: Ap56ProductItemCandidate[]
}

interface PopularSearchTrackingParams {
  mtl?: string
  mtld?: string
}

export function mapAp56SectionsToWidgetSections(
  sections: Ap56CrossSellResponseSection[],
  { domainMode }: MapAp56SectionsToWidgetSectionsOptions,
): CrossSellWidgetSection[] {
  const sectionAccumulators = new Map<
    CrossSellWidgetSectionKind,
    Ap56SectionAccumulator
  >()

  sections.forEach((rawSection) => {
    if (!rawSection || typeof rawSection !== 'object') {
      return
    }

    // Type controls which existing carousel section this API row should replace.
    // Unknown types are ignored so future AP-56 additions do not break rendering.
    const type = asString(rawSection.Type)
    const kind = getSectionKindFromApiType(type)

    if (!kind || !type) {
      return
    }

    const pList = Array.isArray(rawSection.pList)
      ? (rawSection.pList as Ap56ProductInfo[])
      : []

    // Multiple AP-56 rows can contribute to one widget section, for example
    // product rows and separate "view more" URL rows for the same kind.
    const section = getOrCreateSectionAccumulator(sectionAccumulators, kind)

    // AP-56 uses pList both for product cards and for "view more" URL rows.
    if (isSearchViewMoreType(type)) {
      const viewMoreHref = getFirstUrl(pList)

      if (viewMoreHref) {
        section.viewMoreHref = viewMoreHref
        section.popularSearchTrackingParams =
          getPopularSearchTrackingParams(viewMoreHref)
      }

      updatePopularSearchLabels(section, rawSection.CombineTagList)

      return
    }

    const productCandidates = pList
      .map(mapProductInfoToCandidate)
      .filter(isProductItemCandidate)

    section.productCandidates.push(...productCandidates)

    // Some AP-56 URL rows are identifiable only by their payload shape. Preserve
    // an existing viewMoreHref if a more explicit search-page row already set it.
    if (productCandidates.length === 0) {
      section.viewMoreHref = section.viewMoreHref ?? getFirstUrl(pList)
    }

    updatePopularSearchLabels(section, rawSection.CombineTagList)
  })

  return Array.from(sectionAccumulators.values()).map(
    ({
      productCandidates,
      popularSearchLabels,
      popularSearchTrackingParams,
      ...section
    }) => {
      const popularSearches = createPopularSearches({
        domainMode,
        kind: section.kind,
        labels: popularSearchLabels,
        trackingParams: popularSearchTrackingParams,
      })

      return {
        ...section,
        ...(popularSearches.length > 0 ? { popularSearches } : {}),
        items: productCandidates.map(({ item, product }, index) =>
          mapProductInfoToItem(item, product, {
            index,
            kind: section.kind,
            totalItems: productCandidates.length,
          }),
        ),
      }
    },
  )
}

function getOrCreateSectionAccumulator(
  sectionAccumulators: Map<CrossSellWidgetSectionKind, Ap56SectionAccumulator>,
  kind: CrossSellWidgetSectionKind,
) {
  const existingSection = sectionAccumulators.get(kind)

  if (existingSection) {
    return existingSection
  }

  const section: Ap56SectionAccumulator = {
    id: `api-${kind}`,
    kind,
    items: [],
    popularSearchLabels: [],
    productCandidates: [],
  }

  sectionAccumulators.set(kind, section)

  return section
}

function getSectionKindFromApiType(
  type: string | undefined,
): CrossSellWidgetSectionKind | undefined {
  if (type?.startsWith('訂房')) {
    return 'hotel'
  }

  if (type?.includes('票券(交通)')) {
    return 'transport'
  }

  if (type?.includes('票券(玩樂)') || type?.includes('票券(網路服務)')) {
    return 'attraction'
  }

  return undefined
}

function isSearchViewMoreType(type: string | undefined) {
  return type?.includes('看更多(搜尋頁)') ?? false
}

function updatePopularSearchLabels(
  section: Ap56SectionAccumulator,
  value: unknown,
) {
  if (!Array.isArray(value)) {
    return
  }

  const labels = value.map(asString).filter((label): label is string => !!label)

  if (labels.length > 0) {
    section.popularSearchLabels = labels
  }
}

interface CreatePopularSearchesOptions {
  domainMode: LiontravelDomainMode
  kind: CrossSellWidgetSectionKind
  labels: string[]
  trackingParams?: PopularSearchTrackingParams
}

function createPopularSearches({
  domainMode,
  kind,
  labels,
  trackingParams,
}: CreatePopularSearchesOptions): CrossSellWidgetPopularSearch[] {
  return labels.map((label) => ({
    id: label,
    label,
    href: createPopularSearchHref({
      domainMode,
      kind,
      label,
      trackingParams,
    }),
  }))
}

interface CreatePopularSearchHrefOptions {
  domainMode: LiontravelDomainMode
  kind: CrossSellWidgetSectionKind
  label: string
  trackingParams?: PopularSearchTrackingParams
}

function createPopularSearchHref({
  domainMode,
  kind,
  label,
  trackingParams,
}: CreatePopularSearchHrefOptions) {
  return createLiontravelUrl({
    domainMode,
    pathname: `/zh-tw/${encodeURIComponent(label)}`,
    productionHostname: popularSearchProductionHostname,
    query: {
      taglist: popularSearchTaglistBySectionKind[kind],
      mtl: trackingParams?.mtl,
      mtld: trackingParams?.mtld,
    },
  })
}

function getPopularSearchTrackingParams(
  href: string,
): PopularSearchTrackingParams | undefined {
  try {
    const url = new URL(href)
    const mtl = asString(url.searchParams.get('mtl'))
    const mtld = asString(url.searchParams.get('mtld'))

    return mtl || mtld ? { mtl, mtld } : undefined
  } catch {
    return undefined
  }
}
