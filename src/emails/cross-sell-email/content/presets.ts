import type { CrossSellEmailProps } from '../types'
import {
  createCrossSellEmailContent,
  type CrossSellEmailScenario,
  type CrossSellEmailSourceProductLine,
} from './create-content'
import {
  type CrossSellEmailAssetUrls,
  defaultCrossSellEmailAssetUrls,
} from './shared-assets'

function createCrossSellEmailPresetContent(
  scenario: CrossSellEmailScenario,
  sourceProductLine: CrossSellEmailSourceProductLine,
  assetUrls: CrossSellEmailAssetUrls,
): CrossSellEmailProps {
  return createCrossSellEmailContent({
    assetUrls,
    scenario,
    sourceProductLine,
  })
}

export function createFlightEstablishedCrossSellEmailContent(
  assetUrls: CrossSellEmailAssetUrls = defaultCrossSellEmailAssetUrls,
): CrossSellEmailProps {
  return createCrossSellEmailPresetContent('established', 'flight', assetUrls)
}

export function createHotelEstablishedCrossSellEmailContent(
  assetUrls: CrossSellEmailAssetUrls = defaultCrossSellEmailAssetUrls,
): CrossSellEmailProps {
  return createCrossSellEmailPresetContent('established', 'hotel', assetUrls)
}

export function createFlightInsuranceCrossSellEmailContent(
  assetUrls: CrossSellEmailAssetUrls = defaultCrossSellEmailAssetUrls,
): CrossSellEmailProps {
  return createCrossSellEmailPresetContent('insurance', 'flight', assetUrls)
}

export function createFlightSalesCrossSellEmailContent(
  assetUrls: CrossSellEmailAssetUrls = defaultCrossSellEmailAssetUrls,
): CrossSellEmailProps {
  return createCrossSellEmailPresetContent('sales', 'flight', assetUrls)
}

export function createHotelSalesCrossSellEmailContent(
  assetUrls: CrossSellEmailAssetUrls = defaultCrossSellEmailAssetUrls,
): CrossSellEmailProps {
  return createCrossSellEmailPresetContent('sales', 'hotel', assetUrls)
}

export const flightEstablishedCrossSellEmailContent =
  createFlightEstablishedCrossSellEmailContent()

export const hotelEstablishedCrossSellEmailContent =
  createHotelEstablishedCrossSellEmailContent()

export const flightInsuranceCrossSellEmailContent =
  createFlightInsuranceCrossSellEmailContent()

export const flightSalesCrossSellEmailContent =
  createFlightSalesCrossSellEmailContent()

export const hotelSalesCrossSellEmailContent =
  createHotelSalesCrossSellEmailContent()
