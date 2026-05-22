import {
  createLiontravelUrl,
  type LiontravelDomainMode,
} from '@/shared/utils/liontravelUrl'
import type {
  CrossSellWidgetItem,
  CrossSellWidgetPopularSearch,
  CrossSellWidgetSection,
  CrossSellWidgetSectionKind,
} from '@/widgets/cross-sell-widget'

import type {
  Ap56CrossSellResponseEnvelope,
  Ap56CrossSellResponseSection,
  Ap56ProductInfo,
} from './ap56CrossSellTypes'

const popularSearchProductionHostname = 'activity.liontravel.com'

interface MapAp56CrossSellResponseOptions {
  domainMode?: LiontravelDomainMode
}

interface Ap56ProductItemCandidate {
  item: CrossSellWidgetItem
  product: Ap56ProductInfo
}

interface Ap56SectionAccumulator extends CrossSellWidgetSection {
  kind: CrossSellWidgetSectionKind
  productCandidates: Ap56ProductItemCandidate[]
}

interface Ap56ProductMapContext {
  index: number
  kind: CrossSellWidgetSectionKind
  totalItems: number
}

// Convert AP-56 sections into the widget section model consumed by the
// connected widget. Non-carousel static content is supplied by the base widget.
export function mapAp56CrossSellResponseToSections(
  response:
    | Ap56CrossSellResponseEnvelope
    | Ap56CrossSellResponseSection[]
    | unknown,
  { domainMode = 'production' }: MapAp56CrossSellResponseOptions = {},
): CrossSellWidgetSection[] {
  const sections = getResponseSections(response)

  if (!sections) {
    return []
  }

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
      section.viewMoreHref = getFirstUrl(pList) ?? section.viewMoreHref
      const popularSearches = createPopularSearches(
        rawSection.CombineTagList,
        domainMode,
      )

      if (popularSearches.length > 0) {
        section.popularSearches = popularSearches
      }

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

    const popularSearches = createPopularSearches(
      rawSection.CombineTagList,
      domainMode,
    )

    if (popularSearches.length > 0) {
      section.popularSearches = popularSearches
    }
  })

  return Array.from(sectionAccumulators.values()).map(
    ({ productCandidates, ...section }) => ({
      ...section,
      items: productCandidates.map(({ item, product }, index) =>
        mapProductInfoToItem(item, product, {
          index,
          kind: section.kind,
          totalItems: productCandidates.length,
        }),
      ),
    }),
  )
}

// #region - Functions

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
    productCandidates: [],
  }

  sectionAccumulators.set(kind, section)

  return section
}

function getResponseSections(response: unknown) {
  if (Array.isArray(response)) {
    return response as Ap56CrossSellResponseSection[]
  }

  if (!response || typeof response !== 'object') {
    return undefined
  }

  const productDataList = (response as Ap56CrossSellResponseEnvelope)
    .ProductDataList

  return Array.isArray(productDataList)
    ? (productDataList as Ap56CrossSellResponseSection[])
    : undefined
}

function mapProductInfoToCandidate(
  product: Ap56ProductInfo,
  index: number,
): Ap56ProductItemCandidate | undefined {
  const item = mapBaseProductInfoToItem(product, index)

  return item ? { item, product } : undefined
}

function mapBaseProductInfoToItem(
  product: Ap56ProductInfo,
  index: number,
): CrossSellWidgetItem | undefined {
  if (!product || typeof product !== 'object') {
    return undefined
  }

  const title = asString(product.Title)
  const price = asNumber(product.Price) ?? asNumber(product.SalePrice)

  // A card without a title or display price cannot be rendered safely.
  if (!title || typeof price !== 'number') {
    return undefined
  }

  const id =
    asString(product.ID) ?? asString(product.ProductUrl) ?? `${title}-${index}`
  const rating = asNumber(product.Rating)
  const shouldShowRating = isVisibleRating(rating)

  // Keep API-specific field names contained here. Everything returned below is
  // the stable widget model consumed by ProductCard and CrossSellSection.
  return {
    id,
    title,
    href: asString(product.ProductUrl),
    imageUrl: asString(product.ImgUrl),
    rating: shouldShowRating ? formatRating(rating) : undefined,
    ratingLabel: shouldShowRating ? formatRatingLabel(rating) : undefined,
    reviewCount: shouldShowRating ? asNumber(product.RatingCount) : undefined,
    cancellationLabel: asString(product.CancelTag),
    price,
    pricePrefix: asString(product.SaleCurr),
    priceSuffix: '起',
  }
}

