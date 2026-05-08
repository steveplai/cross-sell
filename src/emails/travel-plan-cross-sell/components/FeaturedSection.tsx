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
      <Section className="bg-brand-red-soft m-0 w-full table-fixed rounded-[5px] px-3.75 py-2.5">
        <Row
          className={
            showHeaderDescriptionAndCta ? 'w-full table-fixed' : undefined
          }
        >
          <Column className="w-11.75">
            <IconBadge section={section} />
          </Column>
          <Column className={showHeaderDescriptionAndCta ? 'w-18' : undefined}>
            <Text className="text-ink m-0 font-sans text-[16px] leading-6 font-bold whitespace-nowrap">
              {section.title}
            </Text>
          </Column>
          {showHeaderDescriptionAndCta ? (
            <>
              <Column className="w-74.75">
                <Text className="m-0 font-sans text-[14px] leading-5.5 whitespace-nowrap text-black">
                  {section.description}
                </Text>
              </Column>
              <Column className="w-28 text-right">
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

      <Section className="mb-2.5 w-full table-fixed p-0">
        <Row>
          <Column className="w-9 pt-2.5 pr-1.25 pb-0 pl-7.5">
            <Section
              align="center"
              className="m-0 w-2.75"
              style={{ width: '11px' }}
              width="11"
            >
              <Row>
                <Column
                  className="h-48.5 w-1.25 text-[0px] leading-none"
                  height="194"
                  width="5"
                >
                  &nbsp;
                </Column>
                <Column
                  className="bg-ink h-48.5 w-px text-[0px] leading-none"
                  height="194"
                  width="1"
                >
                  &nbsp;
                </Column>
                <Column
                  className="h-48.5 w-1.25 text-[0px] leading-none"
                  height="194"
                  width="5"
                >
                  &nbsp;
                </Column>
              </Row>
              <Row>
                <Column
                  align="center"
                  className="text-ink w-2.75 text-center font-sans text-[10px] leading-2.5"
                  style={{ textAlign: 'center', width: '11px' }}
                  width="11"
                >
                  ▼
                </Column>
              </Row>
            </Section>
          </Column>
          <Column className="pt-2.5 pb-5">
            <Row>
              <Column className="w-75 pr-3">
                <Text className="m-0 font-sans text-[14px] leading-5.5 text-black">
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
                <Text className="text-brand-red m-0 mb-1.25 font-sans text-[16px] leading-6">
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
                        <Row
                          className="w-full table-fixed"
                          style={{ tableLayout: 'fixed', width: '100%' }}
                          width="100%"
                        >
                          <Column
                            className="h-6 overflow-hidden align-middle font-sans text-[16px] leading-6 whitespace-nowrap"
                            height="24"
                            style={{
                              height: '24px',
                              overflow: 'hidden',
                              verticalAlign: 'middle',
                              whiteSpace: 'nowrap',
                              width: '100%',
                            }}
                            valign="middle"
                            width="100%"
                          >
                            <Link
                              className="recommendation-link-text-anchor text-ink block w-full font-sans whitespace-nowrap no-underline"
                              href={recommendation.url}
                              rel="noopener noreferrer"
                              style={{
                                color: '#222222',
                                display: 'block',
                                height: '24px',
                                lineHeight: '24px',
                                textDecoration: 'none',
                                whiteSpace: 'nowrap',
                                width: '100%',
                              }}
                              target="_blank"
                            >
                              <span
                                className="recommendation-link-text inline-block overflow-hidden text-ellipsis whitespace-nowrap"
                                data-testid="recommendation-link-text"
                                style={{
                                  display: 'inline-block',
                                  lineHeight: '24px',
                                  maxWidth: '100%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  verticalAlign: 'top',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {recommendation.text}
                              </span>
                            </Link>
                          </Column>
                          <Column
                            className="h-6 w-5 pl-1 align-middle text-[0px] leading-none"
                            height="24"
                            style={{
                              height: '24px',
                              paddingLeft: '4px',
                              verticalAlign: 'middle',
                              width: '20px',
                            }}
                            valign="middle"
                            width="20"
                          >
                            <Link
                              className="recommendation-link-arrow-anchor block no-underline"
                              href={recommendation.url}
                              rel="noopener noreferrer"
                              style={{
                                display: 'block',
                                textDecoration: 'none',
                                width: '16px',
                              }}
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
