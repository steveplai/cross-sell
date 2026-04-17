import { Column, Row, Section, Text } from '@react-email/components'

interface HeaderProps {
  title: string
  deadlineText?: string
}

export function Header({ title, deadlineText }: HeaderProps) {
  return (
    <Section className="mb-2.5">
      <Row>
        <Column className="w-25">
          <Text className="text-ink m-0 text-[20px] leading-7.5 font-bold">
            {title}
          </Text>
        </Column>
        {deadlineText ? (
          <Column>
            <Text className="bg-brand-red-soft text-brand-red m-0 ml-4 inline-block rounded-[5px] px-1.5 py-0.75 text-[12px] leading-5.5">
              {deadlineText}
            </Text>
          </Column>
        ) : null}
      </Row>
    </Section>
  )
}
