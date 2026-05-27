export interface CrossSellEmailHighlight {
  checkIconSrc: string
  id: string
  label?: string
  text: string
}

export type CrossSellEmailSectionVariant = 'compact' | 'featured' | 'emphasis'

export interface CrossSellEmailRecommendation {
  text: string
  url: string
  arrowIconUrl: string
}

export interface CrossSellEmailSection {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  ctaIconUrl?: string
  iconUrl: string
  iconAlt: string
  variant?: CrossSellEmailSectionVariant
  showHeaderDescriptionAndCta?: boolean
  recommendationsTitle?: string
  recommendations?: CrossSellEmailRecommendation[]
}

export interface CrossSellEmailProps {
  previewText: string
  title: string
  deadlineText?: string
  highlights?: CrossSellEmailHighlight[]
  sections: CrossSellEmailSection[]
}
