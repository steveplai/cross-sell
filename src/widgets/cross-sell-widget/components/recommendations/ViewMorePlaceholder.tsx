import { ChevronRight } from 'lucide-react'

interface ViewMorePlaceholderProps {
  href: string
  label: string
  onViewMore?: () => void
}

export function ViewMorePlaceholder({
  href,
  label,
  onViewMore,
}: ViewMorePlaceholderProps) {
  return (
    <a
      aria-label={label}
      className="flex h-full min-h-70.75 w-full flex-col items-center justify-center gap-3 rounded-lg border border-(--lion-gray-200) bg-card p-4 text-primary shadow-(--lion-product-card-shadow)"
      data-testid="cross-sell-view-more-placeholder"
      href={href}
      onClick={onViewMore}
      rel="noopener noreferrer"
      target="_blank"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-(--lion-red-100)">
        <ChevronRight aria-hidden="true" className="size-6" />
      </span>
      <span className="text-xs leading-5.5 font-bold">{label}</span>
    </a>
  )
}
