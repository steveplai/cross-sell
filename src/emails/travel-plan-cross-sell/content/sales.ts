import type { TravelPlanCrossSellEmailProps } from '../types'
import { createTravelPlanCrossSellEmailContent } from './create-content'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

export function createSalesCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle: 'sales',
    sourceProduct: 'flight',
  })
}

export const salesCrossSellEmailContent = createSalesCrossSellEmailContent()
