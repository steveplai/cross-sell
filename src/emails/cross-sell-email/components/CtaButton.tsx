import { Column, Img, Link, Row } from '@react-email/components'

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
    cell: 'h-8.5 rounded-[5px] border border-solid bg-white px-0 text-center align-middle',
    fontSize: 14,
    height: 34,
    iconCell: 'w-4 align-middle text-[0px] leading-none',
    lineHeight: 22,
    link: 'font-sans text-[14px] leading-[22px] whitespace-nowrap no-underline',
    paddingX: 10,
    spacerCell: 'w-1.25 text-[0px] leading-none',
  },
  regular: {
    cell: 'h-8.5 rounded-[5px] border border-solid bg-white px-0 text-center align-middle',
    fontSize: 16,
    height: 34,
    iconCell: 'w-4 align-middle text-[0px] leading-none',
    lineHeight: 24,
    link: 'font-sans text-[16px] leading-6 whitespace-nowrap no-underline',
    paddingX: 10,
    spacerCell: 'w-1.25 text-[0px] leading-none',
  },
} as const

const iconSize = 16
const iconGap = 5

function calculateCtaButtonMetrics({
  hasIcon,
  label,
  variant,
}: {
  hasIcon: boolean
  label: string
  variant: keyof typeof variantClassNames
}) {
  const variantClassName = variantClassNames[variant]
  const textWidth = label.length * variantClassName.fontSize
  const contentWidth = textWidth + (hasIcon ? iconSize + iconGap : 0)
  const buttonWidth = contentWidth + variantClassName.paddingX * 2

  return {
    buttonWidth: `${buttonWidth}`,
    contentWidth: `${contentWidth}`,
    textWidth: `${textWidth}`,
  }
}

export function CtaButton({
  href,
  iconUrl,
  label,
  tone = 'gray',
  variant = 'compact',
}: CtaButtonProps) {
  const toneClassName = toneClassNames[tone]
  const variantClassName = variantClassNames[variant]
  const hasIcon = Boolean(iconUrl)
  const metrics = calculateCtaButtonMetrics({ hasIcon, label, variant })
  const height = `${variantClassName.height}`
  const lineHeight = `${variantClassName.lineHeight}px`

  return (
    <Row
      align="right"
      style={{ width: `${metrics.buttonWidth}px` }}
      width={metrics.buttonWidth}
    >
      <Column
        align="center"
        className={`${variantClassName.cell} ${toneClassName.border}`}
        height={height}
        style={{
          verticalAlign: 'middle',
          width: `${metrics.buttonWidth}px`,
        }}
        valign="middle"
        width={metrics.buttonWidth}
      >
        {iconUrl ? (
          <Row
            align="center"
            style={{ width: `${metrics.contentWidth}px` }}
            width={metrics.contentWidth}
          >
            <Column
              className={variantClassName.iconCell}
              height={height}
              style={{ verticalAlign: 'middle' }}
              valign="middle"
              width={`${iconSize}`}
            >
              <Img
                alt=""
                className="block"
                height={`${iconSize}`}
                src={iconUrl}
                width={`${iconSize}`}
              />
            </Column>
            <Column
              className={variantClassName.spacerCell}
              height={height}
              style={{ verticalAlign: 'middle' }}
              valign="middle"
              width={`${iconGap}`}
            >
              &nbsp;
            </Column>
            <Column
              height={height}
              style={{
                verticalAlign: 'middle',
                width: `${metrics.textWidth}px`,
              }}
              valign="middle"
              width={metrics.textWidth}
            >
              <Link
                className={`${variantClassName.link} ${toneClassName.text}`}
                href={href}
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  lineHeight,
                  textDecoration: 'none',
                  width: `${metrics.textWidth}px`,
                }}
                target="_blank"
              >
                {label}
              </Link>
            </Column>
          </Row>
        ) : (
          <Link
            className={`${variantClassName.link} ${toneClassName.text}`}
            href={href}
            rel="noopener noreferrer"
            style={{
              display: 'block',
              lineHeight: `${height}px`,
              textAlign: 'center',
              textDecoration: 'none',
              width: `${metrics.buttonWidth}px`,
            }}
            target="_blank"
          >
            {label}
          </Link>
        )}
      </Column>
    </Row>
  )
}
