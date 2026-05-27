import { Img, Section } from '@react-email/components'

import type { CrossSellEmailSection } from '../types'

interface IconBadgeProps {
  section: CrossSellEmailSection
}

export function IconBadge({ section }: IconBadgeProps) {
  return (
    <Section className="m-0 h-9 w-9 rounded-[50px] bg-white p-1.25">
      <Img
        alt={section.iconAlt}
        className="block"
        height="26"
        src={section.iconUrl}
        width="26"
      />
    </Section>
  )
}
