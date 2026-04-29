import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { HsrAddonBanner } from './components/addons/HsrAddonBanner'
import { ReminderCards } from './components/addons/ReminderCards'
import { PromoHeader } from './components/promo/PromoHeader'
import { AttractionDecorBanner } from './components/recommendations/AttractionDecorBanner'
import { CrossSellSection } from './components/recommendations/CrossSellSection'
import { getRemainingPromoSeconds } from './lib/countdown'
import type {
  FlightOrderCrossSellProps,
  FlightOrderCrossSellSection,
  FlightOrderCrossSellSectionKind,
} from './types'

const flightOrderCrossSellRootProps = createWidgetRootProps(
  'flight-order-cross-sell',
)

type SectionGroups = Record<
  FlightOrderCrossSellSectionKind,
  FlightOrderCrossSellSection[]
> & {
  other: FlightOrderCrossSellSection[]
}

function getFallbackSectionKind(
  section: FlightOrderCrossSellSection,
): FlightOrderCrossSellSectionKind | undefined {
  if (section.kind) {
    return section.kind
  }

  const sectionText = `${section.id} ${section.title}`.toLowerCase()

  if (sectionText.includes('hotel') || sectionText.includes('飯店')) {
    return 'hotel'
  }

  if (
    sectionText.includes('attraction') ||
    sectionText.includes('景點') ||
    sectionText.includes('票券')
  ) {
    return 'attraction'
  }

  if (
    sectionText.includes('transport') ||
    sectionText.includes('交通') ||
    sectionText.includes('transfer')
  ) {
    return 'transport'
  }

  if (sectionText.includes('flight') || sectionText.includes('機票')) {
    return 'flight'
  }

  return undefined
}

function groupSections(sections: FlightOrderCrossSellSection[]): SectionGroups {
  const groups: SectionGroups = {
    hotel: [],
    attraction: [],
    transport: [],
    flight: [],
    other: [],
  }

  sections.forEach((section) => {
    const kind = getFallbackSectionKind(section)

    if (kind) {
      groups[kind].push(section)
      return
    }

    groups.other.push(section)
  })

  return groups
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
  const sectionGroups = groupSections(data.sections)
  const showAttractionDecor =
    !!attractionDecor && sectionGroups.attraction.length > 0

  function renderSections(sections: FlightOrderCrossSellSection[]) {
    if (sections.length === 0) {
      return null
    }

    return (
      <div className="overflow-hidden rounded-none bg-background md:rounded-3xl">
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
      </div>
    )
  }

  return (
    <section
      className={cn(
        'w-full text-foreground',
        'bg-linear-to-b from-(--lion-header-gradient-from) to-(--lion-header-gradient-to)',
      )}
      data-promo-state={isPromoActive ? 'active' : 'expired'}
      {...flightOrderCrossSellRootProps}
    >
      <div className="h-4.5 w-full bg-background md:h-12.5" />
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 bg-background py-0 md:py-0">
        <PromoHeader
          isPromoActive={isPromoActive}
          promo={data.promo}
          remainingSeconds={remainingSeconds}
        />
        {renderSections(sectionGroups.hotel)}

        {hsrAddon ? (
          <div className="overflow-hidden rounded-none bg-background md:rounded-3xl">
            <HsrAddonBanner
              addon={hsrAddon}
              onSelectAddon={() => onSelectAddon?.({ addonId: hsrAddon.id })}
            />
          </div>
        ) : null}

        {sectionGroups.attraction.length > 0 ? (
          <div className="overflow-hidden rounded-none bg-background md:rounded-3xl">
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
          </div>
        ) : null}

        {renderSections(sectionGroups.transport)}
        {renderSections(sectionGroups.flight)}
        {renderSections(sectionGroups.other)}

        {data.reminders ? (
          <div className="overflow-hidden rounded-none bg-background md:rounded-3xl">
            <ReminderCards
              items={data.reminders.items}
              onSelectAddon={(addonId) => onSelectAddon?.({ addonId })}
              subtitle={data.reminders.subtitle}
              title={data.reminders.title}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
