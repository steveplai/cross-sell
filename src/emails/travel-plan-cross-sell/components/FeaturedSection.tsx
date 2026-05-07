import { Column, Img, Link, Row, Section, Text } from '@react-email/components'

import type { TravelPlanCrossSellSection } from '../types'
import { CtaButton } from './CtaButton'
import { IconBadge } from './IconBadge'

interface FeaturedSectionProps {
  section: TravelPlanCrossSellSection
}

export function FeaturedSection({ section }: FeaturedSectionProps) {
  const showHeaderDescriptionAndCta = section.showHeaderDescriptionAndCta

  return (
    <>
      <Section className="bg-brand-red-soft m-0 w-full rounded-[5px] px-3.75 py-2.5">
        <Row
          className={showHeaderDescriptionAndCta ? 'table-fixed' : undefined}
        >
          <Column className="w-11.75">
            <IconBadge section={section} />
          </Column>
          <Column className={showHeaderDescriptionAndCta ? 'w-18' : undefined}>
            <Text className="text-ink m-0 text-[16px] leading-6 font-bold whitespace-nowrap">
              {section.title}
            </Text>
          </Column>
          {showHeaderDescriptionAndCta ? (
            <>
              <Column className="w-60.25 pr-3">
                <Text className="m-0 text-[14px] leading-5.5 whitespace-nowrap text-black">
                  {section.description}
                </Text>
              </Column>
              <Column className="w-42.5 text-right">
                <CtaButton
                  href={section.ctaUrl}
                  label={section.ctaLabel}
                  tone="red"
                />
              </Column>
            </>
          ) : null}
        </Row>
      </Section>

      <Section className="mb-2.5 w-full p-0">
        <Row>
          <Column className="w-9 pt-2.5 pr-1.25 pb-0 pl-7.5">
            <Section align="center" className="m-0 w-px" width="1">
              <Row>
                <Column className="bg-ink h-48.5 w-px text-[0px] leading-none">
                  &nbsp;
                </Column>
              </Row>
            </Section>
            <Section className="m-0 w-full">
              <Row>
                <Column className="text-ink text-center font-sans text-[10px] leading-2.5">
                  ▼
                </Column>
              </Row>
            </Section>
          </Column>
          <Column className="pt-2.5 pb-5">
            <Row>
              <Column className="w-75 pr-3">
                <Text className="m-0 text-[14px] leading-5.5 text-black">
                  {section.description}
                </Text>
              </Column>
              <Column className="w-42.5 text-right">
                <CtaButton
                  href={section.ctaUrl}
                  iconUrl={section.ctaIconUrl}
                  label={section.ctaLabel}
                  tone="red"
                  variant="regular"
                />
              </Column>
            </Row>

            {section.recommendations?.length ? (
              <Section className="bg-nature mt-2.5 w-full rounded-[5px] px-3.75 py-2.5">
                <Text className="text-brand-red m-0 mb-1.25 text-[16px] leading-6">
                  {section.recommendationsTitle}
                </Text>
                <Section className="m-0 w-full">
                  {section.recommendations.map((recommendation, index) => (
                    <Row key={recommendation.url}>
                      <Column
                        className={`align-top font-sans text-[16px] leading-6 ${
                          index === 0 ? 'pt-0' : 'pt-1.25'
                        }`}
                      >
                        <Link
                          className="text-ink no-underline"
                          href={recommendation.url}
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                          target="_blank"
                        >
                          {recommendation.text}
                        </Link>
                      </Column>
                      <Column
                        className={`w-4 pl-1 align-top text-[0px] leading-none ${
                          index === 0 ? 'pt-1' : 'pt-2.25'
                        }`}
                        width="16"
                      >
                        <Link
                          className="no-underline"
                          href={recommendation.url}
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                          target="_blank"
                        >
                          <Img
                            alt=""
                            className="block"
                            height="16"
                            src={recommendation.arrowIconUrl}
                            width="16"
                          />
                        </Link>
                      </Column>
                    </Row>
                  ))}
                </Section>
              </Section>
            ) : null}
          </Column>
        </Row>
      </Section>
    </>
  )
}
