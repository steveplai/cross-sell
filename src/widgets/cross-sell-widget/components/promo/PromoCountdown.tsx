import { useEffect, useRef, useState } from 'react'

import {
  FlipNumber,
  type FlipNumberDivider,
} from '@/components/animated/FlipNumber'
import { cn } from '@/lib/utils'

import {
  getCountdownParts,
  getRemainingPromoSeconds,
} from '../../lib/countdown'
import type { CrossSellWidgetPromo } from '../../types'

interface PromoCountdownProps {
  digitDivider?: FlipNumberDivider
  promo: CrossSellWidgetPromo
}

export type PromoCountdownDigitDivider = FlipNumberDivider

const countdownLabels = ['天', '時', '分', '秒'] as const

export function PromoCountdown({ digitDivider, promo }: PromoCountdownProps) {
  const remainingSeconds = usePromoRemainingSeconds(promo)
  const parts = getCountdownParts(remainingSeconds)
  const values = [parts.days, parts.hours, parts.minutes, parts.seconds]

  return (
    <div
      aria-label={`優惠倒數 ${parts.days} 天 ${parts.hours} 時 ${parts.minutes} 分 ${parts.seconds} 秒`}
      className="flex items-center justify-center gap-3"
    >
      {values.map((value, index) => (
        <div className="flex items-center gap-1" key={countdownLabels[index]}>
          <FlipNumber
            className={cn(
              'flex h-7 min-w-7 items-center justify-center gap-px p-1 lion-desktop:h-10 lion-desktop:min-w-10',
              'overflow-hidden rounded-lg bg-(--lion-gray-200) text-(--lion-gray-900)',
              'text-center text-sm leading-5.5 font-bold lion-desktop:text-xl lion-desktop:leading-8',
            )}
            divider={digitDivider}
            minDigits={2}
            value={value}
          />
          <span className="text-xs leading-5.5 text-(--lion-gray-800) lion-desktop:text-sm">
            {countdownLabels[index]}
          </span>
        </div>
      ))}
    </div>
  )
}

function usePromoRemainingSeconds({
  durationSeconds,
  startsAt,
}: Pick<CrossSellWidgetPromo, 'durationSeconds' | 'startsAt'>) {
  const [, requestCountdownRefresh] = useState(0)
  const remainingSeconds = getRemainingPromoSeconds({
    durationSeconds,
    startsAt,
  })
  const renderedRemainingSecondsRef = useRef(remainingSeconds)

  useEffect(() => {
    const promoTiming = { durationSeconds, startsAt }

    renderedRemainingSecondsRef.current = getRemainingPromoSeconds(promoTiming)

    if (renderedRemainingSecondsRef.current <= 0) {
      return
    }

    const intervalId = window.setInterval(() => {
      const nextRemainingSeconds = getRemainingPromoSeconds(promoTiming)

      if (nextRemainingSeconds !== renderedRemainingSecondsRef.current) {
        renderedRemainingSecondsRef.current = nextRemainingSeconds
        requestCountdownRefresh((refreshCount) => refreshCount + 1)
      }

      if (nextRemainingSeconds <= 0) {
        window.clearInterval(intervalId)
      }
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [durationSeconds, startsAt])

  return remainingSeconds
}
