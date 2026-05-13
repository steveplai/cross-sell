import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import { isLiontravelDomainMode } from '../../shared/utils/liontravelUrl'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSellConnected,
  type FlightOrderCrossSellConnectedConfig,
  type FlightOrderCrossSellConnectedErrorMode,
  type FlightOrderCrossSellConnectedProps,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`

function parseErrorMode(
  value: string | null | undefined,
): FlightOrderCrossSellConnectedErrorMode {
  return value === 'message' ? 'message' : 'hidden'
}

function getOptionalAttribute(element: HTMLElement, name: string) {
  const value = element.getAttribute(name)?.trim()

  return value || undefined
}

function parseConfigAttribute(
  value: string | null,
): FlightOrderCrossSellConnectedConfig {
  if (!value) {
    return {}
  }

  try {
    return pickConnectedConfig(JSON.parse(value))
  } catch {
    return {}
  }
}

function getConfigProperty(
  element: HTMLElement,
): FlightOrderCrossSellConnectedConfig {
  return pickConnectedConfig(
    (element as HTMLElement & { config?: unknown }).config,
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function pickConnectedConfig(
  value: unknown,
): FlightOrderCrossSellConnectedConfig {
  if (!isRecord(value)) {
    return {}
  }

  const config: FlightOrderCrossSellConnectedConfig = {}

  if (isRecord(value.attractionBannerOverrides)) {
    config.attractionBannerOverrides =
      value.attractionBannerOverrides as FlightOrderCrossSellConnectedConfig['attractionBannerOverrides']
  }

  if (typeof value.currency === 'string') {
    config.currency = value.currency
  }

  if (isRecord(value.hsrAddon)) {
    config.hsrAddon =
      value.hsrAddon as FlightOrderCrossSellConnectedConfig['hsrAddon']
  }

  if (typeof value.locale === 'string') {
    config.locale = value.locale
  }

  if (isRecord(value.promo)) {
    config.promo = value.promo as FlightOrderCrossSellConnectedConfig['promo']
  }

  if (isRecord(value.reminders)) {
    config.reminders =
      value.reminders as FlightOrderCrossSellConnectedConfig['reminders']
  }

  if (isRecord(value.serviceAgent)) {
    config.serviceAgent =
      value.serviceAgent as FlightOrderCrossSellConnectedConfig['serviceAgent']
  }

  return config
}

createReactWebComponent<FlightOrderCrossSellConnectedProps>({
  tagName: 'flight-order-cross-sell-connected',
  Component: FlightOrderCrossSellConnected,
  observedAttributes: [
    'base-url',
    'config',
    'currency',
    'domain-mode',
    'error-mode',
    'locale',
    'order-number',
    'recommend-product-types',
  ],
  observedProperties: ['config'],
  styles,
  mapElementToProps: (element) => {
    const domainMode = getOptionalAttribute(element, 'domain-mode')
    const attributeConfig = parseConfigAttribute(element.getAttribute('config'))
    const propertyConfig = getConfigProperty(element)

    return {
      ...attributeConfig,
      ...propertyConfig,
      baseUrl: getOptionalAttribute(element, 'base-url'),
      currency:
        getOptionalAttribute(element, 'currency') ??
        propertyConfig.currency ??
        attributeConfig.currency,
      domainMode: isLiontravelDomainMode(domainMode) ? domainMode : undefined,
      errorMode: parseErrorMode(getOptionalAttribute(element, 'error-mode')),
      locale:
        getOptionalAttribute(element, 'locale') ??
        propertyConfig.locale ??
        attributeConfig.locale,
      orderNumber: getOptionalAttribute(element, 'order-number'),
      recommendProductTypes: getOptionalAttribute(
        element,
        'recommend-product-types',
      ),
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
    }
  },
})
