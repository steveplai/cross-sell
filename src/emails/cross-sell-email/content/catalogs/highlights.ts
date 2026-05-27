import type { CrossSellEmailHighlight } from '../../types'
import type { CrossSellEmailAssetUrls } from '../shared-assets'

export type CrossSellEmailHighlightKey =
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
} satisfies Record<CrossSellEmailHighlightKey, HighlightCatalogItem>

export function createCrossSellEmailHighlights(
  keys: readonly CrossSellEmailHighlightKey[],
  assetUrls: CrossSellEmailAssetUrls,
): CrossSellEmailHighlight[] {
  return keys.map((key) => ({
    ...highlightCatalog[key],
    checkIconSrc: assetUrls.checkIconUrl,
  }))
}
