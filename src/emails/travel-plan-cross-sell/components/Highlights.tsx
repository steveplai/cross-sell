import { Column, Img, Row, Section, Text } from '@react-email/components'

import type { TravelPlanCrossSellHighlight } from '../types'

interface HighlightsProps {
  highlights: TravelPlanCrossSellHighlight[]
}

export function Highlights({ highlights }: HighlightsProps) {
  return (
    <Section className="mb-2.5">
      <Row align="left" width="auto" style={{ width: 'auto' }}>
        {highlights.map((highlight, index) => {
          return (
            <Column
              key={highlight.id}
              style={{
                paddingRight: index === highlights.length - 1 ? 0 : 12,
                whiteSpace: 'nowrap',
              }}
            >
              <Text className="text-ink m-0 text-[12px] leading-5.5">
                <Img
                  className="inline size-4 align-text-bottom"
                  src={highlight.checkIconSrc}
                  alt=""
                />
                {highlight.label ? (
                  <span className="text-orange pr-0.5">{highlight.label}</span>
                ) : null}
                {highlight.text}
              </Text>
            </Column>
          )
        })}
      </Row>
    </Section>
  )
}
