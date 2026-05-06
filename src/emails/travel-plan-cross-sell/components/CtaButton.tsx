import { Button, Img } from '@react-email/components'

interface CtaButtonProps {
  href: string
  label: string
  iconUrl?: string
  tone?: 'red' | 'gray'
  variant?: 'compact' | 'regular'
}

const toneClassNames = {
  gray: 'border-muted text-muted',
  red: 'border-brand-red text-brand-red',
} as const

const variantClassNames = {
  compact: {
    button:
      'inline-block w-26 max-w-26 overflow-hidden rounded-[5px] border border-solid bg-white px-0 py-[5px] text-center text-[14px] leading-[22px] whitespace-nowrap no-underline',
    content:
      'inline-block max-w-21 overflow-hidden whitespace-nowrap align-top',
    label: {
      withIcon:
        'inline-block max-w-15.75 overflow-hidden text-ellipsis whitespace-nowrap align-top',
      withoutIcon:
        'inline-block max-w-21 overflow-hidden text-ellipsis whitespace-nowrap align-top',
    },
  },
  regular: {
    button:
      'inline-block rounded-[5px] border border-solid bg-white px-2.5 py-1.25 text-center text-[16px] leading-6 whitespace-nowrap no-underline',
    content: 'inline-block whitespace-nowrap align-bottom',
    label: {
      withIcon: 'inline-block whitespace-nowrap align-bottom',
      withoutIcon: 'inline-block whitespace-nowrap align-bottom',
    },
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
  const labelClassName = iconUrl
    ? variantClassName.label.withIcon
    : variantClassName.label.withoutIcon

  return (
    <Button
      className={`${variantClassName.button} ${toneClassName}`}
      href={href}
    >
      <span className={variantClassName.content}>
        {iconUrl ? (
          <Img
            alt=""
            className="mr-1.25 inline-block size-4 align-bottom"
            src={iconUrl}
          />
        ) : null}
        <span className={labelClassName}>{label}</span>
      </span>
    </Button>
  )
}