function mapProductInfoToItem(
  item: CrossSellWidgetItem,
  product: Ap56ProductInfo,
  context: Ap56ProductMapContext,
) {
  switch (context.kind) {
    case 'hotel':
      return enrichHotelProductItem(item, product, context)
    case 'attraction':
      return enrichAttractionProductItem(item, product, context)
    case 'transport':
      return enrichTransportProductItem(item)
    case 'flight':
      return item
  }
}

function enrichHotelProductItem(
  item: CrossSellWidgetItem,
  product: Ap56ProductInfo,
  context: Ap56ProductMapContext,
): CrossSellWidgetItem {
  return {
    ...item,
    ...createRecommendationBadgeField(context),
    location: formatLocation(product.Location),
    detailLocation: firstString(product.CityName),
    starRating: asNumber(product.Level),
    ...createHotelDiscountFields(product),
  }
}

function enrichAttractionProductItem(
  item: CrossSellWidgetItem,
  product: Ap56ProductInfo,
  context: Ap56ProductMapContext,
): CrossSellWidgetItem {
  return {
    ...item,
    ...createRecommendationBadgeField(context),
    detailLocation: firstString(product.CityName),
  }
}

function enrichTransportProductItem(
  item: CrossSellWidgetItem,
): CrossSellWidgetItem {
  return item
}

function createRecommendationBadgeField(
  context: Ap56ProductMapContext,
): Pick<CrossSellWidgetItem, 'recommendationBadge'> {
  const recommendationBadge = createRecommendationBadge(context)

  return recommendationBadge ? { recommendationBadge } : {}
}

function createRecommendationBadge({
  index,
  totalItems,
}: Ap56ProductMapContext) {
  return createRecommendationBadgeByIndex(totalItems)[index]
}

function createHotelDiscountFields(
  product: Ap56ProductInfo,
): Pick<CrossSellWidgetItem, 'discountLabel' | 'originalPrice'> {
  const salePrice = asNumber(product.SalePrice)
  const discount = asNumber(product.Discount)

  if (typeof discount !== 'number' || discount <= 0) {
    return {}
  }

  return {
    originalPrice: salePrice,
    discountLabel: `折扣 ${formatPercent(discount)}%`,
  }
}

function createRecommendationBadgeByIndex(itemsCount: number) {
  if (itemsCount >= 5) {
    return ['熱銷 TOP1', '熱銷 TOP2', '熱銷 TOP3', '最多旅客喜愛']
  }

  if (itemsCount >= 2) {
    return ['熱銷 TOP1']
  }

  return []
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

function getFirstUrl(products: Ap56ProductInfo[]) {
  for (const product of products) {
    const url = asString(product.url) ?? asString(product.ProductUrl)

    if (url) {
      return url
    }
  }

  return undefined
}

function createPopularSearches(
  value: unknown,
  domainMode: LiontravelDomainMode,
): CrossSellWidgetPopularSearch[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map(asString)
    .filter((label): label is string => !!label)
    .map((label) => ({
      id: label,
      label,
      href: createPopularSearchHref(label, domainMode),
    }))
}

function createPopularSearchHref(
  label: string,
  domainMode: LiontravelDomainMode,
) {
  return createLiontravelUrl({
    domainMode,
    pathname: '/search',
    productionHostname: popularSearchProductionHostname,
    query: {
      SearchKeyword: label,
    },
  })
}

function formatLocation(value: unknown) {
  if (!value || typeof value !== 'object') {
    return undefined
  }

  const location = value as Record<string, unknown>
  const name = asString(location.Name)
  const distance = asNumber(location.Distance)
  const unit = asString(location.Unit)

  if (name && typeof distance === 'number' && unit) {
    return `距離${name}${distance}${unit}`
  }

  return name
}

function isVisibleRating(rating: number | undefined): rating is number {
  return typeof rating === 'number' && rating >= 3.5
}

function formatRating(rating: number) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(rating) ? 0 : 1,
  }).format(rating)
}

function formatRatingLabel(rating: number) {
  if (rating >= 4.5) {
    return '太讚了'
  }

  if (rating >= 4) {
    return '非常好'
  }

  if (rating >= 3.5) {
    return '很不錯'
  }

  return undefined
}

function formatPercent(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
  }).format(value)
}

function firstString(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value.map(asString).find((item): item is string => !!item)
}

function asString(value: unknown) {
  // Treat blank API strings like missing data so optional UI fragments disappear
  // instead of rendering empty badges or links.
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : undefined
}

function isProductItemCandidate(
  candidate: Ap56ProductItemCandidate | undefined,
): candidate is Ap56ProductItemCandidate {
  return !!candidate
}

// #endregion - Functions
