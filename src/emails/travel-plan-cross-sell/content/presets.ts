import type { TravelPlanCrossSellEmailProps } from '../types'
import {
  createTravelPlanCrossSellEmailContent,
  type TravelPlanCrossSellLifecycle,
  type TravelPlanCrossSellSourceProduct,
} from './create-content'
import {
  defaultTravelPlanCrossSellAssetUrls,
  type TravelPlanCrossSellAssetUrls,
} from './shared-assets'

function createTravelPlanCrossSellPresetContent(
  lifecycle: TravelPlanCrossSellLifecycle,
  sourceProduct: TravelPlanCrossSellSourceProduct,
  assetUrls: TravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellEmailContent({
    assetUrls,
    lifecycle,
    sourceProduct,
  })
}

export function createFlightEstablishedCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellPresetContent(
    'established',
    'flight',
    assetUrls,
  )
}

export function createHotelEstablishedCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellPresetContent(
    'established',
    'hotel',
    assetUrls,
  )
}

export function createFlightInsuranceCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellPresetContent(
    'insurance',
    'flight',
    assetUrls,
  )
}

export function createFlightSalesCrossSellEmailContent(
  assetUrls: TravelPlanCrossSellAssetUrls = defaultTravelPlanCrossSellAssetUrls,
): TravelPlanCrossSellEmailProps {
  return createTravelPlanCrossSellPresetContent('sales', 'flight', assetUrls)
}

export const flightEstablishedCrossSellEmailContent =
  createFlightEstablishedCrossSellEmailContent()

export const hotelEstablishedCrossSellEmailContent =
  createHotelEstablishedCrossSellEmailContent()

export const flightInsuranceCrossSellEmailContent =
  createFlightInsuranceCrossSellEmailContent()

export const flightSalesCrossSellEmailContent =
  createFlightSalesCrossSellEmailContent()
