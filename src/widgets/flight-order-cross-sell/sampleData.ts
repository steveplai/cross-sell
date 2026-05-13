import { flightOrderCrossSellFallbackData } from './defaultData'
import type { FlightOrderCrossSellData } from './types'

// Storybook and tests use a clone so demo mutations never affect runtime defaults.
export const flightOrderCrossSellSampleData = JSON.parse(
  JSON.stringify(flightOrderCrossSellFallbackData),
) as FlightOrderCrossSellData
