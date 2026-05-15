import { createReactWebComponent } from '../../runtime/createReactWebComponent'
import { isLiontravelDomainMode } from '../../shared/utils/liontravelUrl'
import baseStyles from '../../styles/widget.css?inline'
import {
  FlightOrderCrossSellConnected,
  type FlightOrderCrossSellConnectedConfig,
  type FlightOrderCrossSellConnectedErrorMode,
  type FlightOrderCrossSellConnectedProps,
  type FlightOrderCrossSellSectionContentOverrides,
  type FlightOrderCrossSellSectionKind,
} from '../../widgets/flight-order-cross-sell'
import widgetStyles from '../../widgets/flight-order-cross-sell/style.css?inline'

const styles = `${baseStyles}\n${widgetStyles}`
const sectionKinds = [
  'hotel',
  'attraction',
  'transport',
  'flight',
] as const satisfies readonly FlightOrderCrossSellSectionKind[]

//#region - Functions

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

function getOptionalStringProperty(element: HTMLElement, name: string) {
  const value = (element as HTMLElement & Record<string, unknown>)[name]

  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function parseOptionalNumber(value: string | null | undefined) {
  if (!value) {
    return undefined
  }

  const numberValue = Number(value)

  return Number.isFinite(numberValue) ? numberValue : undefined
}

function getOptionalNumberProperty(element: HTMLElement, name: string) {
  const value = (element as HTMLElement & Record<string, unknown>)[name]

  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function pickHsrAddonConfig(
  value: Record<string, unknown>,
): FlightOrderCrossSellConnectedConfig['hsrAddon'] {
  const addon: NonNullable<FlightOrderCrossSellConnectedConfig['hsrAddon']> = {}

  if (typeof value.id === 'string') {
    addon.id = value.id
  }

  if (typeof value.title === 'string') {
    addon.title = value.title
  }

  if (typeof value.description === 'string') {
    addon.description = value.description
  }

  if (typeof value.ctaLabel === 'string') {
    addon.ctaLabel = value.ctaLabel
  }

  return Object.keys(addon).length > 0 ? addon : undefined
}

function pickSectionContentOverride(
  value: Record<string, unknown>,
): FlightOrderCrossSellSectionContentOverrides | undefined {
  const content: FlightOrderCrossSellSectionContentOverrides = {}

  if (typeof value.title === 'string') {
    content.title = value.title
  }

  if (typeof value.subtitle === 'string') {
    content.subtitle = value.subtitle
  }

  if (typeof value.viewMoreLabel === 'string') {
    content.viewMoreLabel = value.viewMoreLabel
  }

  if (typeof value.viewMorePlaceholderLabel === 'string') {
    content.viewMorePlaceholderLabel = value.viewMorePlaceholderLabel
  }

  return Object.keys(content).length > 0 ? content : undefined
}

function pickSectionContentOverrides(
  value: Record<string, unknown>,
): FlightOrderCrossSellConnectedConfig['sectionContentOverrides'] {
  const overrides: NonNullable<
    FlightOrderCrossSellConnectedConfig['sectionContentOverrides']
  > = {}

  sectionKinds.forEach((kind) => {
    const content = value[kind]

    if (!isRecord(content)) {
      return
    }

    const overrideContent = pickSectionContentOverride(content)

    if (overrideContent) {
      overrides[kind] = overrideContent
    }
  })

  return Object.keys(overrides).length > 0 ? overrides : undefined
}

function pickConnectedConfig(
  value: unknown,
): FlightOrderCrossSellConnectedConfig {
  if (!isRecord(value)) {
    return {}
  }

  const config: FlightOrderCrossSellConnectedConfig = {}

  if (typeof value.currency === 'string') {
    config.currency = value.currency
  }

  if (isRecord(value.hsrAddon)) {
    config.hsrAddon = pickHsrAddonConfig(value.hsrAddon)
  }

  if (typeof value.locale === 'string') {
    config.locale = value.locale
  }

  if (typeof value.orderDestination === 'string') {
    config.orderDestination = value.orderDestination
  }

  if (isRecord(value.promo)) {
    config.promo = value.promo as FlightOrderCrossSellConnectedConfig['promo']
  }

  if (isRecord(value.reminders)) {
    config.reminders =
      value.reminders as FlightOrderCrossSellConnectedConfig['reminders']
  }

  if (isRecord(value.sectionContentOverrides)) {
    config.sectionContentOverrides = pickSectionContentOverrides(
      value.sectionContentOverrides,
    )
  }

  return config
}

//#endregion - Functions

createReactWebComponent<FlightOrderCrossSellConnectedProps>({
  tagName: 'flight-order-cross-sell-connected',
  Component: FlightOrderCrossSellConnected,
  observedAttributes: [
    'config',
    'currency',
    'environment',
    'error-mode',
    'locale',
    'order-destination',
    'order-number',
    'promo-duration-seconds',
    'promo-starts-at',
    'recommend-product-types',
    'travel-insurance-contact-email',
  ],
  observedProperties: [
    'config',
    'orderDestination',
    'promoDurationSeconds',
    'promoStartsAt',
    'travelInsuranceContactEmail',
  ],
  styles,
  mapElementToProps: (element) => {
    const environment = getOptionalAttribute(element, 'environment')
    const attributeConfig = parseConfigAttribute(element.getAttribute('config'))
    const propertyConfig = getConfigProperty(element)

    return {
      ...attributeConfig,
      ...propertyConfig,
      currency:
        getOptionalAttribute(element, 'currency') ??
        propertyConfig.currency ??
        attributeConfig.currency,
      environment: isLiontravelDomainMode(environment)
        ? environment
        : undefined,
      errorMode: parseErrorMode(getOptionalAttribute(element, 'error-mode')),
      locale:
        getOptionalAttribute(element, 'locale') ??
        propertyConfig.locale ??
        attributeConfig.locale,
      orderDestination:
        getOptionalAttribute(element, 'order-destination') ??
        getOptionalStringProperty(element, 'orderDestination') ??
        propertyConfig.orderDestination ??
        attributeConfig.orderDestination,
      orderNumber: getOptionalAttribute(element, 'order-number'),
      promoDurationSeconds:
        parseOptionalNumber(
          getOptionalAttribute(element, 'promo-duration-seconds'),
        ) ?? getOptionalNumberProperty(element, 'promoDurationSeconds'),
      promoStartsAt:
        getOptionalAttribute(element, 'promo-starts-at') ??
        getOptionalStringProperty(element, 'promoStartsAt'),
      recommendProductTypes: getOptionalAttribute(
        element,
        'recommend-product-types',
      ),
      travelInsuranceContactEmail:
        getOptionalAttribute(element, 'travel-insurance-contact-email') ??
        getOptionalStringProperty(element, 'travelInsuranceContactEmail'),
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
