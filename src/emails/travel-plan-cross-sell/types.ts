export interface TravelPlanCrossSellHighlight {
  checkIconSrc: string
  id: string
  label?: string
  text: string
}

export type TravelPlanCrossSellSectionVariant =
  | 'compact'
  | 'featured'
  | 'emphasis'

export interface TravelPlanCrossSellRecommendation {
  text: string
  url: string
  arrowIconUrl: string
}

export interface TravelPlanCrossSellSection {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  ctaIconUrl?: string
  iconUrl: string
  iconAlt: string
  variant?: TravelPlanCrossSellSectionVariant
  showHeaderDescriptionAndCta?: boolean
  recommendationsTitle?: string
  recommendations?: TravelPlanCrossSellRecommendation[]
}

export interface TravelPlanCrossSellEmailProps {
  previewText: string
  title: string
  deadlineText?: string
  highlights?: TravelPlanCrossSellHighlight[]
  sections: TravelPlanCrossSellSection[]
}
