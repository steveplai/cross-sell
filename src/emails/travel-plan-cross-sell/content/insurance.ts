import type { TravelPlanCrossSellEmailProps } from '../types'
import { createTravelPlanCrossSellEmailContent } from './create-content'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

export function createInsuranceCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle: 'insurance',
    sourceProduct: 'flight',
  })
}

export const insuranceCrossSellEmailContent =
  createInsuranceCrossSellEmailContent()
