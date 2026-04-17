import { Column, Row, Section, Text } from '@react-email/components'

import type { TravelPlanCrossSellHighlight } from '../types'

interface HighlightsProps {
  highlights: TravelPlanCrossSellHighlight[]
}

export function Highlights({ highlights }: HighlightsProps) {
  return (
    <Section className="mb-2.5">
      <Row>
        {highlights.map((highlight) => (
          <Column className="pr-3" key={highlight.id}>
            <Text className="text-ink m-0 text-[12px] leading-5.5 whitespace-nowrap">
              <span className="text-orange inline-block pr-1">✓</span>
              {highlight.label ? (
                <span className="text-orange pr-0.5">{highlight.label}</span>
              ) : null}
              {highlight.text}
            </Text>
          </Column>
        ))}
      </Row>
    </Section>
  )
}
