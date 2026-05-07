import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
} from '@react-email/components'

import { CrossSellSection } from './components/CrossSellSection'
import { Header } from './components/Header'
import { Highlights } from './components/Highlights'
import { travelPlanCrossSellTailwindConfig } from './tailwind-config'
import type { TravelPlanCrossSellEmailProps } from './types'

export type {
  TravelPlanCrossSellEmailProps,
  TravelPlanCrossSellHighlight,
  TravelPlanCrossSellRecommendation,
  TravelPlanCrossSellSection,
  TravelPlanCrossSellSectionVariant,
} from './types'

export type TravelPlanCrossSellContentProps = Omit<
  TravelPlanCrossSellEmailProps,
  'previewText'
>

export function TravelPlanCrossSellContent({
  title,
  deadlineText,
  highlights = [],
  sections,
}: TravelPlanCrossSellContentProps) {
  return (
    <Container className="text-ink mx-auto w-150 max-w-150 rounded-[5px] bg-white p-5 font-sans">
      <Header title={title} deadlineText={deadlineText} />
      {highlights.length ? <Highlights highlights={highlights} /> : null}
      <Section className="m-0">
        {sections.map((section) => (
          <CrossSellSection key={section.id} section={section} />
        ))}
      </Section>
    </Container>
  )
}

export function TravelPlanCrossSellEmail({
  previewText,
  ...contentProps
}: TravelPlanCrossSellEmailProps) {
  return (
    <Html lang="zh-TW">
      <Tailwind config={travelPlanCrossSellTailwindConfig}>
        <Head />
        <Preview>{previewText}</Preview>
        <Body className="m-0 rounded-[10px] bg-white p-0 font-sans">
          <TravelPlanCrossSellContent {...contentProps} />
        </Body>
      </Tailwind>
    </Html>
  )
}
