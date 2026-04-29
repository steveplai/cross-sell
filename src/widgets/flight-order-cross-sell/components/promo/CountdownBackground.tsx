import { cn } from '../../../../lib/utils'
import { CountdownBackgroundDesktop } from './CountdownBackgroundDesktop'
import { CountdownBackgroundMobile } from './CountdownBackgroundMobile'

interface CountdownBackgroundProps {
  className?: string
}

export function CountdownBackground({ className }: CountdownBackgroundProps) {
  return (
    <div className={cn('pointer-events-none relative size-full', className)}>
      <CountdownBackgroundMobile className="absolute inset-x-0 -top-14 mx-auto block h-36 w-full md:hidden" />
      <CountdownBackgroundDesktop className="absolute inset-x-0 -top-18 mx-auto hidden h-43.5 w-full max-w-150.5 md:block" />
    </div>
  )
}
