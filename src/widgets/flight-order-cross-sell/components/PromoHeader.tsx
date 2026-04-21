import { Check } from 'lucide-react'

import type { FlightOrderCrossSellPromo } from '../types'
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
          ? 'relative overflow-hidden rounded-t-[10px] bg-linear-to-b from-[#fff3e5] via-[#fff8f1] to-white px-5 pt-9 pb-6 text-center md:pt-11.25'
          : 'relative overflow-hidden rounded-t-[10px] bg-linear-to-b from-[#fff5eb] via-[#fff8f1] to-white px-5 pt-9 pb-6 text-center md:pt-11.25'
      }
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-36 max-w-150.5 opacity-60"
      >
        <div className="absolute top-8 left-[18%] h-2 w-2 rounded-full bg-[#ffd7ad]" />
        <div className="absolute top-11 right-[20%] h-2 w-2 rounded-full bg-[#ffd7ad]" />
        <div className="absolute top-2 left-[28%] text-5xl leading-none text-[#ffd7ad]">
          *
        </div>
        <div className="absolute top-0 right-[28%] text-7xl leading-none text-[#ffd7ad]">
          *
        </div>
        <div className="absolute top-5 right-[15%] h-10 w-24 rounded-[50%] border-t-8 border-[#ffd7ad]" />
        <div className="absolute top-8 left-[15%] h-8 w-20 rounded-[50%] border-t-8 border-[#ffd7ad]" />
      </div>

      <div className="relative mx-auto flex max-w-90 flex-col items-center gap-3">
        <button
          className="border-0 bg-transparent p-0 text-[22px] leading-7.5 font-bold text-[#ff8400] md:text-[32px]"
          onClick={onPromoClick}
          type="button"
        >
          {isPromoActive ? promo.activeTitle : promo.expiredTitle}
        </button>

        {isPromoActive ? (
          <>
            <PromoCountdown remainingSeconds={remainingSeconds} />
            <div className="rounded border border-[#ececec] bg-white px-7 py-3 text-xs text-[#444] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
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
                      <Check className="size-3 text-[#f03742]" />
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
