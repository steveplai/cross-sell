import type { FlightOrderCrossSellPromo } from '../types'

const secondsPerMinute = 60
const secondsPerHour = secondsPerMinute * 60
const secondsPerDay = secondsPerHour * 24

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getRemainingPromoSeconds(
  promo: Pick<FlightOrderCrossSellPromo, 'durationSeconds' | 'startsAt'>,
  now = Date.now(),
) {
  const startsAt = Date.parse(promo.startsAt)

  if (!Number.isFinite(startsAt) || promo.durationSeconds <= 0) {
    return 0
  }

  const elapsedSeconds = Math.floor((now - startsAt) / 1000)
  const adjustedElapsedSeconds = Math.max(0, elapsedSeconds)

  return Math.max(
    0,
    Math.min(
      promo.durationSeconds,
      promo.durationSeconds - adjustedElapsedSeconds,
    ),
  )
}

export function getCountdownParts(totalSeconds: number): CountdownParts {
  const safeTotalSeconds = Math.max(0, Math.floor(totalSeconds))

  const days = Math.floor(safeTotalSeconds / secondsPerDay)
  const hours = Math.floor((safeTotalSeconds % secondsPerDay) / secondsPerHour)
  const minutes = Math.floor(
    (safeTotalSeconds % secondsPerHour) / secondsPerMinute,
  )
  const seconds = safeTotalSeconds % secondsPerMinute

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

export function formatCountdownUnit(value: number) {
  return String(value).padStart(2, '0')
}
