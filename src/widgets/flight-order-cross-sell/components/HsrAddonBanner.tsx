import { Check, MapPin } from 'lucide-react'

import type { FlightOrderCrossSellAddon } from '../types'
import { HsrBackground } from './HsrBackground'

interface HsrAddonBannerProps {
  addon: FlightOrderCrossSellAddon
  onSelectAddon?: () => void
}

export function HsrAddonBanner({ addon, onSelectAddon }: HsrAddonBannerProps) {
  return (
    <section className="relative overflow-hidden bg-card px-5 py-5 md:px-12 md:py-10">
      <HsrBackground className="pointer-events-none absolute right-0 bottom-0 hidden h-18.5 w-90 md:block" />

      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-5">
          <h2 className="text-lg leading-6 font-bold text-foreground">
            {addon.title}
          </h2>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Check aria-hidden="true" className="size-4 text-(--csc-promo)" />
            {addon.description}
          </p>
          {addon.helperLabel ? (
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin
                aria-hidden="true"
                className="size-4 text-(--csc-text-soft)"
              />
              {addon.helperLabel}
            </p>
          ) : null}
        </div>

        <button
          className="h-9 rounded-full border border-primary bg-card px-6 text-sm font-bold text-primary transition hover:bg-(--csc-sale-muted) md:w-auto"
          onClick={onSelectAddon}
          type="button"
        >
          {addon.ctaLabel ?? '前往加購'}
        </button>
      </div>
    </section>
  )
}
