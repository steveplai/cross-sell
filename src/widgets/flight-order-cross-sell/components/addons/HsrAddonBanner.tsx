import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  href?: string
  onSelectAddon?: () => void
}

// Container queries measure the section content box. This maps the intended
// 630px section width to 590px after the mobile 20px side padding is removed.
const hsrInlineLayoutClassName =
  '@min-[590px]/hsr:flex-row @min-[590px]/hsr:items-center'

const sectionClassName = cn(
  '@container/hsr relative overflow-hidden bg-background',
  'px-5 py-5',
  'lion-desktop:px-12 lion-desktop:py-10',
)

const layoutClassName = cn(
  'relative flex flex-col gap-5',
  hsrInlineLayoutClassName,
  'lion-desktop:gap-12',
)

const mobileBackgroundClassName = cn(
  'pointer-events-none absolute block h-13.25 w-38.75',
  'top-0 -right-5',
  '@min-[590px]/hsr:top-auto @min-[590px]/hsr:-bottom-[25%]',
  'lion-desktop:hidden',
)

const desktopBackgroundClassName =
  'pointer-events-none absolute -right-12 -bottom-[25%] hidden h-16.5 w-56.75 lion-desktop:block'

const textGroupClassName = cn(
  'flex min-w-0 flex-col gap-2',
  hsrInlineLayoutClassName,
  'lion-desktop:gap-5',
)

const titleClassName =
  'text-base leading-6 font-bold text-foreground lion-desktop:text-xl'

const descriptionClassName =
  'flex items-center gap-1 text-xs leading-5.5 text-(--lion-gray-700) lion-desktop:text-sm'

const ctaClassName = cn(
  'h-8.75 rounded-full border-primary bg-background px-4 font-bold text-primary shadow-none',
  'hover:bg-(--lion-red-100) hover:text-primary',
  'lion-desktop:w-auto',
)

export function HsrAddonBanner({
  addon,
  href,
  onSelectAddon,
}: HsrAddonBannerProps) {
  const title = addon?.title ?? defaultHsrAddon.title
  const description = addon?.description ?? defaultHsrAddon.description
  const ctaLabel = addon?.ctaLabel ?? defaultHsrAddon.ctaLabel

  return (
    <section className={sectionClassName}>
      <div className={layoutClassName}>
        <HsrBackground className={mobileBackgroundClassName} cropRight={39} />
        <HsrBackground className={desktopBackgroundClassName} />
        <div className={textGroupClassName}>
          <h2 className={titleClassName}>{title}</h2>
          <div className={descriptionClassName}>
            <Check
              aria-hidden="true"
              className="size-4 text-(--lion-orange-600)"
            />
            <p>{description}</p>
          </div>
        </div>
        {href ? (
          <Button asChild className={ctaClassName} variant="outline">
            <a
              href={href}
              onClick={onSelectAddon}
              rel="noopener noreferrer"
              target="_blank"
            >
              {ctaLabel}
            </a>
          </Button>
        ) : (
          <Button
            className={ctaClassName}
            onClick={onSelectAddon}
            type="button"
            variant="outline"
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </section>
  )
}
