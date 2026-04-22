import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselNavButtonProps {
  direction: 'next' | 'previous'
  onClick: () => void
}

export function CarouselNavButton({
  direction,
  onClick,
}: CarouselNavButtonProps) {
  const Icon = direction === 'next' ? ChevronRight : ChevronLeft

  return (
    <button
      aria-label={direction === 'next' ? '下一組推薦' : '上一組推薦'}
      className={
        direction === 'next'
          ? 'absolute top-1/2 right-0 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white p-0 text-[#444] shadow-[0_0_4px_rgba(0,0,0,0.25)] transition hover:text-[#f03742] md:flex'
          : 'absolute top-1/2 left-0 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white p-0 text-[#444] shadow-[0_0_4px_rgba(0,0,0,0.25)] transition hover:text-[#f03742] md:flex'
      }
      onClick={onClick}
      type="button"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  )
}
