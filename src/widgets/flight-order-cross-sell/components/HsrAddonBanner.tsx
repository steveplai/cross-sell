import { Check, MapPin, Train } from 'lucide-react'

import type { FlightOrderCrossSellAddon } from '../types'

interface HsrAddonBannerProps {
  addon: FlightOrderCrossSellAddon
  onSelectAddon?: () => void
}

export function HsrAddonBanner({ addon, onSelectAddon }: HsrAddonBannerProps) {
  return (
    <section className="relative overflow-hidden bg-white px-5 py-5 md:px-12 md:py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
        <div className="flex min-w-0 flex-1 flex-col gap-1 md:flex-row md:items-center md:gap-5">
          <h2 className="text-lg leading-6 font-bold text-[#222]">
            {addon.title}
          </h2>
          <p className="flex items-center gap-1 text-sm text-[#666]">
            <Check aria-hidden="true" className="size-4 text-[#ff8400]" />
            {addon.description}
          </p>
          {addon.helperLabel ? (
            <p className="flex items-center gap-1 text-sm text-[#666]">
              <MapPin aria-hidden="true" className="size-4 text-[#777]" />
              {addon.helperLabel}
            </p>
          ) : null}
        </div>

        <button
          className="h-9 rounded-full border border-[#f03742] bg-white px-6 text-sm font-bold text-[#f03742] transition hover:bg-[#ffefef] md:w-auto"
          onClick={onSelectAddon}
          type="button"
        >
          {addon.ctaLabel ?? '前往加購'}
        </button>
      </div>

      <Train
        aria-hidden="true"
        className="absolute right-2 bottom-0 hidden size-28 text-[#ffe1b7] md:block"
        strokeWidth={1.2}
      />
    </section>
  )
}
