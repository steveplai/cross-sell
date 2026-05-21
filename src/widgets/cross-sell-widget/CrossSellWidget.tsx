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
import { AttractionRecommendationsPanel } from './components/recommendations/AttractionRecommendationsPanel'
import { CrossSellSectionList } from './components/recommendations/CrossSellSectionList'
import {
  createCrossSellWidgetSectionContentDefaults,
  crossSellWidgetDefaultData,
} from './defaultData'
import { getRemainingPromoSeconds } from './lib/countdown'
import { groupCrossSellWidgetSections } from './lib/groupSections'
import type {
  CrossSellWidgetData,
  CrossSellWidgetProps,
  CrossSellWidgetReminder,
  CrossSellWidgetResolvedSection,
  CrossSellWidgetSection,
  CrossSellWidgetSectionContentOverridesByKind,
} from './types'

const crossSellWidgetRootProps = createWidgetRootProps('cross-sell-widget')
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
        'rounded-none lion-desktop:rounded-(--lion-panel-radius)',
        allowOverflow ? 'overflow-visible' : 'overflow-hidden',
      )}
    >
      {children}
    </div>
  )
}

function CrossSellWidgetContent({
  data,
  onSelectAddon,
  onSelectItem,
  onViewMore,
  promoKey,
}: Pick<
  CrossSellWidgetProps,
  'onSelectAddon' | 'onSelectItem' | 'onViewMore'
> & {
  data: CrossSellWidgetData
  promoKey: string
}) {
  const now = useCurrentTime(promoKey)
  const locale = data.locale ?? 'zh-TW'
  const currency = data.currency ?? 'TWD'
  const hsrAddon = data.hsrAddon
  const hsrAddonHref = createHsrAddonHref(data)
  const insuranceMailtoHref = createInsuranceMailtoHref(data)
  const visaPassportHref = createVisaPassportHref(data)
  const remainingSeconds = getRemainingPromoSeconds(data.promo, now)
  const isPromoActive = remainingSeconds > 0
  const sectionGroups = groupCrossSellWidgetSections(data.sections)

  function getRenderableSections(sections: CrossSellWidgetResolvedSection[]) {
    return sections.filter((section) => section.items.length > 0)
  }

  const renderableAttractionSections = getRenderableSections(
    sectionGroups.attraction,
  )

  function renderDefaultSectionPanel(
    sections: CrossSellWidgetResolvedSection[],
  ) {
    const renderableSections = getRenderableSections(sections)

    if (renderableSections.length === 0) {
      return null
    }

    return (
      <ContentPanel>
        <CrossSellSectionList
          currency={currency}
          isPromoActive={isPromoActive}
          locale={locale}
          onSelectItem={onSelectItem}
          onViewMore={onViewMore}
          sections={renderableSections}
        />
      </ContentPanel>
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
        {renderableHotelSections.length > 0 ? (
          <CrossSellSectionList
            currency={currency}
            isPromoActive={isPromoActive}
            locale={locale}
            onSelectItem={onSelectItem}
            onViewMore={onViewMore}
            sections={renderableHotelSections}
          />
        ) : null}
      </ContentPanel>
    )
  }

  return (
    <section
      className={cn(
        'w-full bg-(--lion-gray-100) text-foreground',
        'lion-desktop:bg-linear-to-b lion-desktop:from-(--lion-page-gradient-from) lion-desktop:to-(--lion-page-gradient-to)',
      )}
      data-promo-state={isPromoActive ? 'active' : 'expired'}
      {...crossSellWidgetRootProps}
    >
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 py-0 lion-desktop:py-0">
        {renderPromoHotelPanel()}

        <ContentPanel>
          <HsrAddonBanner
            addon={hsrAddon}
            href={hsrAddonHref}
            onSelectAddon={() =>
              onSelectAddon?.({ addonId: hsrAddon.id ?? hsrAddonId })
            }
          />
        </ContentPanel>

        {renderableAttractionSections.length > 0 ? (
          <ContentPanel>
            <AttractionRecommendationsPanel
              currency={currency}
              isPromoActive={isPromoActive}
              locale={locale}
              onSelectItem={onSelectItem}
              onViewMore={onViewMore}
              sections={renderableAttractionSections}
            />
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

//#region - Functions

function createHsrAddonHref(data: CrossSellWidgetData) {
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

function createVisaPassportHref(data: CrossSellWidgetData) {
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

function createInsuranceMailtoHref(data: CrossSellWidgetData) {
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
  items: CrossSellWidgetReminder[],
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

function resolveCrossSellWidgetSections(
  sections: CrossSellWidgetSection[],
  orderDestination?: string,
  sectionContentOverrides?: CrossSellWidgetSectionContentOverridesByKind,
): CrossSellWidgetResolvedSection[] {
  const sectionContentDefaults =
    createCrossSellWidgetSectionContentDefaults(orderDestination)

  return sections.map((section) => {
    if (!section.kind) {
      const title = section.title ?? section.id
      const viewMoreLabel = section.viewMoreLabel ?? title

      return {
        ...section,
        title,
        viewMoreLabel,
        viewMorePlaceholderLabel:
          section.viewMorePlaceholderLabel ?? viewMoreLabel,
      }
    }

    const defaultContent = sectionContentDefaults[section.kind] ?? {}
    const overrideContent = sectionContentOverrides?.[section.kind]
    const title =
      overrideContent?.title ?? section.title ?? defaultContent.title
    const viewMoreLabel =
      overrideContent?.viewMoreLabel ??
      section.viewMoreLabel ??
      defaultContent.viewMoreLabel ??
      title ??
      section.id

    return {
      ...section,
      subtitle:
        overrideContent?.subtitle ??
        section.subtitle ??
        defaultContent?.subtitle,
      title: title ?? section.id,
      viewMoreLabel,
      viewMorePlaceholderLabel:
        overrideContent?.viewMorePlaceholderLabel ??
        section.viewMorePlaceholderLabel ??
        defaultContent.viewMorePlaceholderLabel ??
        viewMoreLabel,
    }
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

//#endregion - Functions

export function CrossSellWidget({
  currency,
  domainMode,
  hsrAddon,
  locale,
  onSelectAddon,
  onSelectItem,
  onViewMore,
  order,
  orderDestination,
  promo,
  reminders,
  sectionContentOverrides,
  sections,
  serviceAgent,
}: CrossSellWidgetProps) {
  const data: CrossSellWidgetData = {
    ...crossSellWidgetDefaultData,
    currency: currency ?? crossSellWidgetDefaultData.currency,
    domainMode: domainMode ?? crossSellWidgetDefaultData.domainMode,
    hsrAddon: {
      ...crossSellWidgetDefaultData.hsrAddon,
      ...hsrAddon,
    },
    locale: locale ?? crossSellWidgetDefaultData.locale,
    order,
    promo: {
      ...crossSellWidgetDefaultData.promo,
      ...promo,
    },
    reminders: reminders ?? crossSellWidgetDefaultData.reminders,
    sections: resolveCrossSellWidgetSections(
      sections,
      orderDestination,
      sectionContentOverrides,
    ),
    serviceAgent: {
      ...crossSellWidgetDefaultData.serviceAgent,
      ...serviceAgent,
    },
  }
  const promoKey = `${data.promo.startsAt}:${data.promo.durationSeconds}`

  return (
    <CrossSellWidgetContent
      data={data}
      key={promoKey}
      onSelectAddon={onSelectAddon}
      onSelectItem={onSelectItem}
      onViewMore={onViewMore}
      promoKey={promoKey}
    />
  )
}
