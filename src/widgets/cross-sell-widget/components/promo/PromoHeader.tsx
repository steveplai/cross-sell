import { cn } from '@/lib/utils'

import type { CrossSellWidgetPromo } from '../../types'
import { PromoCountdown } from './PromoCountdown'

interface PromoHeaderProps {
  isPromoActive: boolean
  promo: CrossSellWidgetPromo
  remainingSeconds: number
}

export function PromoHeader({
  isPromoActive,
  promo,
  remainingSeconds,
}: PromoHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-linear-to-r from-(--lion-primary-500) to-(--lion-secondary-500)',
        'px-4 py-6 text-white lion-desktop:px-8 lion-desktop:py-8',
      )}
    >
      <div className="relative z-10 flex flex-col items-center gap-4 text-center">
        <div className="space-y-2">
          <p className="text-sm font-medium opacity-90">
            {promo.serviceLabel}
          </p>
          <h2 className="text-2xl font-bold lion-desktop:text-4xl">
            {isPromoActive ? promo.activeTitle : promo.expiredTitle}
          </h2>
        </div>

        {promo.benefits?.length ? (
          <div className="flex flex-wrap items-center justify-center gap-2">
            {promo.benefits.map((benefit, index) => (
              <div
                className="rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur-sm"
                key={benefit.id ?? index}
              >
                {benefit.tagLabel ? `${benefit.tagLabel} ` : ''}
                {benefit.label}
              </div>
            ))}
          </div>
        ) : null}

        {isPromoActive ? (
          <PromoCountdown remainingSeconds={remainingSeconds} />
        ) : null}
      </div>
    </div>
  )
}
