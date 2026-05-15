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

function getBenefitKey(benefit: FlightOrderCrossSellBenefit, index: number) {
  return benefit.id ?? `${benefit.label}-${index}`
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
        'px-3 pt-9 lion-desktop:px-0 lion-desktop:pt-11.25',
        {
          'pb-2.5 lion-desktop:pb-11.25': !isPromoActive,
        },
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-(--lion-promo-header-gradient-from) from-[65.49%] to-(--lion-promo-header-gradient-to) to-[97.74%] lion-desktop:h-full"
      />
      <CountdownBackground />

      <div className="relative mx-auto flex max-w-90 flex-col items-center gap-3 lion-desktop:gap-6">
        <p className="m-0 text-xl leading-7.5 font-bold text-(--lion-orange-600) lion-desktop:text-[32px]">
          {isPromoActive ? promo.activeTitle : promo.expiredTitle}
        </p>

        {isPromoActive ? (
          <>
            <PromoCountdown
              remainingSeconds={remainingSeconds}
              digitDivider={{ visible: false }}
            />
            <div className="rounded-(--lion-panel-radius) border border-(--lion-gray-300) bg-transparent p-2">
              <p className="m-0 text-sm leading-5.5 text-foreground">
                {promo.serviceLabel}
              </p>
              {promo.benefits && promo.benefits.length > 0 ? (
                <div className="mt-1 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs leading-5.5 text-(--lion-gray-700)">
                  {promo.benefits.map((benefit, index) => (
                    <span
                      className="inline-flex items-center gap-1"
                      key={getBenefitKey(benefit, index)}
                    >
                      <Check className="size-5 text-primary" />
                      {benefit.tagLabel ? (
                        <Badge
                          className="rounded bg-(--lion-red-100) px-2 py-0.5 text-xs leading-4.75 font-medium text-primary shadow-none"
                          variant="ghost"
                        >
                          {benefit.tagLabel}
                        </Badge>
                      ) : null}
                      <span>{benefit.label}</span>
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
