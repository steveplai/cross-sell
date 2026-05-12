import type {
  FlightOrderCrossSellCategory,
  FlightOrderCrossSellItem,
  FlightOrderCrossSellSection,
  FlightOrderCrossSellSectionKind,
} from '@/widgets/flight-order-cross-sell'

import type {
  Ap56CrossSellingResponseEnvelope,
  Ap56CrossSellingResponseSection,
  Ap56ProductInfo,
} from './ap56CrossSellingTypes'

const defaultCategoryHref = 'https://www.liontravel.com/'

// Convert AP-56 sections into the widget's carousel-only section overrides.
// Non-carousel static content is merged later by the connected widget.
export function mapAp56CrossSellingResponseToSections(
  response:
    | Ap56CrossSellingResponseEnvelope
    | Ap56CrossSellingResponseSection[]
    | unknown,
): FlightOrderCrossSellSection[] {
  const sections = getResponseSections(response)

  if (!sections) {
    return []
  }

  const sectionOverrides = new Map<
    FlightOrderCrossSellSectionKind,
    FlightOrderCrossSellSection
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
    const section = getOrCreateSectionOverride(sectionOverrides, kind, type)

    // AP-56 uses pList both for product cards and for "view more" URL rows.
    if (isSearchViewMoreType(type)) {
      section.viewMoreHref = getFirstUrl(pList) ?? section.viewMoreHref
      const categories = createCategories(
        rawSection.CombineTagList,
        section.viewMoreHref,
      )

      if (categories.length > 0) {
        section.categories = categories
      }

      return
    }

    const items = pList.map(mapProductInfoToItem).filter(isItem)

    section.items.push(...items)

    // Some AP-56 URL rows are identifiable only by their payload shape. Preserve
    // an existing viewMoreHref if a more explicit search-page row already set it.
    if (items.length === 0) {
      section.viewMoreHref = section.viewMoreHref ?? getFirstUrl(pList)
    }

    const categories = createCategories(
      rawSection.CombineTagList,
      section.viewMoreHref,
    )

    if (categories.length > 0) {
      section.categories = categories
    }
  })

  return Array.from(sectionOverrides.values()).map((section) => ({
    ...section,
    // Category chips should navigate to the same destination as the section's
    // API-provided search page when that URL exists.
    categories:
      section.categories?.map((category) => ({
        ...category,
        href: section.viewMoreHref ?? category.href,
      })) ?? undefined,
  }))
}

// #region - Functions

function getOrCreateSectionOverride(
  sectionOverrides: Map<
    FlightOrderCrossSellSectionKind,
    FlightOrderCrossSellSection
  >,
  kind: FlightOrderCrossSellSectionKind,
  type: string,
) {
  const existingSection = sectionOverrides.get(kind)

  if (existingSection) {
    return existingSection
  }

  const section: FlightOrderCrossSellSection = {
    id: `api-${kind}`,
    kind,
    title: type,
    items: [],
  }

  sectionOverrides.set(kind, section)

  return section
}

function getResponseSections(response: unknown) {
  if (Array.isArray(response)) {
    return response as Ap56CrossSellingResponseSection[]
  }

  if (!response || typeof response !== 'object') {
    return undefined
  }

  const productDataList = (response as Ap56CrossSellingResponseEnvelope)
    .ProductDataList

  return Array.isArray(productDataList)
    ? (productDataList as Ap56CrossSellingResponseSection[])
    : undefined
}

function mapProductInfoToItem(
  product: Ap56ProductInfo,
  index: number,
): FlightOrderCrossSellItem | undefined {
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
  const salePrice = asNumber(product.SalePrice)
  const discount = asNumber(product.Discount)
  const likeability = asNumber(product.Likeability)

  // Keep API-specific field names contained here. Everything returned below is
  // the stable widget model consumed by ProductCard and CrossSellSection.
  return {
    id,
    title,
    href: asString(product.ProductUrl),
    imageUrl: asString(product.ImgUrl),
    location: formatLocation(product.Location),
    detailLocation: firstString(product.CityName),
    promoBadge:
      typeof likeability === 'number'
        ? `${Math.round(likeability)}%旅客喜愛`
        : undefined,
    starRating: asNumber(product.Level),
    rating: formatRating(product.Rating),
    ratingLabel: formatRatingLabel(product.Rating),
    reviewCount: asNumber(product.RatingCount),
    cancellationLabel: asString(product.CancelTag),
    originalPrice:
      typeof discount === 'number' && discount > 0 ? salePrice : undefined,
    discountLabel:
      typeof discount === 'number' && discount > 0
        ? `折扣 ${formatPercent(discount)}%`
        : undefined,
    price,
    pricePrefix: asString(product.SaleCurr),
    priceSuffix: '起',
  }
}

function getSectionKindFromApiType(
  type: string | undefined,
): FlightOrderCrossSellSectionKind | undefined {
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

function createCategories(
  value: unknown,
  href = defaultCategoryHref,
): FlightOrderCrossSellCategory[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value
    .map(asString)
    .filter((label): label is string => !!label)
    .map((label) => ({
      id: label,
      label,
      href,
    }))
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

function formatRating(value: unknown) {
  const rating = asNumber(value)

  if (typeof rating !== 'number' || rating <= 0) {
    return undefined
  }

  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(rating) ? 0 : 1,
  }).format(rating)
}

function formatRatingLabel(value: unknown) {
  const rating = asNumber(value)

  if (typeof rating !== 'number' || rating <= 0) {
    return undefined
  }

  if (rating >= 4.5) {
    return '太讚了'
  }

  if (rating >= 4) {
    return '很棒'
  }

  // Lower ratings still render the numeric score, just without a qualitative
  // label because the current card design only has positive copy.
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

function isItem(
  item: FlightOrderCrossSellItem | undefined,
): item is FlightOrderCrossSellItem {
  return !!item
}

// #endregion - Functions
