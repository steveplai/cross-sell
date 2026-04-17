import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Html,
  Img,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

export interface OrderCrossSellHighlight {
  id: string
  label?: string
  text: string
}

export interface OrderCrossSellSection {
  id: string
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  iconUrl: string
  iconAlt: string
  featured?: boolean
  recommendationsTitle?: string
  recommendations?: string[]
}

export interface OrderCrossSellEmailProps {
  previewText: string
  title: string
  deadlineText: string
  highlights: OrderCrossSellHighlight[]
  sections: OrderCrossSellSection[]
}

export function OrderCrossSellEmail({
  previewText,
  title,
  deadlineText,
  highlights,
  sections,
}: OrderCrossSellEmailProps) {
  return (
    <Html lang="zh-TW">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                ink: '#222222',
                muted: '#666666',
                nature: '#f7f7f7',
                orange: '#ff5b1a',
                'brand-red': '#f03742',
                'brand-red-soft': 'rgba(240, 55, 66, 0.1)',
              },
              fontFamily: {
                sans: ['Noto Sans TC', 'Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Body className="m-0 bg-white p-0">
          <Container className="text-ink mx-auto w-150 max-w-150 rounded-[5px] bg-white p-5 font-sans">
            <Section className="mb-[10px]">
              <Row>
                <Column className="w-[100px]">
                  <Text className="text-ink m-0 text-[20px] leading-[30px] font-bold">
                    {title}
                  </Text>
                </Column>
                <Column>
                  <Text className="bg-brand-red-soft text-brand-red m-0 inline-block rounded-[5px] px-1.5 py-[3px] text-[12px] leading-[22px]">
                    {deadlineText}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mb-[10px]">
              <Row>
                {highlights.map((highlight) => (
                  <Column className="pr-3" key={highlight.id}>
                    <Text className="text-ink m-0 text-[12px] leading-[22px] whitespace-nowrap">
                      <span className="text-orange inline-block pr-1">✓</span>
                      {highlight.label ? (
                        <span className="text-orange pr-0.5">
                          {highlight.label}
                        </span>
                      ) : null}
                      {highlight.text}
                    </Text>
                  </Column>
                ))}
              </Row>
            </Section>

            <Section className="m-0">
              {sections.map((section) =>
                section.featured ? (
                  <FeaturedSection key={section.id} section={section} />
                ) : (
                  <CompactSection key={section.id} section={section} />
                ),
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

function CompactSection({ section }: { section: OrderCrossSellSection }) {
  return (
    <Section className="bg-nature mb-[10px] w-full rounded-[5px] px-[15px] py-[10px]">
      <Row>
        <Column className="w-[47px]">
          <IconBadge section={section} />
        </Column>
        <Column className="w-[76px]">
          <Text className="text-ink m-0 text-[16px] leading-6 font-bold whitespace-nowrap">
            {section.title}
          </Text>
        </Column>
        <Column className="w-[265px]">
          <Text className="m-0 text-[14px] leading-[22px] text-black">
            {section.description}
          </Text>
        </Column>
        <Column className="w-[130px] text-right">
          <Button
            className="inline-block rounded-[5px] border border-solid border-muted bg-white px-[10px] py-[5px] text-center text-[14px] leading-[22px] whitespace-nowrap text-muted no-underline"
            href={section.ctaUrl}
          >
            {section.ctaLabel}
          </Button>
        </Column>
      </Row>
    </Section>
  )
}

function FeaturedSection({ section }: { section: OrderCrossSellSection }) {
  return (
    <>
      <Section className="bg-brand-red-soft m-0 w-full rounded-[5px] px-[15px] py-[10px]">
        <Row>
          <Column className="w-[47px]">
            <IconBadge section={section} />
          </Column>
          <Column>
            <Text className="text-ink m-0 text-[16px] leading-6 font-bold whitespace-nowrap">
              {section.title}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section className="mb-[10px] w-full p-0">
        <Row>
          <Column className="w-9 py-0 pr-[5px] pl-[30px]">
            <Text className="bg-ink mx-auto my-0 block h-[194px] w-px text-[0px] leading-none">
              &nbsp;
            </Text>
            <Text className="text-ink -mt-px mb-0 text-center text-[10px] leading-[10px]">
              ▼
            </Text>
          </Column>
          <Column className="pt-[10px] pb-5">
            <Row>
              <Column className="w-[300px] pr-3">
                <Text className="m-0 text-[14px] leading-[22px] text-black">
                  {section.description}
                </Text>
              </Column>
              <Column className="w-[170px] text-right">
                <Button
                  className="border-brand-red text-brand-red inline-block rounded-[5px] border border-solid bg-white px-[10px] py-[5px] text-center text-[16px] leading-6 whitespace-nowrap no-underline"
                  href={section.ctaUrl}
                >
                  {section.ctaLabel}
                </Button>
              </Column>
            </Row>

            {section.recommendations?.length ? (
              <Section className="bg-nature mt-[10px] w-full rounded-[5px] px-[15px] py-[10px]">
                <Text className="text-brand-red m-0 mb-[5px] text-[16px] leading-6">
                  {section.recommendationsTitle}
                </Text>
                {section.recommendations.map((recommendation) => (
                  <Text
                    className="text-ink m-0 text-[16px] leading-6"
                    key={recommendation}
                  >
                    {recommendation} &gt;
                  </Text>
                ))}
              </Section>
            ) : null}
          </Column>
        </Row>
      </Section>
    </>
  )
}

function IconBadge({ section }: { section: OrderCrossSellSection }) {
  return (
    <Section className="m-0 h-9 w-9 rounded-[50px] bg-white p-[5px]">
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
