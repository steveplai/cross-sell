import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

export interface FlipNumberDivider {
  color?: string
  opacity?: number | string
  thickness?: number | string
  visible?: boolean
}

export interface FlipNumberProps {
  className?: string
  divider?: FlipNumberDivider
  minDigits?: number
  value: number | string
}

interface FlipNumberDigitProps {
  digit: string
}

interface FlipNumberDividerCssVariables extends CSSProperties {
  '--csc-flip-number-divider-color'?: string
  '--csc-flip-number-divider-opacity'?: number | string
  '--csc-flip-number-divider-thickness'?: string
}

const flipAnimationDurationMs = 520
const flipNumberDigitFaceClassName =
  'absolute inset-0 grid place-items-center rounded-[2px] bg-inherit [backface-visibility:hidden]'

function formatCssLength(value: number | string | undefined) {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

function formatFlipNumberValue(value: number | string, minDigits: number) {
  if (typeof value === 'number') {
    return String(Math.floor(Math.max(0, value))).padStart(minDigits, '0')
  }

  if (/^\d+$/.test(value)) {
    return value.padStart(minDigits, '0')
  }

  return value
}

function getFlipNumberDividerStyle(
  divider: FlipNumberDivider | undefined,
): FlipNumberDividerCssVariables {
  return {
    '--csc-flip-number-divider-color': divider?.color,
    '--csc-flip-number-divider-opacity': divider?.opacity,
    '--csc-flip-number-divider-thickness': formatCssLength(divider?.thickness),
  }
}

function FlipNumberDigit({ digit }: FlipNumberDigitProps) {
  const previousDigitRef = useRef(digit)
  const [flippingDigit, setFlippingDigit] = useState<string | null>(null)

  useLayoutEffect(() => {
    if (previousDigitRef.current === digit) {
      return
    }

    setFlippingDigit(previousDigitRef.current)
    previousDigitRef.current = digit

    const timeoutId = window.setTimeout(() => {
      setFlippingDigit(null)
    }, flipAnimationDurationMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [digit])

  return (
    <span
      className={cn(
        'csc-flip-number-digit',
        'relative inline-grid place-items-center bg-inherit leading-none',
        'block-[1em] inline-[0.58em]',
        'perspective-[140px] transform-3d',
      )}
    >
      <span
        className={cn(
          flipNumberDigitFaceClassName,
          'csc-flip-number-digit-face',
          'z-1',
          flippingDigit ? 'csc-flip-number-digit-face-enter' : '',
        )}
      >
        {digit}
      </span>
      {flippingDigit ? (
        <span
          className={cn(
            flipNumberDigitFaceClassName,
            'csc-flip-number-digit-flipper',
            'z-2',
          )}
        >
          {flippingDigit}
        </span>
      ) : null}
    </span>
  )
}

export function FlipNumber({
  className,
  divider,
  minDigits = 2,
  value,
}: FlipNumberProps) {
  const formattedValue = formatFlipNumberValue(value, minDigits)

  return (
    <span
      aria-hidden="true"
      className={cn('csc-flip-number', className)}
      data-flip-number-divider={
        divider?.visible === false ? 'hidden' : 'visible'
      }
      style={getFlipNumberDividerStyle(divider)}
    >
      {formattedValue.split('').map((digit, index) => (
        <FlipNumberDigit digit={digit} key={index} />
      ))}
    </span>
  )
}
