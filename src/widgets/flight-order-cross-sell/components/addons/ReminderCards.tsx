import { ChevronRight, Gift, Wifi } from 'lucide-react'
import type { SVGProps } from 'react'

import { cn } from '@/lib/utils'

import type { FlightOrderCrossSellReminder } from '../../types'

interface ReminderCardsProps {
  items: FlightOrderCrossSellReminder[]
  subtitle?: string
  title: string
  onSelectAddon?: (addonId: string) => void
}

interface ReminderIconGlyphProps extends SVGProps<SVGSVGElement> {
  icon: FlightOrderCrossSellReminder['icon']
}

function PassportIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 22 27" {...props}>
      <path
        d="M18.667 0C19.4003 0 20.0286 0.260981 20.5508 0.783203C21.0727 1.30528 21.3339 1.93297 21.334 2.66602V24C21.3339 24.733 21.0727 25.3607 20.5508 25.8828C20.0286 26.405 19.4003 26.666 18.667 26.666H1.33398C0.956287 26.666 0.639316 26.5386 0.383789 26.2832C0.128234 26.0276 3.35943e-7 25.7108 0 25.333V1.33301C0 0.95523 0.128234 0.638368 0.383789 0.382812C0.639316 0.127365 0.956287 0 1.33398 0H18.667ZM2.66699 24H18.667V2.66602H2.66699V24ZM14.334 20C14.6227 20.0001 14.862 20.0944 15.0508 20.2832C15.2395 20.472 15.334 20.7113 15.334 21C15.3339 21.2887 15.2396 21.528 15.0508 21.7168C14.862 21.9056 14.6227 21.9999 14.334 22H7C6.71126 21.9999 6.47202 21.9056 6.2832 21.7168C6.09439 21.528 6.00007 21.2887 6 21C6 20.7113 6.09453 20.472 6.2832 20.2832C6.47202 20.0944 6.71126 20.0001 7 20H14.334ZM10.667 4.66602C12.5114 4.66602 14.0838 5.31621 15.3838 6.61621C16.6838 7.91621 17.334 9.48856 17.334 11.333C17.334 13.1775 16.6838 14.7498 15.3838 16.0498C14.0838 17.3498 12.5114 18 10.667 18C8.82255 18 7.2502 17.3498 5.9502 16.0498C4.6502 14.7498 4 13.1775 4 11.333C4 9.48856 4.6502 7.91621 5.9502 6.61621C7.2502 5.31621 8.82255 4.66602 10.667 4.66602ZM9.7002 12.333C9.76686 13.2441 9.90059 13.9831 10.1006 14.5498C10.3006 15.1164 10.4892 15.5222 10.667 15.7666C10.8447 15.5222 11.0334 15.1164 11.2334 14.5498C11.4334 13.9831 11.5671 13.2441 11.6338 12.333H9.7002ZM6.13379 12.333C6.26712 12.9774 6.52262 13.5553 6.90039 14.0664C7.27809 14.5774 7.73341 14.9997 8.2666 15.333C8.11107 14.8886 7.98927 14.416 7.90039 13.916C7.81153 13.4161 7.74463 12.8885 7.7002 12.333H6.13379ZM13.6338 12.333C13.5894 12.8885 13.5225 13.4161 13.4336 13.916C13.3447 14.416 13.2229 14.8886 13.0674 15.333C13.6006 14.9997 14.0559 14.5774 14.4336 14.0664C14.8114 13.5553 15.0669 12.9774 15.2002 12.333H13.6338ZM8.2666 7.33301C7.73341 7.6663 7.27809 8.08862 6.90039 8.59961C6.52262 9.11071 6.26712 9.68857 6.13379 10.333H7.7002C7.74463 9.77757 7.81153 9.24991 7.90039 8.75C7.98927 8.25005 8.11107 7.77742 8.2666 7.33301ZM10.667 6.89941C10.4892 7.14383 10.3006 7.54965 10.1006 8.11621C9.90059 8.68288 9.76686 9.4219 9.7002 10.333H11.6338C11.5671 9.4219 11.4334 8.68288 11.2334 8.11621C11.0334 7.54965 10.8447 7.14383 10.667 6.89941ZM13.0674 7.33301C13.2229 7.77742 13.3447 8.25005 13.4336 8.75C13.5225 9.24991 13.5894 9.77757 13.6338 10.333H15.2002C15.0669 9.68857 14.8114 9.11071 14.4336 8.59961C14.0559 8.08862 13.6006 7.6663 13.0674 7.33301Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InsuranceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 22 27" {...props}>
      <path
        d="M10.667 0C10.9781 0 11.2895 0.0549045 11.6006 0.166016L19.6006 3.16602C20.1116 3.36602 20.5284 3.68842 20.8506 4.13281C21.1728 4.57722 21.334 5.07731 21.334 5.63281V11.9326C21.334 15.0437 20.4447 17.9494 18.667 20.6494C16.8892 23.3494 14.5 25.1992 11.5 26.1992C11.3668 26.2436 11.2338 26.2776 11.1006 26.2998C10.9673 26.322 10.8225 26.333 10.667 26.333C10.5114 26.333 10.3667 26.322 10.2334 26.2998C10.1002 26.2776 9.96718 26.2436 9.83398 26.1992C6.83398 25.1992 4.44477 23.3494 2.66699 20.6494C0.889244 17.9494 0 15.0437 0 11.9326V5.63281C6.29997e-6 5.07731 0.161232 4.57722 0.483398 4.13281C0.805585 3.68842 1.22237 3.36602 1.7334 3.16602L9.7334 0.166016C10.0445 0.0549045 10.3559 4.25827e-8 10.667 0ZM2.66699 5.63281V11.9326C2.66699 14.6215 3.42248 17.0666 4.93359 19.2666C6.44467 21.4664 8.35599 22.9327 10.667 23.666C12.978 22.9327 14.8893 21.4664 16.4004 19.2666C17.9115 17.0666 18.667 14.6215 18.667 11.9326V5.63281L10.667 2.63281L2.66699 5.63281ZM13.0674 8.73242C13.8672 8.73252 14.5561 9.02193 15.1338 9.59961C15.7115 10.1773 16 10.8661 16 11.666C16 12.866 15.3891 14.0492 14.167 15.2158C12.9448 16.3825 11.9338 17.3331 11.1338 18.0664C11.0005 18.1775 10.8502 18.2324 10.6836 18.2324C10.517 18.2324 10.3667 18.1775 10.2334 18.0664C9.41118 17.3109 8.3892 16.3657 7.16699 15.2324C5.94491 14.0991 5.33398 12.9104 5.33398 11.666C5.33402 10.8661 5.62253 10.1773 6.2002 9.59961C6.77788 9.02193 7.46677 8.73252 8.2666 8.73242C8.75549 8.73242 9.21157 8.82771 9.63379 9.0166C10.0559 9.20548 10.4004 9.46654 10.667 9.7998C10.9336 9.46655 11.2836 9.20548 11.7168 9.0166C12.1501 8.82771 12.6007 8.73242 13.0674 8.73242Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ReminderIconGlyph({ icon, ...props }: ReminderIconGlyphProps) {
  switch (icon) {
    case 'gift':
      return <Gift {...props} />
    case 'insurance':
      return <InsuranceIcon {...props} />
    case 'passport':
      return <PassportIcon {...props} />
    case 'wifi':
      return <Wifi {...props} />
    default:
      return <PassportIcon {...props} />
  }
}

