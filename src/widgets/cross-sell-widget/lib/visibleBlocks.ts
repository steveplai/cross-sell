import type {
  CrossSellWidgetBlockKey,
  CrossSellWidgetVisibleBlocks,
} from '../types'

export const crossSellWidgetBlockKeys = [
  'promoHeader',
  'hotel',
  'hsr',
  'attraction',
  'transport',
  'flight',
  'other',
  'reminders',
] as const satisfies readonly CrossSellWidgetBlockKey[]

export type CrossSellWidgetResolvedVisibleBlocks = Record<
  CrossSellWidgetBlockKey,
  boolean
>

export const defaultCrossSellWidgetVisibleBlocks = Object.fromEntries(
  crossSellWidgetBlockKeys.map((key) => [key, true]),
) as CrossSellWidgetResolvedVisibleBlocks

export function resolveCrossSellWidgetVisibleBlocks(
  visibleBlocks?: CrossSellWidgetVisibleBlocks,
): CrossSellWidgetResolvedVisibleBlocks {
  return {
    ...defaultCrossSellWidgetVisibleBlocks,
    ...visibleBlocks,
  }
}
