import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { type ReactNode, useMemo, useState } from 'react'

import {
  createFlightOrderCrossSellApi,
  type FlightOrderCrossSellApiOptions,
  type FlightOrderCrossSellRecommendProductTypes,
} from '@/domains/flight-order-cross-sell'
import { cn } from '@/lib/utils'
import type { RequestClient } from '@/shared/request'
import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { FlightOrderCrossSell } from './FlightOrderCrossSell'
import type {
  FlightOrderCrossSellContentOverrides,
  FlightOrderCrossSellOrder,
  FlightOrderCrossSellProps,
} from './types'

export type FlightOrderCrossSellConnectedErrorMode = 'hidden' | 'message'

export interface FlightOrderCrossSellConnectedProps extends FlightOrderCrossSellContentOverrides {
  baseUrl?: string
  domainMode?: LiontravelDomainMode
  errorMode?: FlightOrderCrossSellConnectedErrorMode
  onSelectAddon?: FlightOrderCrossSellProps['onSelectAddon']
  onSelectItem?: FlightOrderCrossSellProps['onSelectItem']
  onViewMore?: FlightOrderCrossSellProps['onViewMore']
  orderNumber?: string
  recommendProductTypes?: FlightOrderCrossSellRecommendProductTypes
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

function createOrderFromExternalOrderNumber(
  orderNumber: string,
): FlightOrderCrossSellOrder | undefined {
  const normalizedOrderNumber = orderNumber.trim()

  if (!normalizedOrderNumber) {
    return undefined
  }

  const separatorIndex = normalizedOrderNumber.indexOf('-')

  if (separatorIndex > 0) {
    const orderYear = normalizedOrderNumber.slice(0, separatorIndex)
    const orderNumberWithoutYear = normalizedOrderNumber.slice(
      separatorIndex + 1,
    )

    if (/^\d{4}$/.test(orderYear) && orderNumberWithoutYear) {
      return {
        orderYear,
        orderNumber: orderNumberWithoutYear,
      }
    }
  }

  return {
    orderYear: createDefaultOrderYear(normalizedOrderNumber),
    orderNumber: normalizedOrderNumber,
  }
}

function createDefaultOrderYear(orderNumber: string) {
  const leadingYear = orderNumber.slice(0, 4)

  if (/^(19|20)\d{2}$/.test(leadingYear)) {
    return leadingYear
  }

  return new Date().getFullYear().toString()
}

//#endregion - Functions

//#region - Sub Components

function FlightOrderCrossSellConnectedContent({
  attractionBannerOverrides,
  baseUrl,
  currency,
  domainMode = 'production',
  errorMode = 'hidden',
  hsrAddon,
  locale,
  onSelectAddon,
  onSelectItem,
  onViewMore,
  orderNumber,
  promo,
  recommendProductTypes,
  reminders,
  requestClient,
  serviceAgent,
}: FlightOrderCrossSellConnectedProps) {
  const apiOptions = useMemo<FlightOrderCrossSellApiOptions>(
    () => ({
      baseUrl,
      domainMode,
      recommendProductTypes,
      requestClient,
    }),
    [baseUrl, domainMode, recommendProductTypes, requestClient],
  )
  const api = useMemo(
    () => createFlightOrderCrossSellApi(apiOptions),
    [apiOptions],
  )
  const canLoadFromApi = !!orderNumber
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
      recommendProductTypes,
      requestClient ? 'custom-client' : 'default-client',
    ],
  })

  if (query.data) {
    return (
      <FlightOrderCrossSell
        attractionBannerOverrides={attractionBannerOverrides}
        currency={currency}
        domainMode={domainMode}
        hsrAddon={hsrAddon}
        locale={locale}
        onSelectAddon={onSelectAddon}
        onSelectItem={onSelectItem}
        onViewMore={onViewMore}
        order={createOrderFromExternalOrderNumber(orderNumber ?? '')}
        promo={promo}
        reminders={reminders}
        sections={query.data}
        serviceAgent={serviceAgent}
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

function ConnectedStateShell({ children }: { children: ReactNode }) {
  return (
    <section
      className={cn(
        'flex w-full items-center justify-center bg-(--lion-gray-100) px-4 py-6 text-foreground',
        'lion-desktop:bg-linear-to-b lion-desktop:from-(--lion-page-gradient-from) lion-desktop:to-(--lion-page-gradient-to)',
      )}
      {...connectedWidgetRootProps}
    >
      <div className="mx-auto w-full max-w-297.5">{children}</div>
    </section>
  )
}

function ConnectedLoadingState() {
  return (
    <ConnectedStateShell>
      <div className="rounded-(--lion-panel-radius) border border-border bg-background p-4 shadow-sm lion-desktop:p-6">
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
    </ConnectedStateShell>
  )
}

function ConnectedStateMessage({ message }: { message: string }) {
  return (
    <ConnectedStateShell>
      <div className="rounded-(--lion-panel-radius) border border-border bg-background p-4 text-center text-sm text-muted-foreground shadow-sm">
        {message}
      </div>
    </ConnectedStateShell>
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
