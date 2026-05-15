import { ChevronRight } from 'lucide-react'

import type { CrossSellWidgetFeaturedAddon } from '../../types'

interface FeaturedAddonBannerProps {
  addon: CrossSellWidgetFeaturedAddon
  href?: string
  onSelectAddon?: () => void
}

export function FeaturedAddonBanner({
  addon,
  href,
  onSelectAddon,
}: FeaturedAddonBannerProps) {
  return (
    <button
      className="flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl bg-linear-to-r from-(--lion-secondary-500) to-(--lion-primary-500) p-5 text-left text-white"
      onClick={onSelectAddon}
      type="button"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium opacity-90">精選加購</p>
        <h2 className="text-xl font-bold lion-desktop:text-2xl">
          {addon.title}
        </h2>
        <p className="text-sm opacity-90 lion-desktop:text-base">
          {addon.description}
        </p>
      </div>

      <div className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-4 py-2 text-sm font-medium backdrop-blur-sm">
        {addon.ctaLabel}
        <ChevronRight className="size-4" />
      </div>
    </button>
  )
}
