import { Button, Column, Row, Section, Text } from '@react-email/components'

import type { TravelPlanCrossSellSection } from '../types'
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
  const buttonClassName = emphasis
    ? 'border-brand-red text-brand-red inline-block rounded-[5px] border border-solid bg-white px-[10px] py-[5px] text-center text-[14px] leading-[22px] whitespace-nowrap no-underline'
    : 'inline-block rounded-[5px] border border-solid border-muted bg-white px-[10px] py-[5px] text-center text-[14px] leading-[22px] whitespace-nowrap text-muted no-underline'

  return (
    <Section className={cardClassName}>
      <Row>
        <Column className="w-11.75">
          <IconBadge section={section} />
        </Column>
        <Column className="w-19">
          <Text className="text-ink m-0 text-[16px] leading-6 font-bold whitespace-nowrap">
            {section.title}
          </Text>
        </Column>
        <Column className="w-66.25">
          <Text className="m-0 text-[14px] leading-5.5 text-black text-nowrap">
            {section.description}
          </Text>
        </Column>
        <Column className="w-32.5 text-right">
          <Button className={buttonClassName} href={section.ctaUrl}>
            {section.ctaLabel}
          </Button>
        </Column>
      </Row>
    </Section>
  )
}
