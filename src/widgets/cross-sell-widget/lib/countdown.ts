export function getRemainingPromoSeconds(
  promo: { startsAt: string; durationSeconds: number },
  now: number,
) {
  const startsAt = new Date(promo.startsAt).getTime()

  if (Number.isNaN(startsAt)) {
    return 0
  }

  const endsAt = startsAt + promo.durationSeconds * 1000

  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}
