import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'

export type FlightOrderCrossSellBenefit =
  | string
  | {
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

export interface FlightOrderCrossSellSection {
  id: string
  kind?: FlightOrderCrossSellSectionKind
  title: string
  subtitle?: string
  viewMoreLabel?: string
  categories?: string[]
  items: FlightOrderCrossSellItem[]
}

export interface FlightOrderCrossSellReminder {
  id: string
  title: string
  description: string
  accentText?: string
  icon: 'wifi' | 'gift'
}

export interface FlightOrderCrossSellAttractionDecor {
  title: string
  imageAlt?: string
  imageUrl?: string
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

export interface FlightOrderCrossSellData {
  promo: FlightOrderCrossSellPromo
  sections: FlightOrderCrossSellSection[]
  attractionDecor?: FlightOrderCrossSellAttractionDecor
  domainMode?: LiontravelDomainMode
  hsrAddon?: FlightOrderCrossSellAddon
  order?: FlightOrderCrossSellOrder
  reminders?: {
    title: string
    subtitle?: string
    items: FlightOrderCrossSellReminder[]
  }
  locale?: string
  currency?: string
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

export interface FlightOrderCrossSellProps {
  data: FlightOrderCrossSellData
  onSelectItem?: (event: FlightOrderCrossSellItemEvent) => void
  onViewMore?: (event: FlightOrderCrossSellViewMoreEvent) => void
  onSelectAddon?: (event: FlightOrderCrossSellAddonEvent) => void
}
