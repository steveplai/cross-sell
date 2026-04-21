import { createMountApi } from '../../runtime/createMountApi'
import styles from '../../styles/widget.css?inline'
import type { FlightOrderCrossSellProps } from '../../widgets/flight-order-cross-sell'
import { FlightOrderCrossSell } from '../../widgets/flight-order-cross-sell'

declare global {
  interface Window {
    FlightOrderCrossSell?: {
      mount: ReturnType<typeof createMountApi<FlightOrderCrossSellProps>>
    }
  }
}

window.FlightOrderCrossSell = {
  mount: createMountApi(
    FlightOrderCrossSell,
    'flight-order-cross-sell',
    styles,
  ),
}
