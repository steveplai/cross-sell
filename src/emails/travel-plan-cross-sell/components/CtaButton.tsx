import { Column, Img, Link, Row, Section } from '@react-email/components'

interface CtaButtonProps {
  href: string
  label: string
  iconUrl?: string
  tone?: 'red' | 'gray'
  variant?: 'compact' | 'regular'
}

const toneClassNames = {
  gray: {
    border: 'border-muted',
    text: 'text-muted',
  },
  red: {
    border: 'border-brand-red',
    text: 'text-brand-red',
  },
} as const

const variantClassNames = {
  compact: {
    cell: 'h-8.5 w-26 rounded-[5px] border border-solid bg-white px-0 text-center align-middle',
    height: '34',
    iconCell: 'w-4 align-middle text-[0px] leading-none',
    link: 'font-sans text-[14px] leading-[22px] whitespace-nowrap no-underline',
    spacerCell: 'w-1.25 text-[0px] leading-none',
    table: 'm-0 w-26',
    width: '104',
  },
  regular: {
    cell: 'h-9 w-42.5 rounded-[5px] border border-solid bg-white px-2.5 text-center align-middle',
    height: '36',
    iconCell: 'w-4 align-middle text-[0px] leading-none',
    link: 'font-sans text-[16px] leading-6 whitespace-nowrap no-underline',
    spacerCell: 'w-1.25 text-[0px] leading-none',
    table: 'm-0 w-42.5',
    width: '170',
  },
} as const

export function CtaButton({
  href,
  iconUrl,
  label,
  tone = 'gray',
  variant = 'compact',
}: CtaButtonProps) {
  const toneClassName = toneClassNames[tone]
  const variantClassName = variantClassNames[variant]

  return (
    <Section
      align="right"
      className={variantClassName.table}
      width={variantClassName.width}
    >
      <Row>
        <Column
          align="center"
          className={`${variantClassName.cell} ${toneClassName.border}`}
          height={variantClassName.height}
          style={{ verticalAlign: 'middle' }}
          valign="middle"
          width={variantClassName.width}
        >
          <Section align="center" className="m-0 w-auto" width="auto">
            <Row align="center" className="w-auto" width="auto">
              {iconUrl ? (
                <>
                  <Column
                    className={variantClassName.iconCell}
                    height="16"
                    style={{ verticalAlign: 'middle' }}
                    valign="middle"
                    width="16"
                  >
                    <Img
                      alt=""
                      className="block"
                      height="16"
                      src={iconUrl}
                      width="16"
                    />
                  </Column>
                  <Column
                    className={variantClassName.spacerCell}
                    style={{ verticalAlign: 'middle' }}
                    valign="middle"
                    width="5"
                  >
                    &nbsp;
                  </Column>
                </>
              ) : null}
              <Column
                className="align-middle"
                style={{ verticalAlign: 'middle' }}
                valign="middle"
              >
                <Link
                  className={`${variantClassName.link} ${toneClassName.text}`}
                  href={href}
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  target="_blank"
                >
                  {label}
                </Link>
              </Column>
            </Row>
          </Section>
        </Column>
      </Row>
    </Section>
  )
}
