import { type ReactNode, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { HsrAddonBanner } from '../flight-order-cross-sell/components/addons/HsrAddonBanner'
import { ReminderCards } from '../flight-order-cross-sell/components/addons/ReminderCards'
import { PromoHeader } from '../flight-order-cross-sell/components/promo/PromoHeader'
import { AttractionDecorBanner } from '../flight-order-cross-sell/components/recommendations/AttractionDecorBanner'
import { CrossSellSection } from '../flight-order-cross-sell/components/recommendations/CrossSellSection'
import type {
  FlightOrderCrossSellAddon,
  FlightOrderCrossSellReminder,
  FlightOrderCrossSellResolvedSection,
} from '../flight-order-cross-sell/types'
import { crossSellWidgetDefaultData } from './defaultData'
import { getRemainingPromoSeconds } from './lib/countdown'
import type {
  CrossSellWidgetData,
  CrossSellWidgetProps,
  CrossSellWidgetResolvedSection,
  CrossSellWidgetSection,
  CrossSellWidgetSectionContentOverridesByKind,
} from './types'

const crossSellWidgetRootProps = createWidgetRootProps('cross-sell-widget')
const featuredAddonId = 'featured-addon'

type CrossSellSectionGroupKey = 'hotel' | 'attraction' | 'transport' | 'flight' | 'other'
type CrossSellSectionGroups = Record<
  CrossSellSectionGroupKey,
  CrossSellWidgetResolvedSection[]
>

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
}: Pick<CrossSellWidgetProps, 'onSelectAddon' | 'onSelectItem' | 'onViewMore'> & {
  data: CrossSellWidgetData
  promoKey: string
}) {
  const now = useCurrentTime(promoKey)
  const locale = data.locale ?? 'zh-TW'
  const currency = data.currency ?? 'TWD'
  const remainingSeconds = getRemainingPromoSeconds(data.promo, now)
  const isPromoActive = remainingSeconds > 0
  const sectionGroups = groupCrossSellWidgetSections(data.sections)

  function getRenderableSections(sections: CrossSellWidgetResolvedSection[]) {
    return sections.filter((section) => section.items.length > 0)
  }

  const renderableAttractionSections = getRenderableSections(
    sectionGroups.attraction,
  )
  const attractionBannerTitle = renderableAttractionSections[0]?.title ?? ''

  function renderCrossSellSections(
    sections: CrossSellWidgetResolvedSection[],
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
              onSelectItem?.({
                item: item as unknown as CrossSellWidgetResolvedSection['items'][number],
                sectionId: section.id,
              })
            }
            onViewMore={() => onViewMore?.({ sectionId: section.id })}
            section={section as unknown as FlightOrderCrossSellResolvedSection}
          />
        ))}
      </div>
    )
  }

  function renderDefaultSectionPanel(sections: CrossSellWidgetResolvedSection[]) {
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
        'w-full bg-(--lion-gray-100) text-foreground',
        'lion-desktop:bg-linear-to-b lion-desktop:from-(--lion-page-gradient-from) lion-desktop:to-(--lion-page-gradient-to)',
      )}
      data-promo-state={isPromoActive ? 'active' : 'expired'}
      {...crossSellWidgetRootProps}
    >
      <div className="mx-auto flex w-full max-w-297.5 flex-col gap-2.5 py-0 lion-desktop:py-0">
        {renderPromoHotelPanel()}

        {data.featuredAddon ? (
          <ContentPanel>
            <HsrAddonBanner
              addon={data.featuredAddon as FlightOrderCrossSellAddon}
              href={data.featuredAddon.href}
              onSelectAddon={() =>
                onSelectAddon?.({
                  addonId: data.featuredAddon?.id ?? featuredAddonId,
                })
              }
            />
          </ContentPanel>
        ) : null}

        {renderableAttractionSections.length > 0 ? (
          <ContentPanel>
            <div className="overflow-hidden bg-background">
              <AttractionDecorBanner title={attractionBannerTitle} />
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

        {data.actionSection ? (
          <ContentPanel>
            <ReminderCards
              items={data.actionSection.items as FlightOrderCrossSellReminder[]}
              onSelectAddon={(addonId) => onSelectAddon?.({ addonId })}
              subtitle={data.actionSection.subtitle}
              title={data.actionSection.title}
            />
          </ContentPanel>
        ) : null}
      </div>
    </section>
  )
}

function groupCrossSellWidgetSections(
  sections: CrossSellWidgetResolvedSection[],
): CrossSellSectionGroups {
  const groups: CrossSellSectionGroups = {
    attraction: [],
    flight: [],
    hotel: [],
    other: [],
    transport: [],
  }

  sections.forEach((section) => {
    switch (section.kind) {
      case 'hotel':
        groups.hotel.push(section)
        break
      case 'attraction':
        groups.attraction.push(section)
        break
      case 'transport':
        groups.transport.push(section)
        break
      case 'flight':
        groups.flight.push(section)
        break
      default:
        groups.other.push(section)
        break
    }
  })

  return groups
}

function resolveCrossSellWidgetSections(
  sections: CrossSellWidgetSection[],
  sectionContentOverrides?: CrossSellWidgetSectionContentOverridesByKind,
): CrossSellWidgetResolvedSection[] {
  return sections.map((section) => {
    const overrideContent = section.kind
      ? sectionContentOverrides?.[section.kind]
      : undefined
    const title = overrideContent?.title ?? section.title ?? section.id
    const viewMoreLabel =
      overrideContent?.viewMoreLabel ?? section.viewMoreLabel ?? title

    return {
      ...section,
      subtitle: overrideContent?.subtitle ?? section.subtitle,
      title,
      viewMoreLabel,
      viewMorePlaceholderLabel:
        overrideContent?.viewMorePlaceholderLabel ??
        section.viewMorePlaceholderLabel ??
        viewMoreLabel,
    }
  })
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

export function CrossSellWidget({
  actionSection,
  currency,
  featuredAddon,
  locale,
  onSelectAddon,
  onSelectItem,
  onViewMore,
  promo,
  sectionContentOverrides,
  sections,
}: CrossSellWidgetProps) {
  const data: CrossSellWidgetData = {
    ...crossSellWidgetDefaultData,
    actionSection,
    currency: currency ?? crossSellWidgetDefaultData.currency,
    featuredAddon: featuredAddon
      ? {
          ...featuredAddon,
        }
      : undefined,
    locale: locale ?? crossSellWidgetDefaultData.locale,
    promo: {
      ...crossSellWidgetDefaultData.promo,
      ...promo,
    },
    sections: resolveCrossSellWidgetSections(
      sections,
      sectionContentOverrides,
    ),
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
