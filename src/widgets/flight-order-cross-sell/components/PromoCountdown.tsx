import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { formatCountdownUnit, getCountdownParts } from '../lib/countdown'

interface PromoCountdownProps {
  digitDivider?: PromoCountdownDigitDivider
  remainingSeconds: number
}

export interface PromoCountdownDigitDivider {
  color?: string
  opacity?: number | string
  thickness?: number | string
  visible?: boolean
}

const countdownLabels = ['天', '時', '分', '秒'] as const
const flipAnimationDurationMs = 520

interface FlipCountdownUnitProps {
  digitDivider?: PromoCountdownDigitDivider
  value: number
}

interface FlipCountdownDigitProps {
  digit: string
}

interface CountdownDividerCssVariables extends CSSProperties {
  '--csc-countdown-digit-divider-color'?: string
  '--csc-countdown-digit-divider-opacity'?: number | string
  '--csc-countdown-digit-divider-thickness'?: string
}

function formatCssLength(value: number | string | undefined) {
  if (typeof value === 'number') {
    return `${value}px`
  }

  return value
}

function getCountdownDividerStyle(
  digitDivider: PromoCountdownDigitDivider | undefined,
): CountdownDividerCssVariables {
  return {
    '--csc-countdown-digit-divider-color': digitDivider?.color,
    '--csc-countdown-digit-divider-opacity': digitDivider?.opacity,
    '--csc-countdown-digit-divider-thickness': formatCssLength(
      digitDivider?.thickness,
    ),
  }
}

function FlipCountdownDigit({ digit }: FlipCountdownDigitProps) {
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
    <span className="csc-countdown-digit">
      <span
        className={cn(
          'csc-countdown-digit-face',
          flippingDigit ? 'csc-countdown-digit-face-enter' : '',
        )}
      >
        {digit}
      </span>
      {flippingDigit ? (
        <span className="csc-countdown-digit-flipper">{flippingDigit}</span>
      ) : null}
    </span>
  )
}

function FlipCountdownUnit({ digitDivider, value }: FlipCountdownUnitProps) {
  const formattedValue = formatCountdownUnit(value)

  return (
    <span
      aria-hidden="true"
      className={cn(
        'flex h-7 min-w-7 items-center justify-center gap-px p-1 md:h-10 md:min-w-10',
        'rounded-lg bg-(--lion-gray-200) text-(--lion-gray-900)',
        'text-center text-sm leading-5.5 font-bold',
        'md:text-xl md:leading-8',
        'overflow-hidden',
        'csc-countdown-unit',
      )}
      data-countdown-divider={
        digitDivider?.visible === false ? 'hidden' : 'visible'
      }
      style={getCountdownDividerStyle(digitDivider)}
    >
      {formattedValue.split('').map((digit, index) => (
        <FlipCountdownDigit digit={digit} key={index} />
      ))}
    </span>
  )
}

export function PromoCountdown({
  digitDivider,
  remainingSeconds,
}: PromoCountdownProps) {
  const parts = getCountdownParts(remainingSeconds)
  const values = [parts.days, parts.hours, parts.minutes, parts.seconds]

  return (
    <div
      aria-label={`優惠倒數 ${parts.days} 天 ${parts.hours} 時 ${parts.minutes} 分 ${parts.seconds} 秒`}
      className="flex items-center justify-center gap-3"
    >
      {values.map((value, index) => (
        <div className="flex items-center gap-1" key={countdownLabels[index]}>
          <FlipCountdownUnit digitDivider={digitDivider} value={value} />
          <span className="text-xs leading-5.5 text-(--lion-gray-800) md:text-sm">
            {countdownLabels[index]}
          </span>
        </div>
      ))}
    </div>
  )
}
