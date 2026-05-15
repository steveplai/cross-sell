import type { RequestClient } from '@/shared/request'
import { createRequestClient } from '@/shared/request'
import {
  createLiontravelOrigin,
  type LiontravelDomainMode,
} from '@/shared/utils/liontravelUrl'

import { mapAp56CrossSellResponseToSections } from './ap56CrossSellMapper'
import type {
  Ap56CrossSellResponseEnvelope,
  Ap56CrossSellResponseSection,
} from './ap56CrossSellTypes'

export interface Ap56CrossSellApiOptions {
  apiBaseUrl?: string
  domainMode?: LiontravelDomainMode
  recommendProductTypes?: Ap56CrossSellRecommendProductTypes
  requestClient?: RequestClient
}

export type Ap56CrossSellRecommendProductTypes = string | string[]

const defaultRecommendProductTypes = 'htl,etk'
const ap56CrossSellProductionHostname = 'www.liontravel.com'
const ap56CrossSellEndpointPathname = '/category/_fringe/CrossSelling'

// Thin request adapter: choose the Lion Travel origin, call AP-56, and hand the
// raw payload to the mapper. UI-facing data shaping stays out of this file.
export function createAp56CrossSellApi({
  apiBaseUrl,
  domainMode = 'production',
  recommendProductTypes = defaultRecommendProductTypes,
  requestClient,
}: Ap56CrossSellApiOptions = {}) {
  const client =
    requestClient ??
    createRequestClient({
      baseUrl:
        apiBaseUrl ??
        createLiontravelOrigin(ap56CrossSellProductionHostname, domainMode),
    })

  return {
    async getByOrderNumber(orderNumber: string, init?: RequestInit) {
      const response = await client.get<
        Ap56CrossSellResponseEnvelope | Ap56CrossSellResponseSection[]
      >(createAp56CrossSellPath(orderNumber, recommendProductTypes), init)

      return mapAp56CrossSellResponseToSections(response)
    },
  }
}

export function createAp56CrossSellPath(
  orderNumber: string,
  recommendProductTypes: Ap56CrossSellRecommendProductTypes = defaultRecommendProductTypes,
) {
  const searchParams = new URLSearchParams({
    OrderNo: orderNumber,
    RecommendProductType: normalizeRecommendProductTypes(recommendProductTypes),
  })

  return `${ap56CrossSellEndpointPathname}?${searchParams.toString()}`
}

function normalizeRecommendProductTypes(
  recommendProductTypes: Ap56CrossSellRecommendProductTypes,
) {
  if (Array.isArray(recommendProductTypes)) {
    return recommendProductTypes.join(',')
  }

  return recommendProductTypes
}
