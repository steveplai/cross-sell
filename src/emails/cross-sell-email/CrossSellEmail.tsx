import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
} from '@react-email/components'

import { CrossSellSection } from './components/CrossSellSection'
import { Header } from './components/Header'
import { Highlights } from './components/Highlights'
import { crossSellEmailTailwindConfig } from './tailwind-config'
import type { CrossSellEmailProps } from './types'

const crossSellEmailHeadStyles = `
.recommendation-link-text-anchor:hover .recommendation-link-text {
  text-decoration: underline !important;
}
`

export type {
  CrossSellEmailHighlight,
  CrossSellEmailProps,
  CrossSellEmailRecommendation,
  CrossSellEmailSection,
  CrossSellEmailSectionVariant,
} from './types'

export type CrossSellEmailContentProps = Omit<
  CrossSellEmailProps,
  'previewText'
>

export function CrossSellEmailContent({
  title,
  deadlineText,
  highlights = [],
  sections,
}: CrossSellEmailContentProps) {
  return (
    <Container className="text-ink mx-auto w-150 max-w-150 table-fixed rounded-[5px] bg-white font-sans">
      <Section className="m-0 w-full table-fixed">
        <Row className="w-full table-fixed">
          <Column className="p-5">
            <Header title={title} deadlineText={deadlineText} />
            {highlights.length ? <Highlights highlights={highlights} /> : null}
            <Section className="m-0 w-full table-fixed">
              {sections.map((section) => (
                <CrossSellSection key={section.id} section={section} />
              ))}
            </Section>
          </Column>
        </Row>
      </Section>
    </Container>
  )
}

export function CrossSellEmail({
  previewText,
  ...contentProps
}: CrossSellEmailProps) {
  return (
    <Html lang="zh-TW">
      <Tailwind config={crossSellEmailTailwindConfig}>
        <Head>
          <style>{crossSellEmailHeadStyles}</style>
        </Head>
        <Preview>{previewText}</Preview>
        <Body className="m-0 rounded-[10px] bg-white p-0">
          <CrossSellEmailContent {...contentProps} />
        </Body>
      </Tailwind>
    </Html>
  )
}
