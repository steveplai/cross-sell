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
  promo: { startsAt: string; durationSeconds: number },
  now: number,
) {
  const startsAt = new Date(promo.startsAt).getTime()

  if (Number.isNaN(startsAt) || promo.durationSeconds <= 0) {
    return 0
  }

  const endsAt = startsAt + promo.durationSeconds * 1000

  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}

export function getCountdownParts(totalSeconds: number): CountdownParts {
  const safeTotalSeconds = Math.max(0, Math.floor(totalSeconds))

  return {
    days: Math.floor(safeTotalSeconds / secondsPerDay),
    hours: Math.floor((safeTotalSeconds % secondsPerDay) / secondsPerHour),
    minutes: Math.floor((safeTotalSeconds % secondsPerHour) / secondsPerMinute),
    seconds: safeTotalSeconds % secondsPerMinute,
  }
}
