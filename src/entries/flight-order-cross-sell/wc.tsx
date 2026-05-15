import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSell,
  type FlightOrderCrossSellProps,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

//#region - Functions

function parseData(value: string | null): FlightOrderCrossSellProps {
  if (!value) {
    return { sections: [] }
  }

  try {
    const parsed = JSON.parse(value)

    return isFlightOrderCrossSellProps(parsed)
      ? mapDataToProps(parsed as FlightOrderCrossSellProps)
      : { sections: [] }
  } catch {
    return { sections: [] }
  }
}

function getDataProperty(
  element: HTMLElement,
): FlightOrderCrossSellProps | undefined {
  const value = (element as HTMLElement & { data?: unknown }).data

  return isFlightOrderCrossSellProps(value)
    ? mapDataToProps(value as FlightOrderCrossSellProps)
    : undefined
}

function isFlightOrderCrossSellProps(value: unknown) {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Partial<FlightOrderCrossSellProps>

  return (
    typeof candidate === 'object' &&
    (!candidate.sections || Array.isArray(candidate.sections))
  )
}

function mapDataToProps(
  data: FlightOrderCrossSellProps,
): FlightOrderCrossSellProps {
  return {
    currency: data.currency,
    domainMode: data.domainMode,
    hsrAddon: data.hsrAddon,
    locale: data.locale,
    order: data.order,
    orderDestination: data.orderDestination,
    promo: data.promo,
    reminders: data.reminders,
    sectionContentOverrides: data.sectionContentOverrides,
    sections: data.sections ?? [],
    serviceAgent: data.serviceAgent,
  }
}

//#endregion - Functions

createReactWebComponent<FlightOrderCrossSellProps>({
  tagName: 'flight-order-cross-sell',
  Component: FlightOrderCrossSell,
  observedAttributes: ['data'],
  observedProperties: ['data'],
  styles,
  mapElementToProps: (element) => ({
    ...(getDataProperty(element) ?? parseData(element.getAttribute('data'))),
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
  }),
})
