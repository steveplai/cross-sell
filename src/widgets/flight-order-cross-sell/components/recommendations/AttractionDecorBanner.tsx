import type { FlightOrderCrossSellAttractionBannerOverrides } from '../../types'

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
      className="relative overflow-hidden bg-linear-to-b from-[#fff8f8] to-background px-5 pt-8 pb-5 lion-desktop:px-12 lion-desktop:pt-10 lion-desktop:pb-6"
      data-testid="attraction-decor"
    >
      {contentOverrides?.imageUrl ? (
        <img
          alt={contentOverrides.imageAlt ?? ''}
          className="pointer-events-none absolute top-0 left-1/2 hidden h-31 w-auto -translate-x-1/2 object-contain lion-desktop:block"
          src={contentOverrides.imageUrl}
        />
      ) : null}
      <h2 className="relative text-base leading-6 font-bold text-foreground lion-desktop:text-xl">
        {title}
      </h2>
    </section>
  )
}
