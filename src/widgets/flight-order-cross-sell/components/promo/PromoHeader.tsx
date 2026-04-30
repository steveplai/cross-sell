import { Check } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import type {
  FlightOrderCrossSellBenefit,
  FlightOrderCrossSellPromo,
} from '../../types'
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
        'relative overflow-visible bg-background text-center',
        'px-3 pt-9 min-[980px]:px-0 min-[980px]:pt-11.25',
        {
          'pb-2.5 min-[980px]:pb-11.25': !isPromoActive,
        },
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-(--lion-promo-header-gradient-from) from-[65.49%] to-(--lion-promo-header-gradient-to) to-[97.74%] min-[980px]:h-full"
      />
      <CountdownBackground />

      <div className="relative mx-auto flex max-w-90 flex-col items-center gap-3 min-[980px]:gap-6">
        <p className="m-0 text-xl leading-7.5 font-bold text-(--lion-orange-600) min-[980px]:text-[32px]">
          {isPromoActive ? promo.activeTitle : promo.expiredTitle}
        </p>

        {isPromoActive ? (
          <>
            <PromoCountdown
              remainingSeconds={remainingSeconds}
              digitDivider={{ visible: false }}
            />
            <div className="rounded-[10px] border border-(--lion-gray-300) bg-transparent p-2">
              <p className="m-0 text-sm leading-5.5 text-foreground">
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
                        <Check className="size-5 text-primary" />
                        {tagLabel ? (
                          <Badge
                            className="rounded bg-(--lion-red-100) px-2 py-0.5 text-xs leading-4.75 font-medium text-primary shadow-none"
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
