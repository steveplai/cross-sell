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
  badge?: string
  promoBadge?: string
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

export interface FlightOrderCrossSellSection {
  id: string
  title: string
  subtitle?: string
  viewMoreLabel?: string
  categories?: string[]
  items: FlightOrderCrossSellItem[]
}

export interface FlightOrderCrossSellAddon {
  id: string
  title: string
  description: string
  ctaLabel?: string
  helperLabel?: string
}

export interface FlightOrderCrossSellReminder {
  id: string
  title: string
  description: string
  accentText?: string
  icon: 'wifi' | 'gift'
}

export interface FlightOrderCrossSellData {
  promo: FlightOrderCrossSellPromo
  sections: FlightOrderCrossSellSection[]
  hsrAddon?: FlightOrderCrossSellAddon
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
