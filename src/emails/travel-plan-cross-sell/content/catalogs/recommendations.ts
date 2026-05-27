import type { TravelPlanCrossSellRecommendation } from '../../types'
import type { TravelPlanCrossSellAssetUrls } from '../shared-assets'
import type { TravelPlanCrossSellLinkProfileKey } from './links'
import { createTravelPlanCrossSellUrl } from './links'

export type TravelPlanCrossSellRecommendationSetKey =
  | 'tokyoHotels'
  | 'tokyoTransportation'

interface CreateRecommendationSetOptions {
  assetUrls: TravelPlanCrossSellAssetUrls
  linkProfileKey: TravelPlanCrossSellLinkProfileKey
}

export function createTravelPlanCrossSellRecommendations(
  key: TravelPlanCrossSellRecommendationSetKey,
  options: CreateRecommendationSetOptions,
): TravelPlanCrossSellRecommendation[] {
  if (key === 'tokyoHotels') {
    return createTokyoHotelRecommendations(options)
  }

  return createTokyoTransportationRecommendations(options)
}

function createTokyoTransportationRecommendations({
  assetUrls,
  linkProfileKey,
}: CreateRecommendationSetOptions): TravelPlanCrossSellRecommendation[] {
  return [
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '日本-東京成田/羽田機場至東京市區/郊區 | 機場接送專車',
      url: createTravelPlanCrossSellUrl(
        linkProfileKey,
        'transportationRecommendation',
        'airport-transfer',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '日本-東京地鐵乘車券 Tokyo Subway Ticket',
      url: createTravelPlanCrossSellUrl(
        linkProfileKey,
        'transportationRecommendation',
        'tokyo-subway-ticket',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '日本-京成電鐵Skyliner特急券| 東京成田機場往返上野・日暮里',
      url: createTravelPlanCrossSellUrl(
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
}: CreateRecommendationSetOptions): TravelPlanCrossSellRecommendation[] {
  return [
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: 'OMO5 東京大塚 by 星野集團',
      url: createTravelPlanCrossSellUrl(
        linkProfileKey,
        'hotelRecommendation',
        'omo5-tokyo-otsuka',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: '淺草田原町站前APA飯店',
      url: createTravelPlanCrossSellUrl(
        linkProfileKey,
        'hotelRecommendation',
        'apa-asakusa-tawaramachi',
      ),
    },
    {
      arrowIconUrl: assetUrls.arrowIconUrl,
      text: 'Super Hotel 淺草',
      url: createTravelPlanCrossSellUrl(
        linkProfileKey,
        'hotelRecommendation',
        'super-hotel-asakusa',
      ),
    },
  ]
}
