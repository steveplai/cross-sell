import { Check } from 'lucide-react'

import type { FlightOrderCrossSellAddon } from '../../types'
import { HsrBackground } from './HsrBackground'

const defaultHsrAddon: Required<
  Pick<FlightOrderCrossSellAddon, 'title' | 'description' | 'ctaLabel'>
> = {
  title: '加購高鐵 行程更順暢',
  description: '購買國內外行程，最高享 8 折優惠',
  ctaLabel: '前往加購',
}

interface HsrAddonBannerProps {
  addon?: FlightOrderCrossSellAddon
  onSelectAddon?: () => void
}

export function HsrAddonBanner({ addon, onSelectAddon }: HsrAddonBannerProps) {
  const title = addon?.title ?? defaultHsrAddon.title
  const description = addon?.description ?? defaultHsrAddon.description
  const ctaLabel = addon?.ctaLabel ?? defaultHsrAddon.ctaLabel

  return (
    <section className="relative overflow-hidden bg-background px-5 py-5 lion-desktop:px-12 lion-desktop:py-10">
      <HsrBackground
        className="pointer-events-none absolute top-3.75 right-0 block h-auto w-39 lion-desktop:hidden"
        cropRight={39}
      />
      <HsrBackground className="pointer-events-none absolute top-3.75 right-0 hidden h-auto w-56.75 lion-desktop:block" />

      <div className="relative flex flex-col gap-5 lion-desktop:flex-row lion-desktop:items-center lion-desktop:gap-12">
        <div className="flex min-w-0 flex-col gap-2 lion-desktop:flex-row lion-desktop:items-center lion-desktop:gap-5">
          <h2 className="text-base leading-6 font-bold text-foreground lion-desktop:text-xl">
            {title}
          </h2>
          <div className="flex items-center gap-1 text-xs leading-5.5 text-(--lion-gray-700) lion-desktop:text-sm">
            <Check
              aria-hidden="true"
              className="size-4 text-(--lion-orange-600)"
            />
            <p>{description}</p>
          </div>
        </div>
        <button
          className="h-9 rounded-full border border-primary bg-background px-6 text-sm font-bold text-primary transition hover:bg-(--lion-red-100) lion-desktop:w-auto"
          onClick={onSelectAddon}
          type="button"
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  )
}
