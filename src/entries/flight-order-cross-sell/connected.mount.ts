import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSellConnected,
  type FlightOrderCrossSellConnectedProps,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

declare global {
  interface Window {
    FlightOrderCrossSellConnected?: {
      mount: ReturnType<
        typeof createMountApi<FlightOrderCrossSellConnectedProps>
      >
    }
  }
}

window.FlightOrderCrossSellConnected = {
  mount: createMountApi(
    FlightOrderCrossSellConnected,
    'flight-order-cross-sell-connected',
    styles,
  ),
}
