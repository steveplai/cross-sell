import { type ReactNode, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { createWidgetRootProps } from '../../runtime/widgetRoot'
import { ActionCards } from './components/actions/ActionCards'
import { FeaturedAddonBanner } from './components/addons/FeaturedAddonBanner'
import { PromoHeader } from './components/promo/PromoHeader'
import { CrossSellSection } from './components/sections/CrossSellSection'
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

  const renderableSections = data.sections.filter(
    (section) => section.items.length > 0,
  )

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
        <ContentPanel allowOverflow>
          <PromoHeader
            isPromoActive={isPromoActive}
            promo={data.promo}
            remainingSeconds={remainingSeconds}
          />
        </ContentPanel>

        {data.featuredAddon ? (
          <ContentPanel>
            <FeaturedAddonBanner
              addon={data.featuredAddon}
              href={data.featuredAddon.href}
              onSelectAddon={() =>
                onSelectAddon?.({
                  addonId: data.featuredAddon?.id ?? featuredAddonId,
                })
              }
            />
          </ContentPanel>
        ) : null}

        {renderableSections.map((section) => (
          <ContentPanel key={section.id}>
            <CrossSellSection
              currency={currency}
              isPromoActive={isPromoActive}
              locale={locale}
              onSelectItem={(item) =>
                onSelectItem?.({ item, sectionId: section.id })
              }
              onViewMore={() => onViewMore?.({ sectionId: section.id })}
              section={section}
            />
          </ContentPanel>
        ))}

        {data.actionSection ? (
          <ContentPanel>
            <ActionCards
              items={data.actionSection.items}
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
      overrideContent?.viewMoreLabel ??
      section.viewMoreLabel ??
      title

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
