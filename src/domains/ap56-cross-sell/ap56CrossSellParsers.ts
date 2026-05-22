import type { Ap56ProductInfo } from './ap56CrossSellTypes'

export function asString(value: unknown) {
  // Treat blank API strings like missing data so optional UI fragments disappear
  // instead of rendering empty badges or links.
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

export function asNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string' || !value.trim()) {
    return undefined
  }

  const parsed = Number(value)

  return Number.isFinite(parsed) ? parsed : undefined
}

export function firstString(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined
  }

  return value.map(asString).find((item): item is string => !!item)
}

export function getFirstUrl(products: Ap56ProductInfo[]) {
  for (const product of products) {
    const url = asString(product.url) ?? asString(product.ProductUrl)

    if (url) {
      return url
    }
  }

  return undefined
}
