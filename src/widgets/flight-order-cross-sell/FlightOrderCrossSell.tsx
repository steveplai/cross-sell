import { type ReactNode, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import {
  createLiontravelUrl,
  resolveLiontravelDomainMode,
} from '@/shared/utils/liontravelUrl'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { HsrAddonBanner } from './components/addons/HsrAddonBanner'
import { ReminderCards } from './components/addons/ReminderCards'
import { PromoHeader } from './components/promo/PromoHeader'
import { AttractionDecorBanner } from './components/recommendations/AttractionDecorBanner'
import { CrossSellSection } from './components/recommendations/CrossSellSection'
import { getRemainingPromoSeconds } from './lib/countdown'
import { groupFlightOrderCrossSellSections } from './lib/groupSections'
import type {
  FlightOrderCrossSellData,
  FlightOrderCrossSellProps,
  FlightOrderCrossSellSection,
} from './types'

const flightOrderCrossSellRootProps = createWidgetRootProps(
  'flight-order-cross-sell',
)
const hsrAddonId = 'hsr'
const hsrAddonProductionHostname = 'vacation.liontravel.com'
const hsrAddonPathname = '/thsrdetail'

//#region - Sub Components

function ContentPanel({
  allowOverflow = false,
  children,
}: {
  allowOverflow?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-none lion-desktop:rounded-[10px]',
        allowOverflow ? 'overflow-visible' : 'overflow-hidden',
      )}
    >
      {children}
    </div>
  )
}

function FlightOrderCrossSellContent({
  data,
  onSelectAddon,
  onSelectItem,
  onViewMore,
  promoKey,
}: FlightOrderCrossSellProps & { promoKey: string }) {
  const now = useCurrentTime(promoKey)
  const locale = data.locale ?? 'zh-TW'
  const currency = data.currency ?? 'TWD'
  const hsrAddon = data.hsrAddon
  const hsrAddonHref = createHsrAddonHref(data)
  const remainingSeconds = getRemainingPromoSeconds(data.promo, now)
  const isPromoActive = remainingSeconds > 0
  const attractionDecor = data.attractionDecor
  const sectionGroups = groupFlightOrderCrossSellSections(data.sections)

  function getRenderableSections(sections: FlightOrderCrossSellSection[]) {
    return sections.filter((section) => section.items.length > 0)
  }

  const renderableAttractionSections = getRenderableSections(
    sectionGroups.attraction,
  )
  const showAttractionDecor =
    !!attractionDecor && renderableAttractionSections.length > 0

  function renderSectionList(
    sections: FlightOrderCrossSellSection[],
    options: { hideTitle?: boolean } = {},
  ) {
    return (
      <div className="flex flex-col divide-y divide-(--lion-gray-50)">
        {sections.map((section) => (
          <CrossSellSection
            currency={currency}
            hideTitle={options.hideTitle}
            isPromoActive={isPromoActive}
            key={section.id}
            locale={locale}
            onSelectItem={(item) =>
              onSelectItem?.({ item, sectionId: section.id })
            }
            onViewMore={() => onViewMore?.({ sectionId: section.id })}
            section={section}
          />
        ))}
      </div>
    )
  }

  function renderSections(sections: FlightOrderCrossSellSection[]) {
    const renderableSections = getRenderableSections(sections)

    if (renderableSections.length === 0) {
      return null
    }

    return <ContentPanel>{renderSectionList(renderableSections)}</ContentPanel>
  }

  function renderPromoHotelPanel() {
    const renderableHotelSections = getRenderableSections(sectionGroups.hotel)

    return (
      <ContentPanel allowOverflow>
        <PromoHeader
          isPromoActive={isPromoActive}
          promo={data.promo}
          remainingSeconds={remainingSeconds}
        />
        {renderableHotelSections.length > 0
          ? renderSectionList(renderableHotelSections)
          : null}
      </ContentPanel>
    )
  }

  return (
    <section
      className={cn(
        'w-full text-foreground',
        'bg-linear-to-b from-(--lion-page-gradient-from) to-(--lion-page-gradient-to)',
      )}
      data-promo-state={isPromoActive ? 'active' : 'expired'}
      {...flightOrderCrossSellRootProps}
    >
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 py-0 lion-desktop:py-0">
        {renderPromoHotelPanel()}

        <ContentPanel>
          <HsrAddonBanner
            addon={hsrAddon}
            href={hsrAddonHref}
            onSelectAddon={() =>
              onSelectAddon?.({ addonId: hsrAddon?.id ?? hsrAddonId })
            }
          />
        </ContentPanel>

        {renderableAttractionSections.length > 0 ? (
          <ContentPanel>
            <div className="flex flex-col divide-y divide-(--lion-gray-50)">
              {attractionDecor ? (
                <AttractionDecorBanner decor={attractionDecor} />
              ) : null}
              {renderSectionList(renderableAttractionSections, {
                hideTitle: showAttractionDecor,
              })}
            </div>
          </ContentPanel>
        ) : null}

        {renderSections(sectionGroups.transport)}
        {renderSections(sectionGroups.flight)}
        {renderSections(sectionGroups.other)}

        {data.reminders ? (
          <ContentPanel>
            <ReminderCards
              items={data.reminders.items}
              onSelectAddon={(addonId) => onSelectAddon?.({ addonId })}
              subtitle={data.reminders.subtitle}
              title={data.reminders.title}
            />
          </ContentPanel>
        ) : null}
      </div>
    </section>
  )
}

//#endregion - Sub Components

function createHsrAddonHref(data: FlightOrderCrossSellData) {
  const domainMode = resolveLiontravelDomainMode(
    data.domainMode,
    getCurrentHostname(),
  )

  if (!domainMode || !data.order?.orderYear || !data.order.orderNumber) {
    return undefined
  }

  return createLiontravelUrl({
    domainMode,
    pathname: hsrAddonPathname,
    productionHostname: hsrAddonProductionHostname,
    query: {
      sYear: data.order.orderYear,
      sOrdr: data.order.orderNumber,
    },
  })
}

function getCurrentHostname() {
  if (typeof window === 'undefined') {
    return undefined
  }

  return window.location.hostname
}

function useCurrentTime(promoKey: string) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [promoKey])

  return now
}

export function FlightOrderCrossSell({
  data,
  onSelectAddon,
  onSelectItem,
  onViewMore,
}: FlightOrderCrossSellProps) {
  const promoKey = `${data.promo.startsAt}:${data.promo.durationSeconds}`

  return (
    <FlightOrderCrossSellContent
      data={data}
      key={promoKey}
      onSelectAddon={onSelectAddon}
      onSelectItem={onSelectItem}
      onViewMore={onViewMore}
      promoKey={promoKey}
    />
  )
}
