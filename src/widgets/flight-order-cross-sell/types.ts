import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

export interface FlightOrderCrossSellBenefit {
  id?: string
  label: string
  tagLabel?: string
}

export interface FlightOrderCrossSellPromo {
  id: string
  activeTitle: string
  expiredTitle: string
  startsAt: string
  durationSeconds: number
  benefits?: FlightOrderCrossSellBenefit[]
  serviceLabel?: string
}

export interface FlightOrderCrossSellItem {
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

export type FlightOrderCrossSellSectionKind =
  | 'hotel'
  | 'attraction'
  | 'transport'
  | 'flight'

export interface FlightOrderCrossSellCategory {
  id?: string
  label: string
  href: string
}

export interface FlightOrderCrossSellSection {
  id: string
  kind?: FlightOrderCrossSellSectionKind
  title: string
  subtitle?: string
  viewMoreLabel?: string
  viewMoreHref?: string
  categories?: FlightOrderCrossSellCategory[]
  items: FlightOrderCrossSellItem[]
}

export interface FlightOrderCrossSellReminder {
  id: string
  title: string
  description: string
  accentText?: string
  href?: string
  icon: 'gift' | 'insurance' | 'passport' | 'wifi'
}

export interface FlightOrderCrossSellAttractionBannerOverrides {
  title?: string
}

export interface FlightOrderCrossSellAddon {
  id?: string
  title?: string
  description?: string
  ctaLabel?: string
}

export interface FlightOrderCrossSellOrder {
  orderYear: string
  orderNumber: string
}

export interface FlightOrderCrossSellServiceAgent {
  email?: string
}

export interface FlightOrderCrossSellData {
  promo: FlightOrderCrossSellPromo
  sections: FlightOrderCrossSellSection[]
  attractionBannerOverrides?: FlightOrderCrossSellAttractionBannerOverrides
  domainMode?: LiontravelDomainMode
  hsrAddon?: FlightOrderCrossSellAddon
  order?: FlightOrderCrossSellOrder
  serviceAgent?: FlightOrderCrossSellServiceAgent
  reminders?: {
    title: string
    subtitle?: string
    items: FlightOrderCrossSellReminder[]
  }
  locale?: string
  currency?: string
}

export type FlightOrderCrossSellDefaultData = Omit<
  FlightOrderCrossSellData,
  'order' | 'sections'
>

export interface FlightOrderCrossSellContentOverrides {
  attractionBannerOverrides?: FlightOrderCrossSellAttractionBannerOverrides
  currency?: string
  domainMode?: LiontravelDomainMode
  hsrAddon?: FlightOrderCrossSellAddon
  locale?: string
  promo?: Partial<FlightOrderCrossSellPromo>
  reminders?: FlightOrderCrossSellData['reminders']
  serviceAgent?: FlightOrderCrossSellServiceAgent
}

export interface FlightOrderCrossSellItemEvent {
  sectionId: string
  item: FlightOrderCrossSellItem
}

export interface FlightOrderCrossSellViewMoreEvent {
  sectionId: string
}

export interface FlightOrderCrossSellAddonEvent {
  addonId: string
}

export interface FlightOrderCrossSellProps extends FlightOrderCrossSellContentOverrides {
  order?: FlightOrderCrossSellOrder
  sections: FlightOrderCrossSellSection[]
  onSelectItem?: (event: FlightOrderCrossSellItemEvent) => void
  onViewMore?: (event: FlightOrderCrossSellViewMoreEvent) => void
  onSelectAddon?: (event: FlightOrderCrossSellAddonEvent) => void
}
