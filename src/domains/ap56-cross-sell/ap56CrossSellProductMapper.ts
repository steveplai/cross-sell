import type {
  CrossSellWidgetItem,
  CrossSellWidgetSectionKind,
} from '@/widgets/cross-sell-widget'

import {
  createDiscountFields,
  createInterestLabelField,
  createRecommendationBadgeField,
  formatLocation,
  formatRating,
  formatRatingLabel,
  isVisibleRating,
} from './ap56CrossSellDisplayRules'
import { asNumber, asString, firstString } from './ap56CrossSellParsers'
import type { Ap56ProductInfo } from './ap56CrossSellTypes'

export interface Ap56ProductItemCandidate {
  item: CrossSellWidgetItem
  product: Ap56ProductInfo
}

interface Ap56ProductMapContext {
  index: number
  kind: CrossSellWidgetSectionKind
  totalItems: number
}

export function mapProductInfoToCandidate(
  product: Ap56ProductInfo,
  index: number,
): Ap56ProductItemCandidate | undefined {
  const item = mapBaseProductInfoToItem(product, index)

  return item ? { item, product } : undefined
}

export function mapProductInfoToItem(
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
      return enrichTransportProductItem(item, product)
    case 'flight':
      return item
  }
}

export function isProductItemCandidate(
  candidate: Ap56ProductItemCandidate | undefined,
): candidate is Ap56ProductItemCandidate {
  return !!candidate
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
    ...createDiscountFields(product),
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
    location: firstString(product.CityName),
    ...createInterestLabelField(product),
    ...createDiscountFields(product),
  }
}

function enrichTransportProductItem(
  item: CrossSellWidgetItem,
  product: Ap56ProductInfo,
): CrossSellWidgetItem {
  return {
    ...item,
    location: firstString(product.CityName),
    ...createInterestLabelField(product),
    ...createDiscountFields(product),
  }
}
