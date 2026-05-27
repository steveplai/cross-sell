import type { CrossSellEmailRecommendation } from '../../types'
import type { CrossSellEmailAssetUrls } from '../shared-assets'
import type { CrossSellEmailLinkProfileKey } from './links'
import { createCrossSellEmailUrl } from './links'

export type CrossSellEmailRecommendationSetKey =
  | 'tokyoHotels'
  | 'tokyoTransportation'

interface CreateRecommendationSetOptions {
  assetUrls: CrossSellEmailAssetUrls
  linkProfileKey: CrossSellEmailLinkProfileKey
}

export function createCrossSellEmailRecommendations(
  key: CrossSellEmailRecommendationSetKey,
  options: CreateRecommendationSetOptions,
): CrossSellEmailRecommendation[] {
  if (key === 'tokyoHotels') {
    return createTokyoHotelRecommendations(options)
  }

  return createTokyoTransportationRecommendations(options)
}

function createTokyoTransportationRecommendations({
  assetUrls,
  linkProfileKey,
}: CreateRecommendationSetOptions): CrossSellEmailRecommendation[] {
  return [
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
      url: createCrossSellEmailUrl(
        linkProfileKey,
        'transportationRecommendation',
        'airport-transfer',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '日本-東京地鐵乘車券 Tokyo Subway Ticket',
      url: createCrossSellEmailUrl(
        linkProfileKey,
        'transportationRecommendation',
        'tokyo-subway-ticket',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '日本-京成電鐵Skyliner特急券| 東京成田機場往返上野・日暮里',
      url: createCrossSellEmailUrl(
        linkProfileKey,
        'transportationRecommendation',
        'keisei-skyliner',
      ),
    },
  ]
}

function createTokyoHotelRecommendations({
  assetUrls,
  linkProfileKey,
}: CreateRecommendationSetOptions): CrossSellEmailRecommendation[] {
  return [
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: 'OMO5 東京大塚 by 星野集團',
      url: createCrossSellEmailUrl(
        linkProfileKey,
        'hotelRecommendation',
        'omo5-tokyo-otsuka',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '淺草田原町站前APA飯店',
      url: createCrossSellEmailUrl(
        linkProfileKey,
        'hotelRecommendation',
        'apa-asakusa-tawaramachi',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: 'Super Hotel 淺草',
      url: createCrossSellEmailUrl(
        linkProfileKey,
        'hotelRecommendation',
        'super-hotel-asakusa',
      ),
    },
  ]
}
