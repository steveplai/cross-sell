import { Column, Row, Section } from '@react-email/components'

interface HeaderProps {
  title: string
  deadlineText?: string
}

export function Header({ title, deadlineText }: HeaderProps) {
  return (
    <Section className="mb-2.5">
      <Row>
        <Column
          className="w-25"
          height="30"
          style={{ verticalAlign: 'middle' }}
          valign="middle"
        >
          <Row align="left" className="w-auto" width="auto">
            <Column
              className="text-ink font-sans text-[20px] leading-7.5 font-bold whitespace-nowrap"
              height="30"
              style={{ verticalAlign: 'middle' }}
              valign="middle"
            >
              {title}
            </Column>
          </Row>
        </Column>
        {deadlineText ? (
          <Column
            className="pl-4 align-middle"
            height="30"
            style={{ verticalAlign: 'middle' }}
            valign="middle"
          >
            <span className="bg-brand-red-soft text-brand-red inline-block h-6 rounded-[5px] px-1.5 align-middle font-sans text-[12px] leading-[24px] whitespace-nowrap">
              {deadlineText}
            </span>
          </Column>
        ) : null}
      </Row>
    </Section>
  )
}
