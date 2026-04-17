import type { TravelPlanCrossSellSection } from '../types'
import { CompactSection } from './CompactSection'
import { FeaturedSection } from './FeaturedSection'

interface CrossSellSectionProps {
  section: TravelPlanCrossSellSection
}

export function CrossSellSection({ section }: CrossSellSectionProps) {
  const variant = section.variant ?? 'compact'

  if (variant === 'featured') {
    return <FeaturedSection section={section} />
  }

  return <CompactSection emphasis={variant === 'emphasis'} section={section} />
}
