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

const supportedPromoStartsAtPattern =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/

function isValidPromoStartsAtParts(groups: Record<string, string>) {
  const year = Number(groups.year)
  const month = Number(groups.month)
  const day = Number(groups.day)
  const hour = Number(groups.hour)
  const minute = Number(groups.minute)
  const second = Number(groups.second)
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()

  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59 &&
    second >= 0 &&
    second <= 59
  )
}

export function parsePromoStartsAt(value: unknown) {
  if (value instanceof Date) {
    const timestamp = value.getTime()

    return Number.isFinite(timestamp) ? timestamp : undefined
  }

  if (typeof value !== 'string') {
    return undefined
  }

  const normalizedValue = value.trim()
  const match = supportedPromoStartsAtPattern.exec(normalizedValue)

  if (!match?.groups || !isValidPromoStartsAtParts(match.groups)) {
    return undefined
  }

  const timestamp = Date.parse(normalizedValue)

  return Number.isFinite(timestamp) ? timestamp : undefined
}

export function getRemainingPromoSeconds(
  promo: Pick<FlightOrderCrossSellPromo, 'durationSeconds' | 'startsAt'>,
  now = Date.now(),
) {
  const startsAt = parsePromoStartsAt(promo.startsAt)

  if (startsAt === undefined || promo.durationSeconds <= 0) {
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
