import { Button } from '@react-email/components'

interface HeaderCtaButtonProps {
  href: string
  label: string
  variant?: 'red' | 'gray'
}

const baseButtonClassName =
  'inline-block w-26 max-w-26 overflow-hidden rounded-[5px] border border-solid bg-white px-0 py-[5px] text-center text-[14px] leading-[22px] whitespace-nowrap no-underline'

const labelClassName =
  'inline-block w-21 max-w-21 overflow-hidden text-center text-ellipsis whitespace-nowrap align-top'

export function HeaderCtaButton({
  href,
  label,
  variant = 'gray',
}: HeaderCtaButtonProps) {
  const buttonClassName =
    variant === 'red'
      ? `${baseButtonClassName} border-brand-red text-brand-red`
      : `${baseButtonClassName} border-muted text-muted`

  return (
    <Button className={buttonClassName} href={href}>
      <span className={labelClassName}>{label}</span>
    </Button>
  )
}
