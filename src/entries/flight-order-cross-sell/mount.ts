import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import type { FlightOrderCrossSellProps } from '../../widgets/flight-order-cross-sell'
import { FlightOrderCrossSell } from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

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
