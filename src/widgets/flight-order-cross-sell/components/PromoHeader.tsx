import { Check } from 'lucide-react'

import type { FlightOrderCrossSellPromo } from '../types'
import { CountdownBackground } from './CountdownBackground'
import { PromoCountdown } from './PromoCountdown'

interface PromoHeaderProps {
  isPromoActive: boolean
  promo: FlightOrderCrossSellPromo
  remainingSeconds: number
  onPromoClick?: () => void
}

export function PromoHeader({
  isPromoActive,
  promo,
  remainingSeconds,
  onPromoClick,
}: PromoHeaderProps) {
  return (
    <div
      className={
        isPromoActive
          ? 'relative overflow-hidden rounded-t-(--csc-radius-section) bg-linear-to-b from-(--csc-promo-muted) via-(--csc-header-gradient-mid) to-(--csc-header-gradient-to) px-5 pt-9 pb-6 text-center md:pt-11.25'
          : 'relative overflow-hidden rounded-t-(--csc-radius-section) bg-linear-to-b from-(--csc-header-gradient-from) via-(--csc-header-gradient-mid) to-(--csc-header-gradient-to) px-5 pt-9 pb-6 text-center md:pt-11.25'
      }
    >
      <CountdownBackground className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-36 w-full max-w-150.5 opacity-60" />

      <div className="relative mx-auto flex max-w-90 flex-col items-center gap-3">
        <button
          className="border-0 bg-transparent p-0 text-[22px] leading-7.5 font-bold text-(--csc-promo) md:text-[32px]"
          onClick={onPromoClick}
          type="button"
        >
          {isPromoActive ? promo.activeTitle : promo.expiredTitle}
        </button>

        {isPromoActive ? (
          <>
            <PromoCountdown remainingSeconds={remainingSeconds} />
            <div className="rounded-(--csc-radius-section) border border-border bg-card px-7 py-3 text-xs text-(--csc-text-subtle) shadow-(--csc-shadow-panel)">
              <p className="font-bold">
                {promo.serviceLabel ?? '服務享一筆折扣'}
              </p>
              {promo.benefits && promo.benefits.length > 0 ? (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px]">
                  {promo.benefits.map((benefit) => (
                    <span
                      className="inline-flex items-center gap-1"
                      key={benefit}
                    >
                      <Check className="size-3 text-primary" />
                      {benefit}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
