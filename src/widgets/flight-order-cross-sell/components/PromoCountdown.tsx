import { formatCountdownUnit, getCountdownParts } from '../countdown'

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
          <span className="flex h-8 min-w-9 items-center justify-center bg-[#eef1f4] px-2 text-center text-base leading-8 font-bold text-[#222]">
            {formatCountdownUnit(value)}
          </span>
          <span className="text-xs leading-5 text-[#444]">
            {countdownLabels[index]}
          </span>
        </div>
      ))}
    </div>
  )
}
