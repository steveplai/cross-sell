import { ChevronRight, Gift, Wifi } from 'lucide-react'

import type { FlightOrderCrossSellReminder } from '../types'

interface ReminderCardsProps {
  items: FlightOrderCrossSellReminder[]
  subtitle?: string
  title: string
  onSelectAddon?: (addonId: string) => void
}

function ReminderIcon({
  icon,
}: {
  icon: FlightOrderCrossSellReminder['icon']
}) {
  const Icon = icon === 'wifi' ? Wifi : Gift

  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#ffefef] text-[#f03742] md:size-14">
      <Icon aria-hidden="true" className="size-5 md:size-8" />
    </span>
  )
}

export function ReminderCards({
  items,
  subtitle,
  title,
  onSelectAddon,
}: ReminderCardsProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="bg-white px-5 py-8 md:px-12 md:py-10">
      <header className="mb-5 text-center">
        <h2 className="text-lg leading-6 font-bold text-[#222] md:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-2 text-sm leading-6 text-[#666] md:text-base">
            {subtitle}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
        {items.map((item) => (
          <button
            className="flex min-h-22.5 items-center gap-4 rounded-[10px] border border-[#ececec] bg-white px-3 py-4 text-left text-inherit transition hover:border-[#f03742]/40 hover:shadow-sm md:min-h-25.25 md:gap-5 md:px-5 md:py-3.75"
            key={item.id}
            onClick={() => onSelectAddon?.(item.id)}
            type="button"
          >
            <ReminderIcon icon={item.icon} />
            <span className="min-w-0 flex-1">
              <span className="block text-base leading-5.5 font-bold text-[#222]">
                {item.title}
              </span>
              <span className="mt-1 block text-sm leading-5.5 text-[#666]">
                {item.description}
              </span>
            </span>
            <ChevronRight
              aria-hidden="true"
              className="size-5 shrink-0 text-[#f03742]"
            />
          </button>
        ))}
      </div>
    </section>
  )
}
