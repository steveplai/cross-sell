import { Button, Column, Row, Section, Text } from '@react-email/components'

import type { TravelPlanCrossSellSection } from '../types'
import { IconBadge } from './IconBadge'

interface FeaturedSectionProps {
  section: TravelPlanCrossSellSection
}

export function FeaturedSection({ section }: FeaturedSectionProps) {
  return (
    <>
      <Section className="bg-brand-red-soft m-0 w-full rounded-[5px] px-3.75 py-2.5">
        <Row>
          <Column className="w-11.75">
            <IconBadge section={section} />
          </Column>
          <Column>
            <Text className="text-ink m-0 text-[16px] leading-6 font-bold whitespace-nowrap">
              {section.title}
            </Text>
          </Column>
        </Row>
      </Section>

      <Section className="mb-2.5 w-full p-0">
        <Row>
          <Column className="w-9 py-0 pr-1.25 pl-7.5">
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
                  {section.ctaLabel}
                </Button>
              </Column>
            </Row>

            {section.recommendations?.length ? (
              <Section className="bg-nature mt-2.5 w-full rounded-[5px] px-3.75 py-2.5">
                <Text className="text-brand-red m-0 mb-1.25 text-[16px] leading-6">
                  {section.recommendationsTitle}
                </Text>
                {section.recommendations.map((recommendation) => (
                  <Text
                    className="text-ink m-0 text-[16px] leading-6 whitespace-nowrap"
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
