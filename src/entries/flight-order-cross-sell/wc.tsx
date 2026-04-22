import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSell,
  type FlightOrderCrossSellData,
  type FlightOrderCrossSellProps,
  flightOrderCrossSellSampleData,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

function parseData(value: string | null): FlightOrderCrossSellData {
  if (!value) {
    return flightOrderCrossSellSampleData
  }

  try {
    const parsed = JSON.parse(value)

    return isFlightOrderCrossSellData(parsed)
      ? (parsed as FlightOrderCrossSellData)
      : flightOrderCrossSellSampleData
  } catch {
    return flightOrderCrossSellSampleData
  }
}

function isFlightOrderCrossSellData(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<FlightOrderCrossSellData>

  return (
    !!candidate.promo &&
    typeof candidate.promo.startsAt === 'string' &&
    typeof candidate.promo.durationSeconds === 'number' &&
    Array.isArray(candidate.sections)
  )
}

createReactWebComponent<FlightOrderCrossSellProps>({
  tagName: 'flight-order-cross-sell',
  Component: FlightOrderCrossSell,
  observedAttributes: ['data'],
  styles,
  mapElementToProps: (element) => ({
    data: parseData(element.getAttribute('data')),
    onSelectItem: (detail) => {
      element.dispatchEvent(
        new CustomEvent('flight-order-cross-sell:item-select', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
    onViewMore: (detail) => {
      element.dispatchEvent(
        new CustomEvent('flight-order-cross-sell:view-more', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
    onSelectAddon: (detail) => {
      element.dispatchEvent(
        new CustomEvent('flight-order-cross-sell:addon-select', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
    onPromoClick: (detail) => {
      element.dispatchEvent(
        new CustomEvent('flight-order-cross-sell:promo-click', {
          bubbles: true,
          composed: true,
          detail,
        }),
      )
    },
  }),
})
