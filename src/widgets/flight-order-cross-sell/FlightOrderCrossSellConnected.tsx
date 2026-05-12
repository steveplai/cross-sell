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
import { flightOrderCrossSellSampleData } from './sampleData'
import type {
  FlightOrderCrossSellData,
  FlightOrderCrossSellProps,
  FlightOrderCrossSellSection,
  FlightOrderCrossSellSectionKind,
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
  recommendProductTypes?: FlightOrderCrossSellRecommendProductTypes
  requestClient?: RequestClient
}

//#region - Functions

const connectedWidgetRootProps = createWidgetRootProps(
  'flight-order-cross-sell-connected',
)
const apiBackedSectionKinds = new Set<FlightOrderCrossSellSectionKind>([
  'hotel',
  'attraction',
  'transport',
])

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

function createStaticBaseDataWithApiSections(
  apiSections: FlightOrderCrossSellSection[],
): FlightOrderCrossSellData {
  const baseData = JSON.parse(
    JSON.stringify(flightOrderCrossSellSampleData),
  ) as FlightOrderCrossSellData
  const apiSectionsByKind = new Map<
    FlightOrderCrossSellSectionKind,
    FlightOrderCrossSellSection
  >()

  apiSections.forEach((section) => {
    if (section.kind) {
      apiSectionsByKind.set(section.kind, section)
    }
  })

  return {
    ...baseData,
    sections: baseData.sections.map((section) => {
      if (!section.kind || !apiBackedSectionKinds.has(section.kind)) {
        return section
      }

      const apiSection = apiSectionsByKind.get(section.kind)

      return {
        ...section,
        categories: apiSection?.categories,
        items: apiSection?.items ?? [],
        viewMoreHref: apiSection?.viewMoreHref,
      }
    }),
  }
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
  recommendProductTypes,
  requestClient,
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
      recommendProductTypes,
      requestClient ? 'custom-client' : 'default-client',
    ],
  })
  const resolvedData =
    data ??
    (query.data ? createStaticBaseDataWithApiSections(query.data) : undefined)

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
