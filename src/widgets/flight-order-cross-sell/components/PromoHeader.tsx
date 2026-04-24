import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type {
  FlightOrderCrossSellBenefit,
  FlightOrderCrossSellPromo,
} from '../types'
import { CountdownBackground } from './CountdownBackground'
import { PromoCountdown } from './PromoCountdown'

interface PromoHeaderProps {
  isPromoActive: boolean
  promo: FlightOrderCrossSellPromo
  remainingSeconds: number
}

function getBenefitContent(benefit: FlightOrderCrossSellBenefit): {
  label: string
  tagLabel?: string
} {
  return typeof benefit === 'string' ? { label: benefit } : benefit
}

function getBenefitKey(benefit: FlightOrderCrossSellBenefit, index: number) {
  return typeof benefit === 'string'
    ? benefit
    : (benefit.id ?? `${benefit.label}-${index}`)
}

export function PromoHeader({
  isPromoActive,
  promo,
  remainingSeconds,
}: PromoHeaderProps) {
  return (
    <div
      className={cn(
        'relative overflow-visible text-center',
        'px-3 pt-9 md:px-0 md:pt-11.25',
        'bg-linear-to-b from-[#fff5eb] to-white bg-size-[100%_60%] bg-no-repeat',
        'md:via-[#fff8f1] md:bg-size-[100%_100%]',
      )}
    >
      <CountdownBackground />

      <div className="relative mx-auto flex max-w-90 flex-col items-center gap-3 md:gap-6">
        <p className="m-0 text-xl leading-7.5 font-bold text-[#ff8400] md:text-[32px]">
          {isPromoActive ? promo.activeTitle : promo.expiredTitle}
        </p>

        {isPromoActive ? (
          <>
            <PromoCountdown remainingSeconds={remainingSeconds} digitDivider={{ visible: false }} />
            <div className="rounded-[10px] border border-(--lion-gray-300) bg-transparent p-2">
              <p className="m-0 text-sm leading-5.5 text-(--lion-gray-900)">
                {promo.serviceLabel ?? '加訂住宿、高鐵與票券享專屬折扣'}
              </p>
              {promo.benefits && promo.benefits.length > 0 ? (
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs leading-5.5 text-(--lion-gray-700)">
                  {promo.benefits.map((benefit, index) => {
                    const { label, tagLabel } = getBenefitContent(benefit)

                    return (
                      <span
                        className="inline-flex items-center gap-1"
                        key={getBenefitKey(benefit, index)}
                      >
                        <Check className="size-5 text-(--lion-red-600)" />
                        {tagLabel ? (
                          <Badge
                            className="rounded bg-(--lion-red-100) px-2 py-0.5 text-xs leading-4.75 font-medium text-(--lion-red-600) shadow-none"
                            variant="ghost"
                          >
                            {tagLabel}
                          </Badge>
                        ) : null}
                        <span>{label}</span>
                      </span>
                    )
                  })}
                </div>
              ) : null}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
