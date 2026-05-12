import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import {
  createFlightOrderCrossSellApi,
  type FlightOrderCrossSellApiOptions,
} from '@/domains/flight-order-cross-sell'
import { cn } from '@/lib/utils'
import type { RequestClient } from '@/shared/request'
import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { FlightOrderCrossSell } from './FlightOrderCrossSell'
import type {
  FlightOrderCrossSellData,
  FlightOrderCrossSellProps,
} from './types'

export type FlightOrderCrossSellConnectedErrorMode = 'hidden' | 'message'

export interface FlightOrderCrossSellConnectedProps {
  baseUrl?: string
  data?: FlightOrderCrossSellData
  domainMode?: LiontravelDomainMode
  errorMode?: FlightOrderCrossSellConnectedErrorMode
  onSelectAddon?: FlightOrderCrossSellProps['onSelectAddon']
  onSelectItem?: FlightOrderCrossSellProps['onSelectItem']
  onViewMore?: FlightOrderCrossSellProps['onViewMore']
  orderNumber?: string
  requestClient?: RequestClient
}

//#region - Functions

const connectedWidgetRootProps = createWidgetRootProps(
  'flight-order-cross-sell-connected',
)

function createConnectedQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  })
}

//#endregion - Functions

//#region - Sub Components

function FlightOrderCrossSellConnectedContent({
  baseUrl,
  data,
  domainMode = 'production',
  errorMode = 'hidden',
  onSelectAddon,
  onSelectItem,
  onViewMore,
  orderNumber,
  requestClient,
}: FlightOrderCrossSellConnectedProps) {
  const apiOptions = useMemo<FlightOrderCrossSellApiOptions>(
    () => ({
      baseUrl,
      domainMode,
      requestClient,
    }),
    [baseUrl, domainMode, requestClient],
  )
  const api = useMemo(
    () => createFlightOrderCrossSellApi(apiOptions),
    [apiOptions],
  )
  const canLoadFromApi = !data && !!orderNumber
  const query = useQuery({
    enabled: canLoadFromApi,
    queryFn: ({ signal }) =>
      api.getByOrderNumber(orderNumber ?? '', { signal }),
    queryKey: [
      'flight-order-cross-sell',
      'connected',
      orderNumber,
      domainMode,
      baseUrl,
      requestClient ? 'custom-client' : 'default-client',
    ],
  })
  const resolvedData = data ?? query.data

  if (resolvedData) {
    return (
      <FlightOrderCrossSell
        data={resolvedData}
        onSelectAddon={onSelectAddon}
        onSelectItem={onSelectItem}
        onViewMore={onViewMore}
      />
    )
  }

  if (!canLoadFromApi) {
    return errorMode === 'message' ? (
      <ConnectedStateMessage message="缺少訂單編號，無法載入推薦內容。" />
    ) : null
  }

  if (query.isPending) {
    return <ConnectedLoadingState />
  }

  if (query.isError) {
    return errorMode === 'message' ? (
      <ConnectedStateMessage message="目前無法載入推薦內容，請稍後再試。" />
    ) : null
  }

  return null
}

function ConnectedLoadingState() {
  return (
    <section
      className="w-full bg-(--lion-gray-100) text-foreground"
      {...connectedWidgetRootProps}
    >
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 py-0">
        <div className="bg-background p-4 lion-desktop:rounded-(--lion-panel-radius) lion-desktop:p-6">
          <div className="h-5 w-42 animate-pulse rounded bg-(--lion-gray-100)" />
          <div className="mt-4 grid gap-3 lion-desktop:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                className="h-24 animate-pulse rounded-lg bg-(--lion-gray-100)"
                key={item}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ConnectedStateMessage({ message }: { message: string }) {
  return (
    <section
      className={cn(
        'w-full bg-(--lion-gray-100) p-4 text-foreground',
        'lion-desktop:bg-linear-to-b lion-desktop:from-(--lion-page-gradient-from) lion-desktop:to-(--lion-page-gradient-to)',
      )}
      {...connectedWidgetRootProps}
    >
      <div className="mx-auto w-full max-w-297.5 bg-background p-4 text-sm text-muted-foreground lion-desktop:rounded-(--lion-panel-radius)">
        {message}
      </div>
    </section>
  )
}

//#endregion - Sub Components

export function FlightOrderCrossSellConnected(
  props: FlightOrderCrossSellConnectedProps,
) {
  const [queryClient] = useState(createConnectedQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <FlightOrderCrossSellConnectedContent {...props} />
    </QueryClientProvider>
  )
}