function ReminderIcon({
  icon,
}: {
  icon: FlightOrderCrossSellReminder['icon']
}) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full',
        'size-11 bg-(--lion-red-100) text-primary',
        'lion-desktop:size-14',
      )}
    >
      <ReminderIconGlyph
        aria-hidden="true"
        className="size-5 lion-desktop:size-8"
        icon={icon}
      />
    </span>
  )
}

function ReminderCardContent({ item }: { item: FlightOrderCrossSellReminder }) {
  return (
    <>
      <ReminderIcon icon={item.icon} />
      <span className="flex min-w-0 flex-1 flex-col gap-1.25 leading-5.5">
        <span className="block text-base font-bold text-foreground">
          {item.title}
        </span>
        <span className="block text-sm text-(--lion-gray-700)">
          {item.description}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="size-6 shrink-0 text-primary"
      />
    </>
  )
}

const reminderCardClassName = cn(
  'flex items-center rounded-[10px] border bg-card text-left text-inherit no-underline',
  'min-h-22.5 gap-4 border-(--lion-gray-300) px-3 py-4',
  'transition hover:border-primary/40 hover:bg-card hover:shadow-sm',
  'lion-desktop:min-h-25.25 lion-desktop:gap-5 lion-desktop:px-5 lion-desktop:py-3.75',
)

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
    <section className="flex flex-col gap-5 bg-background px-5 py-8 lion-desktop:px-12 lion-desktop:py-10">
      <header className="flex flex-col items-center gap-2.5 text-center">
        <h2 className="text-lg leading-6 font-bold text-foreground lion-desktop:text-xl">
          {title}
        </h2>
        {subtitle ? (
          <p className="text-sm leading-6 text-(--lion-gray-700) lion-desktop:text-base">
            {subtitle}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-3 lion-desktop:grid-cols-2 lion-desktop:gap-5">
        {items.map((item) =>
          item.href ? (
            <a
              className={reminderCardClassName}
              href={item.href}
              key={item.id}
              onClick={() => onSelectAddon?.(item.id)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <ReminderCardContent item={item} />
            </a>
          ) : (
            <button
              className={reminderCardClassName}
              key={item.id}
              onClick={() => onSelectAddon?.(item.id)}
              type="button"
            >
              <ReminderCardContent item={item} />
            </button>
          ),
        )}
      </div>
    </section>
  )
}
