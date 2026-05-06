import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components'

import type { TravelPlanCrossSellSection } from '../types'
import { HeaderCtaButton } from './HeaderCtaButton'
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
                <HeaderCtaButton
                  href={section.ctaUrl}
                  label={section.ctaLabel}
                  variant="red"
                />
              </Column>
            </>
          ) : null}
        </Row>
      </Section>

      <Section className="mb-2.5 w-full p-0">
        <Row>
          <Column className="w-9 pt-2.5 pr-1.25 pb-0 pl-7.5">
            <Text className="bg-ink mx-auto my-0 block h-48.5 w-px text-[0px] leading-none">
              &nbsp;
            </Text>
            <Text className="text-ink -mt-px mb-0 text-center text-[10px] leading-2.5">
              ▼
            </Text>
          </Column>
          <Column className="pt-2.5 pb-5">
            <Row>
              <Column className="w-75 pr-3">
                <Text className="m-0 text-[14px] leading-5.5 text-black">
                  {section.description}
                </Text>
              </Column>
              <Column className="w-42.5 text-right">
                <Button
                  className="border-brand-red text-brand-red inline-block rounded-[5px] border border-solid bg-white px-2.5 py-1.25 text-center text-[16px] leading-6 whitespace-nowrap no-underline"
                  href={section.ctaUrl}
                >
                  <span className="inline-block whitespace-nowrap">
                    {section.ctaIconUrl ? (
                      <Img
                        alt=""
                        className="mr-1.25 inline-block size-4 align-bottom"
                        src={section.ctaIconUrl}
                      />
                    ) : null}
                    <span>{section.ctaLabel}</span>
                  </span>
                </Button>
              </Column>
            </Row>

            {section.recommendations?.length ? (
              <Section className="bg-nature mt-2.5 w-full rounded-[5px] px-3.75 py-2.5">
                <Text className="text-brand-red m-0 mb-1.25 text-[16px] leading-6">
                  {section.recommendationsTitle}
                </Text>
                {section.recommendations.map((recommendation, index) => (
                  <Text
                    className="m-0 text-[16px] leading-6 whitespace-nowrap"
                    key={recommendation.url}
                    style={{ marginTop: index === 0 ? 0 : 5 }}
                  >
                    <a
                      className="text-ink inline-block no-underline"
                      href={recommendation.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span className="inline-block max-w-115 truncate align-middle hover:underline">
                        {recommendation.text}
                      </span>
                      <Img
                        alt=""
                        className="inline-block size-4 align-text-bottom"
                        src={recommendation.arrowIconUrl}
                      />
                    </a>
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
