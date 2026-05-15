import { ChevronRight } from 'lucide-react'

import type { CrossSellWidgetActionItem } from '../../types'

interface ActionCardsProps {
  items: CrossSellWidgetActionItem[]
  onSelectAddon?: (addonId: string) => void
  subtitle?: string
  title: string
}

export function ActionCards({
  items,
  onSelectAddon,
  subtitle,
  title,
}: ActionCardsProps) {
  return (
    <section className="bg-background px-4 py-5 lion-desktop:px-6 lion-desktop:py-6">
      <div className="mb-4 space-y-1">
        <h2 className="text-lg font-bold lion-desktop:text-xl">{title}</h2>

        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-3 lion-desktop:grid-cols-2">
        {items.map((item) => (
          <button
            className="flex items-center justify-between rounded-2xl border border-(--lion-gray-200) p-4 text-left transition-colors hover:bg-(--lion-gray-50)"
            key={item.id}
            onClick={() => onSelectAddon?.(item.id)}
            type="button"
          >
            <div className="space-y-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>

              {item.accentText ? (
                <p className="text-sm font-medium text-(--lion-primary-600)">
                  {item.accentText}
                </p>
              ) : null}
            </div>

            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </section>
  )
}
