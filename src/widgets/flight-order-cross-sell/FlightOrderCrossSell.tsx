import { useEffect, useState } from 'react'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { CrossSellSection } from './components/CrossSellSection'
import { HsrAddonBanner } from './components/HsrAddonBanner'
import { PromoHeader } from './components/PromoHeader'
import { ReminderCards } from './components/ReminderCards'
import { getRemainingPromoSeconds } from './countdown'
import type { FlightOrderCrossSellProps } from './types'

const flightOrderCrossSellRootProps = createWidgetRootProps(
  'flight-order-cross-sell',
)

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
  onPromoClick,
  onSelectAddon,
  onSelectItem,
  onViewMore,
}: FlightOrderCrossSellProps) {
  const promoKey = `${data.promo.startsAt}:${data.promo.durationSeconds}`

  return (
    <FlightOrderCrossSellContent
      data={data}
      key={promoKey}
      onPromoClick={onPromoClick}
      onSelectAddon={onSelectAddon}
      onSelectItem={onSelectItem}
      onViewMore={onViewMore}
      promoKey={promoKey}
    />
  )
}

function FlightOrderCrossSellContent({
  data,
  onPromoClick,
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

  return (
    <section
      className="w-full bg-[#fff8f4] text-[#222]"
      data-promo-state={isPromoActive ? 'active' : 'expired'}
      {...flightOrderCrossSellRootProps}
    >
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 py-0 md:py-0">
        <div className="overflow-hidden rounded-none bg-white md:rounded-[10px]">
          <PromoHeader
            isPromoActive={isPromoActive}
            onPromoClick={() => onPromoClick?.({ promoId: data.promo.id })}
            promo={data.promo}
            remainingSeconds={remainingSeconds}
          />

          <div className="flex flex-col divide-y divide-[#f4f4f4]">
            {data.sections.map((section) => (
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

        {hsrAddon ? (
          <div className="overflow-hidden rounded-none bg-white md:rounded-[10px]">
            <HsrAddonBanner
              addon={hsrAddon}
              onSelectAddon={() => onSelectAddon?.({ addonId: hsrAddon.id })}
            />
          </div>
        ) : null}

        {data.reminders ? (
          <div className="overflow-hidden rounded-none bg-white md:rounded-[10px]">
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
