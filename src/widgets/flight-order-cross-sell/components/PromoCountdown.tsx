import { cn } from '@/lib/utils'

import { formatCountdownUnit, getCountdownParts } from '../lib/countdown'

interface PromoCountdownProps {
  remainingSeconds: number
}

const countdownLabels = ['天', '時', '分', '秒'] as const

export function PromoCountdown({ remainingSeconds }: PromoCountdownProps) {
  const parts = getCountdownParts(remainingSeconds)
  const values = [parts.days, parts.hours, parts.minutes, parts.seconds]

  return (
    <div
      aria-label={`優惠倒數 ${parts.days} 天 ${parts.hours} 時 ${parts.minutes} 分 ${parts.seconds} 秒`}
      className="flex items-center justify-center gap-3"
    >
      {values.map((value, index) => (
        <div className="flex items-center gap-1" key={countdownLabels[index]}>
          <span
            className={cn(
              'flex h-7 min-w-7 items-center justify-center p-1 md:h-10 md:min-w-10',
              'rounded-lg bg-(--lion-gray-200) text-(--lion-gray-900)',
              'text-center text-sm leading-5.5 font-bold',
              'md:text-xl md:leading-8',
            )}
          >
            {formatCountdownUnit(value)}
          </span>
          <span className="text-xs leading-5.5 text-(--lion-gray-800) md:text-sm">
            {countdownLabels[index]}
          </span>
        </div>
      ))}
    </div>
  )
}
