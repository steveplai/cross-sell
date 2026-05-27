import { Column, Img, Row, Section } from '@react-email/components'

import type { CrossSellEmailHighlight } from '../types'

interface HighlightsProps {
  highlights: CrossSellEmailHighlight[]
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
              <Section align="left" className="m-0 w-auto" width="auto">
                <Row>
                  <Column className="w-4 pr-0.5 align-middle text-[0px] leading-none">
                    <Img
                      alt=""
                      className="block"
                      height="16"
                      src={highlight.checkIconSrc}
                      width="16"
                    />
                  </Column>
                  {highlight.label ? (
                    <Column className="text-orange pr-0.5 align-middle font-sans text-[12px] leading-5.5 whitespace-nowrap">
                      {highlight.label}
                    </Column>
                  ) : null}
                  <Column className="text-ink align-middle font-sans text-[12px] leading-5.5 whitespace-nowrap">
                    {highlight.text}
                  </Column>
                </Row>
              </Section>
            </Column>
          )
        })}
      </Row>
    </Section>
  )
}
