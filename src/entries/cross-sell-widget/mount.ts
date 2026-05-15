import { createMountApi } from '../../runtime/createMountApi'
import baseStyles from '../../styles/widget.css?inline'
import {
  CrossSellWidget,
  type CrossSellWidgetProps,
} from '../../widgets/cross-sell-widget'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

declare global {
  interface Window {
    CrossSellWidget?: {
      mount: ReturnType<typeof createMountApi<CrossSellWidgetProps>>
    }
  }
}

window.CrossSellWidget = {
  mount: createMountApi(CrossSellWidget, 'cross-sell-widget', styles),
}
