import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

import type {
  FlightOrderCrossSellAddon,
  FlightOrderCrossSellBenefit,
  FlightOrderCrossSellCategory,
  FlightOrderCrossSellItem,
  FlightOrderCrossSellOrder,
  FlightOrderCrossSellPromo,
  FlightOrderCrossSellReminder,
  FlightOrderCrossSellSection,
  FlightOrderCrossSellSectionContentOverrides,
  FlightOrderCrossSellSectionContentOverridesByKind,
  FlightOrderCrossSellSectionKind,
} from '../flight-order-cross-sell'

export type CrossSellWidgetBenefit = FlightOrderCrossSellBenefit
export type CrossSellWidgetPromo = FlightOrderCrossSellPromo
export type CrossSellWidgetItem = FlightOrderCrossSellItem
export type CrossSellWidgetSectionKind = FlightOrderCrossSellSectionKind
export type CrossSellWidgetCategory = FlightOrderCrossSellCategory
export type CrossSellWidgetSection = FlightOrderCrossSellSection
export type CrossSellWidgetSectionContentOverrides =
  FlightOrderCrossSellSectionContentOverrides
export type CrossSellWidgetSectionContentOverridesByKind =
  FlightOrderCrossSellSectionContentOverridesByKind

export interface CrossSellWidgetResolvedSection extends CrossSellWidgetSection {
  title: string
  viewMoreLabel: string
  viewMorePlaceholderLabel: string
}

export interface CrossSellWidgetFeaturedAddon {
  id?: string
  title: string
  description: string
  ctaLabel: string
  href?: string
}

export interface CrossSellWidgetActionItem {
  id: string
  title: string
  description: string
  accentText?: string
  href?: string
  icon: 'gift' | 'insurance' | 'passport' | 'wifi'
}

export interface CrossSellWidgetActionSection {
  title: string
  subtitle?: string
  items: CrossSellWidgetActionItem[]
}

export interface CrossSellWidgetData {
  promo: CrossSellWidgetPromo
  sections: CrossSellWidgetResolvedSection[]
  actionSection?: CrossSellWidgetActionSection
  currency?: string
  domainMode?: LiontravelDomainMode
  featuredAddon?: CrossSellWidgetFeaturedAddon
  locale?: string
}

export type CrossSellWidgetDefaultData = Omit<
  CrossSellWidgetData,
  'sections'
>

export interface CrossSellWidgetContentOverrides {
  actionSection?: CrossSellWidgetActionSection
  currency?: string
  domainMode?: LiontravelDomainMode
  featuredAddon?: Partial<CrossSellWidgetFeaturedAddon>
  locale?: string
  orderDestination?: string
  promo?: Partial<CrossSellWidgetPromo>
  sectionContentOverrides?: CrossSellWidgetSectionContentOverridesByKind

  /**
   * @deprecated Use featuredAddon instead. This is kept for compatibility with
   * the original flight-order-cross-sell data contract.
   */
  hsrAddon?: Partial<FlightOrderCrossSellAddon>

  /**
   * @deprecated Use actionSection instead. This is kept for compatibility with
   * the original flight-order-cross-sell data contract.
   */
  reminders?: CrossSellWidgetActionSection

  /**
   * @deprecated Flight order data should be adapted before reaching the generic widget.
   */
  order?: FlightOrderCrossSellOrder

  /**
   * @deprecated Flight service agent data should be adapted before reaching the generic widget.
   */
  serviceAgent?: { email?: string }
}

export interface CrossSellWidgetItemEvent {
  sectionId: string
  item: CrossSellWidgetItem
}

export interface CrossSellWidgetViewMoreEvent {
  sectionId: string
}

export interface CrossSellWidgetAddonEvent {
  addonId: string
}

export interface CrossSellWidgetProps extends CrossSellWidgetContentOverrides {
  sections: CrossSellWidgetSection[]
  onSelectItem?: (event: CrossSellWidgetItemEvent) => void
  onViewMore?: (event: CrossSellWidgetViewMoreEvent) => void
  onSelectAddon?: (event: CrossSellWidgetAddonEvent) => void
}

export type CrossSellWidgetReminder = FlightOrderCrossSellReminder
export type CrossSellWidgetAddon = FlightOrderCrossSellAddon
export type CrossSellWidgetOrder = FlightOrderCrossSellOrder
