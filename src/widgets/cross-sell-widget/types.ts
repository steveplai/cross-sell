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

export interface CrossSellWidgetCategory {
  id?: string
  label: string
  href: string
}

export interface CrossSellWidgetSection {
  id: string
  kind?: string
  title?: string
  subtitle?: string
  viewMoreLabel?: string
  viewMoreHref?: string
  viewMorePlaceholderLabel?: string
  categories?: CrossSellWidgetCategory[]
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
  Record<string, CrossSellWidgetSectionContentOverrides>
>

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
  icon?: 'gift' | 'insurance' | 'passport' | 'wifi'
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
  featuredAddon?: CrossSellWidgetFeaturedAddon
  locale?: string
}

export type CrossSellWidgetDefaultData = Omit<CrossSellWidgetData, 'sections'>

export interface CrossSellWidgetContentOverrides {
  actionSection?: CrossSellWidgetActionSection
  currency?: string
  featuredAddon?: Partial<CrossSellWidgetFeaturedAddon>
  locale?: string
  promo?: Partial<CrossSellWidgetPromo>
  sectionContentOverrides?: CrossSellWidgetSectionContentOverridesByKind
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
