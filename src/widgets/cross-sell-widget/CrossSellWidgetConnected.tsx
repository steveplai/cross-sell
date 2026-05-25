import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
import { type ReactNode, useMemo, useState } from 'react'

import {
  type Ap56CrossSellApiOptions,
  type Ap56CrossSellRecommendProductTypes,
  createAp56CrossSellApi,
} from '@/domains/ap56-cross-sell'
import { cn } from '@/lib/utils'
import type { RequestClient } from '@/shared/request'
import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { CrossSellWidget } from './CrossSellWidget'
import { resolveCrossSellWidgetVisibleBlocks } from './lib/visibleBlocks'
import type {
  CrossSellWidgetContentOverrides,
  CrossSellWidgetOrder,
  CrossSellWidgetProps,
  CrossSellWidgetVisibleBlocks,
} from './types'

export type CrossSellWidgetConnectedErrorMode = 'hidden' | 'message'
export type CrossSellWidgetConnectedEnvironment = LiontravelDomainMode
export type CrossSellWidgetSourceProduct = 'flight' | 'hotel' | 'ticket'

export type CrossSellWidgetConnectedConfig = Omit<
  CrossSellWidgetContentOverrides,
  'domainMode' | 'serviceAgent'
>

export interface CrossSellWidgetConnectedProps extends CrossSellWidgetConnectedConfig {
  environment?: CrossSellWidgetConnectedEnvironment
  errorMode?: CrossSellWidgetConnectedErrorMode
  onSelectAddon?: CrossSellWidgetProps['onSelectAddon']
  onSelectItem?: CrossSellWidgetProps['onSelectItem']
  onViewMore?: CrossSellWidgetProps['onViewMore']
  orderNumber?: string
  promoDurationSeconds?: number
  promoStartsAt?: string
  recommendProductTypes?: Ap56CrossSellRecommendProductTypes
  sourceProduct?: CrossSellWidgetSourceProduct
  travelInsuranceContactEmail?: string
  visibleBlocks?: CrossSellWidgetVisibleBlocks
}

interface CrossSellWidgetConnectedInternalProps extends CrossSellWidgetConnectedProps {
  apiBaseUrl?: string
  requestClient?: RequestClient
}

//#region - Functions

const connectedWidgetRootProps = createWidgetRootProps(
  'cross-sell-widget-connected',
)
const visibleBlocksBySourceProduct: Record<
  CrossSellWidgetSourceProduct,
  CrossSellWidgetVisibleBlocks
> = {
  flight: {},
  hotel: {
    hotel: false,
    reminders: false,
  },
  ticket: {
    hotel: false,
    hsr: false,
    reminders: false,
  },
}

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
): CrossSellWidgetOrder | undefined {
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

function resolveConnectedVisibleBlocks(
  sourceProduct?: CrossSellWidgetSourceProduct,
  visibleBlocks?: CrossSellWidgetVisibleBlocks,
) {
  return resolveCrossSellWidgetVisibleBlocks({
    ...(sourceProduct ? visibleBlocksBySourceProduct[sourceProduct] : {}),
    ...visibleBlocks,
  })
}

//#endregion - Functions

//#region - Sub Components

function CrossSellWidgetConnectedContent({
  apiBaseUrl,
  currency,
  environment = 'production',
  errorMode = 'hidden',
  hsrAddon,
  locale,
  onSelectAddon,
  onSelectItem,
  onViewMore,
  orderDestination,
  orderNumber,
  promo,
  promoDurationSeconds,
  promoStartsAt,
  recommendProductTypes,
  reminders,
  requestClient,
  sectionContentOverrides,
  sourceProduct,
  travelInsuranceContactEmail,
  visibleBlocks,
}: CrossSellWidgetConnectedInternalProps) {
  const domainMode = environment
  const resolvedVisibleBlocks = useMemo(
    () => resolveConnectedVisibleBlocks(sourceProduct, visibleBlocks),
    [sourceProduct, visibleBlocks],
  )
  const resolvedPromo = useMemo(() => {
    if (!promo && !promoStartsAt && promoDurationSeconds === undefined) {
      return undefined
    }

    return {
      ...promo,
      ...(promoStartsAt ? { startsAt: promoStartsAt } : {}),
      ...(promoDurationSeconds === undefined
        ? {}
        : { durationSeconds: promoDurationSeconds }),
    }
  }, [promo, promoDurationSeconds, promoStartsAt])
  const apiOptions = useMemo<Ap56CrossSellApiOptions>(
    () => ({
      apiBaseUrl,
      domainMode,
      recommendProductTypes,
      requestClient,
    }),
    [apiBaseUrl, domainMode, recommendProductTypes, requestClient],
  )
  const api = useMemo(() => createAp56CrossSellApi(apiOptions), [apiOptions])
  const canLoadFromApi = !!orderNumber
  const query = useQuery({
    enabled: canLoadFromApi,
    queryFn: ({ signal }) =>
      api.getByOrderNumber(orderNumber ?? '', { signal }),
    queryKey: [
      'cross-sell-widget',
      'connected',
      orderNumber,
      domainMode,
      apiBaseUrl,
      recommendProductTypes,
      requestClient ? 'custom-client' : 'default-client',
    ],
  })

  if (query.data) {
    return (
      <CrossSellWidget
        currency={currency}
        domainMode={domainMode}
        hsrAddon={hsrAddon}
        locale={locale}
        onSelectAddon={onSelectAddon}
        onSelectItem={onSelectItem}
        onViewMore={onViewMore}
        orderDestination={orderDestination}
        order={createOrderFromExternalOrderNumber(orderNumber ?? '')}
        promo={resolvedPromo}
        reminders={reminders}
        sectionContentOverrides={sectionContentOverrides}
        sections={query.data}
        serviceAgent={
          travelInsuranceContactEmail
            ? { email: travelInsuranceContactEmail }
            : undefined
        }
        visibleBlocks={resolvedVisibleBlocks}
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

function CrossSellWidgetConnectedRoot(
  props: CrossSellWidgetConnectedInternalProps,
) {
  const [queryClient] = useState(createConnectedQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      <CrossSellWidgetConnectedContent {...props} />
    </QueryClientProvider>
  )
}

export function CrossSellWidgetConnected(props: CrossSellWidgetConnectedProps) {
  return <CrossSellWidgetConnectedRoot {...props} />
}

export function CrossSellWidgetConnectedForTesting(
  props: CrossSellWidgetConnectedInternalProps,
) {
  return <CrossSellWidgetConnectedRoot {...props} />
}
