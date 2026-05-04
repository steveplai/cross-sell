import { cn } from '@/lib/utils'

import type { FlightOrderCrossSellAttractionBannerOverrides } from '../../types'
import { AttractionTicketsDecor } from './AttractionTicketsDecor'

const defaultAttractionBannerTitle = '探索東京 景點不錯過'

interface AttractionDecorBannerProps {
  contentOverrides?: FlightOrderCrossSellAttractionBannerOverrides
}

export function AttractionDecorBanner({
  contentOverrides,
}: AttractionDecorBannerProps) {
  const title = contentOverrides?.title ?? defaultAttractionBannerTitle

  return (
    <section
      className={cn(
        'relative overflow-hidden',
        'bg-background bg-linear-to-b',
        'from-(--lion-attraction-banner-gradient-from) from-[9.67%]',
        'to-(--lion-attraction-banner-gradient-to) to-[111.71%]',
        'px-5 pt-5 pb-9',
        'lion-desktop:px-12 lion-desktop:pt-7.5 lion-desktop:pb-11.25',
      )}
      data-testid="attraction-decor"
    >
      <div className="relative inline-block">
        <h2
          className={cn(
            'text-base leading-6',
            'font-bold text-foreground',
            'lion-desktop:text-xl lion-desktop:leading-7',
          )}
        >
          {title}
        </h2>
        <AttractionTicketsDecor
          className={cn(
            'pointer-events-none',
            'absolute -top-5 left-full',
            'h-20 w-auto object-contain',
            'lion-desktop:-top-7.5 lion-desktop:h-25.75',
          )}
        />
      </div>
    </section>
  )
}
