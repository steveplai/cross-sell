import type { TravelPlanCrossSellEmailProps } from '../types'
import { createTravelPlanCrossSellEmailContent } from './create-content'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

export function createFlightEstablishedCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle: 'established',
    sourceProduct: 'flight',
  })
}

export function createHotelEstablishedCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle: 'established',
    sourceProduct: 'hotel',
  })
}

export const flightEstablishedCrossSellEmailContent =
  createFlightEstablishedCrossSellEmailContent()

export const hotelEstablishedCrossSellEmailContent =
  createHotelEstablishedCrossSellEmailContent()
