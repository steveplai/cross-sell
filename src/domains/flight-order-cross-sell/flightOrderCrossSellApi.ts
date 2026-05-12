import type { RequestClient } from '@/shared/request'
import { createRequestClient } from '@/shared/request'
import {
  createLiontravelOrigin,
  type LiontravelDomainMode,
} from '@/shared/utils/liontravelUrl'
import type { FlightOrderCrossSellData } from '@/widgets/flight-order-cross-sell'

export interface FlightOrderCrossSellApiOptions {
  baseUrl?: string
  domainMode?: LiontravelDomainMode
  requestClient?: RequestClient
}

interface FlightOrderCrossSellResponse {
  data: FlightOrderCrossSellData
}

const flightOrderCrossSellProductionHostname = 'www.liontravel.com'
const flightOrderCrossSellEndpointTemplate =
  '/api/flight-orders/{orderNumber}/cross-sell'

export function createFlightOrderCrossSellApi({
  baseUrl,
  domainMode = 'production',
  requestClient,
}: FlightOrderCrossSellApiOptions = {}) {
  const client =
    requestClient ??
    createRequestClient({
      baseUrl:
        baseUrl ??
        createLiontravelOrigin(
          flightOrderCrossSellProductionHostname,
          domainMode,
        ),
    })

  return {
    async getByOrderNumber(orderNumber: string, init?: RequestInit) {
      const response = await client.get<FlightOrderCrossSellResponse>(
        createFlightOrderCrossSellPath(orderNumber),
        init,
      )

      return response.data
    },
  }
}

export function createFlightOrderCrossSellPath(orderNumber: string) {
  return flightOrderCrossSellEndpointTemplate.replace(
    '{orderNumber}',
    encodeURIComponent(orderNumber),
  )
}
