import { Column, Row, Section } from '@react-email/components'

interface HeaderProps {
  title: string
  deadlineText?: string
}

export function Header({ title, deadlineText }: HeaderProps) {
  return (
    <Section className="mb-2.5">
      <Row>
        <Column className="text-ink w-25 font-sans text-[20px] leading-7.5 font-bold whitespace-nowrap">
          {title}
        </Column>
        {deadlineText ? (
          <Column className="pl-4 align-middle">
            <Section align="left" className="m-0 w-auto" width="auto">
              <Row>
                <Column className="bg-brand-red-soft text-brand-red rounded-[5px] px-1.5 py-0.75 font-sans text-[12px] leading-5.5 whitespace-nowrap">
                  {deadlineText}
                </Column>
              </Row>
            </Section>
          </Column>
        ) : null}
      </Row>
    </Section>
  )
}
