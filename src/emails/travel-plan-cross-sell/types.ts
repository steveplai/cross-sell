export interface TravelPlanCrossSellHighlight {
  checkIconSrc?: string
  id: string
  label?: string
  text: string
}

export type TravelPlanCrossSellSectionVariant =
  | 'compact'
  | 'featured'
  | 'emphasis'

export interface TravelPlanCrossSellSection {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  iconUrl: string
  iconAlt: string
  variant?: TravelPlanCrossSellSectionVariant
  recommendationsTitle?: string
  recommendations?: string[]
}

export interface TravelPlanCrossSellEmailProps {
  previewText: string
  title: string
  deadlineText?: string
  highlights?: TravelPlanCrossSellHighlight[]
  sections: TravelPlanCrossSellSection[]
}
