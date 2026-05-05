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
  FlightOrderCrossSellReminder,
  FlightOrderCrossSellSection,
} from './types'

const flightOrderCrossSellRootProps = createWidgetRootProps(
  'flight-order-cross-sell',
)
const hsrAddonId = 'hsr'
const hsrAddonProductionHostname = 'vacation.liontravel.com'
const hsrAddonPathname = '/thsrdetail'
const visaPassportProductionHostname = 'visa.liontravel.com'
const visaPassportPathname = '/search'
const insuranceMailBody = [
  '要保人資訊',
  '姓名：',
  '居住地址：',
  '',
  '所有旅客資訊',
  '旅客1：',
  '身分證字號：',
  '生日：',
  '關係：',
].join('\n')

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
  const insuranceMailtoHref = createInsuranceMailtoHref(data)
  const visaPassportHref = createVisaPassportHref(data)
  const remainingSeconds = getRemainingPromoSeconds(data.promo, now)
  const isPromoActive = remainingSeconds > 0
  const attractionBannerOverrides = data.attractionBannerOverrides
  const sectionGroups = groupFlightOrderCrossSellSections(data.sections)

  function getRenderableSections(sections: FlightOrderCrossSellSection[]) {
    return sections.filter((section) => section.items.length > 0)
  }

  const renderableAttractionSections = getRenderableSections(
    sectionGroups.attraction,
  )

  function renderCrossSellSections(
    sections: FlightOrderCrossSellSection[],
    options: { hideTitle?: boolean; sectionClassName?: string } = {},
  ) {
    return (
      <div className="flex flex-col divide-y divide-(--lion-gray-50)">
        {sections.map((section) => (
          <CrossSellSection
            className={options.sectionClassName}
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

  function renderDefaultSectionPanel(sections: FlightOrderCrossSellSection[]) {
    const renderableSections = getRenderableSections(sections)

    if (renderableSections.length === 0) {
      return null
    }

    return (
      <ContentPanel>{renderCrossSellSections(renderableSections)}</ContentPanel>
    )
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
          ? renderCrossSellSections(renderableHotelSections)
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
            <div className="overflow-hidden bg-background">
              <AttractionDecorBanner
                contentOverrides={attractionBannerOverrides}
              />
              <div className="relative z-10 -mt-5 overflow-hidden rounded-t-[20px] bg-background lion-desktop:rounded-t-[24px]">
                {renderCrossSellSections(renderableAttractionSections, {
                  hideTitle: true,
                  sectionClassName: cn('pt-3 lion-desktop:pt-3.75'),
                })}
              </div>
            </div>
          </ContentPanel>
        ) : null}

        {renderDefaultSectionPanel(sectionGroups.transport)}
        {renderDefaultSectionPanel(sectionGroups.flight)}
        {renderDefaultSectionPanel(sectionGroups.other)}

        {data.reminders ? (
          <ContentPanel>
            <ReminderCards
              items={createReminderItems(data.reminders.items, {
                insuranceMailtoHref,
                visaPassportHref,
              })}
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

function createVisaPassportHref(data: FlightOrderCrossSellData) {
  const domainMode = resolveLiontravelDomainMode(
    data.domainMode,
    getCurrentHostname(),
  )

  if (!domainMode) {
    return undefined
  }

  return createLiontravelUrl({
    domainMode,
    pathname: visaPassportPathname,
    productionHostname: visaPassportProductionHostname,
    query: {
      Countrylicensing: 'TW',
    },
  })
}

function createInsuranceMailtoHref(data: FlightOrderCrossSellData) {
  const agentEmail = data.serviceAgent?.email?.trim()
  const orderYear = data.order?.orderYear
  const orderNumber = data.order?.orderNumber

  if (!agentEmail || !orderYear || !orderNumber) {
    return undefined
  }

  const subject = `加購保險【訂單編號: ${orderYear}-${orderNumber}】`
  const searchParams = [
    `subject=${encodeURIComponent(subject)}`,
    `body=${encodeURIComponent(insuranceMailBody)}`,
  ].join('&')

  return `mailto:${agentEmail}?${searchParams}`
}

function createReminderItems(
  items: FlightOrderCrossSellReminder[],
  options: { insuranceMailtoHref?: string; visaPassportHref?: string },
) {
  return items.map((item) => {
    if (item.icon === 'passport' && options.visaPassportHref) {
      return { ...item, href: options.visaPassportHref }
    }

    if (item.icon === 'insurance' && options.insuranceMailtoHref) {
      return { ...item, href: options.insuranceMailtoHref }
    }

    return item
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
