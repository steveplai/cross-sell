import { type ReactNode, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { HsrAddonBanner } from './components/addons/HsrAddonBanner'
import { ReminderCards } from './components/addons/ReminderCards'
import { PromoHeader } from './components/promo/PromoHeader'
import { AttractionDecorBanner } from './components/recommendations/AttractionDecorBanner'
import { CrossSellSection } from './components/recommendations/CrossSellSection'
import { getRemainingPromoSeconds } from './lib/countdown'
import { groupFlightOrderCrossSellSections } from './lib/groupSections'
import type {
  FlightOrderCrossSellProps,
  FlightOrderCrossSellSection,
} from './types'

const flightOrderCrossSellRootProps = createWidgetRootProps(
  'flight-order-cross-sell',
)

function ContentPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('overflow-hidden rounded-none md:rounded-[10px]', className)}
    >
      {children}
    </div>
  )
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
  const remainingSeconds = getRemainingPromoSeconds(data.promo, now)
  const isPromoActive = remainingSeconds > 0
  const attractionDecor = data.attractionDecor
  const sectionGroups = groupFlightOrderCrossSellSections(data.sections)
  const showAttractionDecor =
    !!attractionDecor && sectionGroups.attraction.length > 0

  function renderSectionList(sections: FlightOrderCrossSellSection[]) {
    return (
      <div className="flex flex-col divide-y divide-(--lion-gray-50)">
        {sections.map((section) => (
          <CrossSellSection
            currency={currency}
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
    if (sections.length === 0) {
      return null
    }

    return <ContentPanel>{renderSectionList(sections)}</ContentPanel>
  }

  function renderPromoHotelPanel() {
    return (
      <ContentPanel className="overflow-visible">
        <PromoHeader
          isPromoActive={isPromoActive}
          promo={data.promo}
          remainingSeconds={remainingSeconds}
        />
        {sectionGroups.hotel.length > 0
          ? renderSectionList(sectionGroups.hotel)
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
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 py-0 md:py-0">
        {renderPromoHotelPanel()}

        {hsrAddon ? (
          <ContentPanel>
            <HsrAddonBanner
              addon={hsrAddon}
              onSelectAddon={() => onSelectAddon?.({ addonId: hsrAddon.id })}
            />
          </ContentPanel>
        ) : null}

        {sectionGroups.attraction.length > 0 ? (
          <ContentPanel>
            <div className="flex flex-col divide-y divide-(--lion-gray-50)">
              {attractionDecor ? (
                <AttractionDecorBanner decor={attractionDecor} />
              ) : null}
              {sectionGroups.attraction.map((section) => (
                <CrossSellSection
                  currency={currency}
                  hideTitle={showAttractionDecor}
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
