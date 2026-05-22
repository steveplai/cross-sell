import type { CrossSellWidgetItem } from '@/widgets/cross-sell-widget'

import { asNumber, asString } from './ap56CrossSellParsers'
import type { Ap56ProductInfo } from './ap56CrossSellTypes'

interface Ap56RecommendationBadgeContext {
  index: number
  totalItems: number
}

export function createRecommendationBadgeField(
  context: Ap56RecommendationBadgeContext,
): Pick<CrossSellWidgetItem, 'recommendationBadge'> {
  const recommendationBadge = createRecommendationBadge(context)

  return recommendationBadge ? { recommendationBadge } : {}
}

export function createDiscountFields(
  product: Ap56ProductInfo,
): Pick<CrossSellWidgetItem, 'discountLabel' | 'originalPrice'> {
  const discountLabel = createDiscountLabel(product)

  if (!discountLabel) {
    return {}
  }

  const price = asNumber(product.Price)
  const salePrice = asNumber(product.SalePrice)

  if (
    typeof price === 'number' &&
    typeof salePrice === 'number' &&
    salePrice > price
  ) {
    return {
      originalPrice: salePrice,
      discountLabel,
    }
  }

  return {
    discountLabel,
  }
}

export function createInterestLabelField(
  product: Ap56ProductInfo,
): Pick<CrossSellWidgetItem, 'interestLabel'> {
  const clickCount = asNumber(product.ClickCount)

  if (typeof clickCount !== 'number' || clickCount <= 0) {
    return {}
  }

  return {
    interestLabel: `${formatInterestCount(clickCount)}人有興趣`,
  }
}

export function formatLocation(value: unknown) {
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

export function isVisibleRating(rating: number | undefined): rating is number {
  return typeof rating === 'number' && rating >= 3.5
}

export function formatRating(rating: number) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
    minimumFractionDigits: Number.isInteger(rating) ? 0 : 1,
  }).format(rating)
}

export function formatRatingLabel(rating: number) {
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

function createRecommendationBadge({
  index,
  totalItems,
}: Ap56RecommendationBadgeContext) {
  return createRecommendationBadgeByIndex(totalItems)[index]
}

function createDiscountLabel(product: Ap56ProductInfo) {
  const priceDiff = asNumber(product.PriceDiff)

  if (typeof priceDiff === 'number' && priceDiff > 0) {
    if (priceDiff < 10) {
      return '加購價'
    }

    return `折$${formatAmount(priceDiff)}`
  }

  const discount = asNumber(product.Discount)

  if (typeof discount === 'number' && discount > 0) {
    return `折扣 ${formatPercent(discount)}%`
  }

  return undefined
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

function formatPercent(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
  }).format(value)
}

function formatAmount(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompactCount(value: number) {
  if (value >= 1_000_000) {
    return `${formatCompactUnitValue(value / 1_000_000)}M`
  }

  if (value >= 1_000) {
    return `${formatCompactUnitValue(value / 1_000)}K`
  }

  return formatAmount(value)
}

function formatInterestCount(value: number) {
  return value >= 1_000 ? `${formatCompactCount(value)}+` : formatAmount(value)
}

function formatCompactUnitValue(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: value < 10 ? 1 : 0,
  }).format(value)
}
