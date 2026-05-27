import type { TravelPlanCrossSellEmailProps } from '../types'
import { createTravelPlanCrossSellEmailContent } from './create-content'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

export function createOrderCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle: 'order-confirmation',
    sourceProduct: 'flight',
  })
}

export function createHotelOrderCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle: 'order-confirmation',
    sourceProduct: 'hotel',
  })
}

export const orderCrossSellEmailContent = createOrderCrossSellEmailContent()

export const hotelOrderCrossSellEmailContent =
  createHotelOrderCrossSellEmailContent()
