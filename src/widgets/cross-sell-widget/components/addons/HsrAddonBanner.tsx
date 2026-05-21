import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import type { CrossSellWidgetAddon } from '../../types'
import { HsrBackground } from './HsrBackground'

interface HsrAddonBannerProps {
  addon: CrossSellWidgetAddon
  href?: string
  onSelectAddon?: () => void
}

const discountHighlightPattern = /(\d+\s*折)/u

//#region - Styles

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

//#endregion - Styles

export function HsrAddonBanner({
  addon,
  href,
  onSelectAddon,
}: HsrAddonBannerProps) {
  return (
    <section className={sectionClassName}>
      <div className={layoutClassName}>
        <HsrBackground className={mobileBackgroundClassName} cropRight={39} />
        <HsrBackground className={desktopBackgroundClassName} />
        <div className={textGroupClassName}>
          <h2 className={titleClassName}>{addon.title}</h2>
          <div className={descriptionClassName}>
            <Check
              aria-hidden="true"
              className="size-4 text-(--lion-orange-600)"
            />
            <p>{renderHighlightedDescription(addon.description)}</p>
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
              {addon.ctaLabel}
            </a>
          </Button>
        ) : (
          <Button
            className={ctaClassName}
            onClick={onSelectAddon}
            type="button"
            variant="outline"
          >
            {addon.ctaLabel}
          </Button>
        )}
      </div>
    </section>
  )
}

function renderHighlightedDescription(description: string) {
  return description.split(discountHighlightPattern).map((part, index) =>
    discountHighlightPattern.test(part) ? (
      <span className="font-medium text-primary" key={`discount-${index}`}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}
