import type { RequestClient } from '@/shared/request'
import { createRequestClient } from '@/shared/request'
import {
  createLiontravelOrigin,
  type LiontravelDomainMode,
} from '@/shared/utils/liontravelUrl'

import { mapAp56CrossSellingResponseToSections } from './ap56CrossSellingMapper'
import type {
  Ap56CrossSellingResponseEnvelope,
  Ap56CrossSellingResponseSection,
} from './ap56CrossSellingTypes'

export interface FlightOrderCrossSellApiOptions {
  apiBaseUrl?: string
  domainMode?: LiontravelDomainMode
  recommendProductTypes?: FlightOrderCrossSellRecommendProductTypes
  requestClient?: RequestClient
}

export type FlightOrderCrossSellRecommendProductTypes = string | string[]

const defaultRecommendProductTypes = 'htl,etk'
const flightOrderCrossSellProductionHostname = 'www.liontravel.com'
const flightOrderCrossSellEndpointPathname = '/category/_fringe/CrossSelling'

// Thin request adapter: choose the Lion Travel origin, call AP-56, and hand the
// raw payload to the mapper. UI-facing data shaping stays out of this file.
export function createFlightOrderCrossSellApi({
  apiBaseUrl,
  domainMode = 'production',
  recommendProductTypes = defaultRecommendProductTypes,
  requestClient,
}: FlightOrderCrossSellApiOptions = {}) {
  const client =
    requestClient ??
    createRequestClient({
      baseUrl:
        apiBaseUrl ??
        createLiontravelOrigin(
          flightOrderCrossSellProductionHostname,
          domainMode,
        ),
    })

  return {
    async getByOrderNumber(orderNumber: string, init?: RequestInit) {
      const response = await client.get<
        Ap56CrossSellingResponseEnvelope | Ap56CrossSellingResponseSection[]
      >(
        createFlightOrderCrossSellPath(orderNumber, recommendProductTypes),
        init,
      )

      return mapAp56CrossSellingResponseToSections(response)
    },
  }
}

export function createFlightOrderCrossSellPath(
  orderNumber: string,
  recommendProductTypes: FlightOrderCrossSellRecommendProductTypes = defaultRecommendProductTypes,
) {
  const searchParams = new URLSearchParams({
    OrderNo: orderNumber,
    RecommendProductType: normalizeRecommendProductTypes(recommendProductTypes),
  })

  return `${flightOrderCrossSellEndpointPathname}?${searchParams.toString()}`
}

function normalizeRecommendProductTypes(
  recommendProductTypes: FlightOrderCrossSellRecommendProductTypes,
) {
  if (Array.isArray(recommendProductTypes)) {
    return recommendProductTypes.join(',')
  }

  return recommendProductTypes
}
