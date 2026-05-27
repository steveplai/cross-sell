import type { TravelPlanCrossSellHighlight } from '../../types'
import type { TravelPlanCrossSellAssetUrls } from '../shared-assets'

export type TravelPlanCrossSellHighlightKey =
  | 'flightHotelFreeCancel'
  | 'hotelDiscount'
  | 'railDiscount'

interface HighlightCatalogItem {
  id: string
  label?: string
  text: string
}

const highlightCatalog = {
  flightHotelFreeCancel: {
    id: 'hotel-cancel',
    text: '航班異動可免費取消住宿',
  },
  hotelDiscount: {
    id: 'hotel-discount',
    label: '加購優惠',
    text: '訂房最高可省 25%',
  },
  railDiscount: {
    id: 'rail-discount',
    text: '加購高鐵享8折',
  },
} satisfies Record<TravelPlanCrossSellHighlightKey, HighlightCatalogItem>

export function createTravelPlanCrossSellHighlights(
  keys: readonly TravelPlanCrossSellHighlightKey[],
  assetUrls: TravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellHighlight[] {
  return keys.map((key) => ({
    ...highlightCatalog[key],
    checkIconSrc: assetUrls.checkIconUrl,
  }))
}
