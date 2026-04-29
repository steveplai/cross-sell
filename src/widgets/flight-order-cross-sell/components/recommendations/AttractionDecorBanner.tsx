import type { FlightOrderCrossSellAttractionDecor } from '../../types'

interface AttractionDecorBannerProps {
  decor: FlightOrderCrossSellAttractionDecor
}

export function AttractionDecorBanner({ decor }: AttractionDecorBannerProps) {
  return (
    <section
      className="relative overflow-hidden bg-linear-to-b from-[#fff8f8] to-background px-5 pt-8 pb-5 md:px-12 md:pt-10 md:pb-6"
      data-testid="attraction-decor"
    >
      {decor.imageUrl ? (
        <img
          alt={decor.imageAlt ?? ''}
          className="pointer-events-none absolute top-0 left-1/2 hidden h-31 w-auto -translate-x-1/2 object-contain md:block"
          src={decor.imageUrl}
        />
      ) : null}
      <h2 className="relative text-base leading-6 font-bold text-foreground md:text-xl">
        {decor.title}
      </h2>
    </section>
  )
}
