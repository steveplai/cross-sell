import { Column, Row, Section, Text } from '@react-email/components'

import type { TravelPlanCrossSellSection } from '../types'
import { CtaButton } from './CtaButton'
import { IconBadge } from './IconBadge'

interface CompactSectionProps {
  section: TravelPlanCrossSellSection
  emphasis?: boolean
}

export function CompactSection({
  section,
  emphasis = false,
}: CompactSectionProps) {
  const cardClassName = emphasis
    ? 'bg-brand-red-soft mb-[10px] w-full rounded-[5px] px-[15px] py-[10px]'
    : 'bg-nature mb-[10px] w-full rounded-[5px] px-[15px] py-[10px]'

  return (
    <Section className={cardClassName}>
      <Row className="table-fixed">
        <Column className="w-11.75">
          <IconBadge section={section} />
        </Column>
        <Column className="w-18">
          <Text className="text-ink m-0 font-sans text-[16px] leading-6 font-bold whitespace-nowrap">
            {section.title}
          </Text>
        </Column>
        <Column className="w-74.75">
          <Text className="m-0 font-sans text-[14px] leading-5.5 whitespace-nowrap text-black">
            {section.description}
          </Text>
        </Column>
        <Column className="w-28 text-right">
          <CtaButton
            href={section.ctaUrl}
            label={section.ctaLabel}
            tone={emphasis ? 'red' : 'gray'}
          />
        </Column>
      </Row>
    </Section>
  )
}
