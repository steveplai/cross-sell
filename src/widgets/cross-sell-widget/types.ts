import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

export interface CrossSellWidgetBenefit {
  id?: string
  label: string
  tagLabel?: string
}

export interface CrossSellWidgetPromo {
  id: string
  activeTitle: string
  expiredTitle: string
  startsAt: string
  durationSeconds: number
  benefits?: CrossSellWidgetBenefit[]
  serviceLabel: string
}

export interface CrossSellWidgetItem {
  id: string
  title: string
  href?: string
  imageUrl?: string
  location?: string
  detailLocation?: string
  badge?: string
  promoBadge?: string
  starRating?: number
  rating?: string
  ratingLabel?: string
  reviewCount?: number
  interestLabel?: string
  cancellationLabel?: string
  originalPrice?: number
  discountLabel?: string
  price: number
  pricePrefix?: string
  priceSuffix?: string
}

export type CrossSellWidgetSectionKind =
  | 'hotel'
  | 'attraction'
  | 'transport'
  | 'flight'

export interface CrossSellWidgetPopularSearch {
  id?: string
  label: string
  href: string
}

export interface CrossSellWidgetSection {
  id: string
  kind?: CrossSellWidgetSectionKind
  title?: string
  subtitle?: string
  viewMoreLabel?: string
  viewMoreHref?: string
  viewMorePlaceholderLabel?: string
  popularSearches?: CrossSellWidgetPopularSearch[]
  items: CrossSellWidgetItem[]
}

export interface CrossSellWidgetResolvedSection extends CrossSellWidgetSection {
  title: string
  viewMoreLabel: string
  viewMorePlaceholderLabel: string
}

export interface CrossSellWidgetSectionContentOverrides {
  title?: string
  subtitle?: string
  viewMoreLabel?: string
  viewMorePlaceholderLabel?: string
}

export type CrossSellWidgetSectionContentOverridesByKind = Partial<
  Record<CrossSellWidgetSectionKind, CrossSellWidgetSectionContentOverrides>
>

export interface CrossSellWidgetReminder {
  id: string
  title: string
  description: string
  accentText?: string
  href?: string
  icon: 'gift' | 'insurance' | 'passport' | 'wifi'
}

export interface CrossSellWidgetAddon {
  id?: string
  title: string
  description: string
  ctaLabel: string
}

export interface CrossSellWidgetOrder {
  orderYear: string
  orderNumber: string
}

export interface CrossSellWidgetServiceAgent {
  email?: string
}

export interface CrossSellWidgetData {
  promo: CrossSellWidgetPromo
  sections: CrossSellWidgetResolvedSection[]
  domainMode?: LiontravelDomainMode
  hsrAddon: CrossSellWidgetAddon
  order?: CrossSellWidgetOrder
  serviceAgent?: CrossSellWidgetServiceAgent
  reminders?: {
    title: string
    subtitle?: string
    items: CrossSellWidgetReminder[]
  }
  locale?: string
  currency?: string
}

export type CrossSellWidgetDefaultData = Omit<
  CrossSellWidgetData,
  'order' | 'sections'
>

export interface CrossSellWidgetContentOverrides {
  currency?: string
  domainMode?: LiontravelDomainMode
  hsrAddon?: Partial<CrossSellWidgetAddon>
  locale?: string
  orderDestination?: string
  promo?: Partial<CrossSellWidgetPromo>
  reminders?: CrossSellWidgetData['reminders']
  sectionContentOverrides?: CrossSellWidgetSectionContentOverridesByKind
  serviceAgent?: CrossSellWidgetServiceAgent
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
  order?: CrossSellWidgetOrder
  sections: CrossSellWidgetSection[]
  onSelectItem?: (event: CrossSellWidgetItemEvent) => void
  onViewMore?: (event: CrossSellWidgetViewMoreEvent) => void
  onSelectAddon?: (event: CrossSellWidgetAddonEvent) => void
}
