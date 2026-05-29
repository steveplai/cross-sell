import type { ReactNode } from 'react'

import {
  createCrossSellEmailAssetUrls,
  createFlightEstablishedCrossSellEmailContent,
  createFlightInsuranceCrossSellEmailContent,
  createFlightSalesCrossSellEmailContent,
  createHotelEstablishedCrossSellEmailContent,
  createHotelSalesCrossSellEmailContent,
  type CrossSellEmailDomainMode,
} from '../../src/emails/cross-sell-email/content/index'
import { CrossSellEmail } from '../../src/emails/cross-sell-email/CrossSellEmail'
import { DemoProductOfferEmail } from '../../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../../src/emails/demo-product-offer/sample-data'

interface PreviewEmailTemplate {
  defaultSubject: string
  distFileName: string
  usesCrossSellEmailDomainMode: boolean
  label: string
  createReactEmail: (domainMode: CrossSellEmailDomainMode) => ReactNode
}

interface ManualEmailTemplate {
  defaultSubject: string
  fileName: string
  label: string
}

export const previewEmailTemplates = {
  'demo-product-offer': {
    defaultSubject: '你的專屬加購推薦',
    distFileName: 'demo-product-offer/index.html',
    usesCrossSellEmailDomainMode: false,
    label: 'Demo product offer',
    createReactEmail: () => (
      <DemoProductOfferEmail
        ctaUrl="https://example.com/recommendations"
        products={sampleProducts}
        title="你的專屬加購推薦"
      />
    ),
  },

  'flight-established': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'cross-sell-email/flight/established.html',
    usesCrossSellEmailDomainMode: true,
    label: 'Flight established',
    createReactEmail: (domainMode) => (
      <CrossSellEmail
        {...createFlightEstablishedCrossSellEmailContent(
          createCrossSellEmailAssetUrls(domainMode),
        )}
      />
    ),
  },
  'flight-sales': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'cross-sell-email/flight/sales.html',
    usesCrossSellEmailDomainMode: true,
    label: 'Flight sales',
    createReactEmail: (domainMode) => (
      <CrossSellEmail
        {...createFlightSalesCrossSellEmailContent(
          createCrossSellEmailAssetUrls(domainMode),
        )}
      />
    ),
  },
  'flight-insurance': {
    defaultSubject: '旅遊計劃書與簽證護照提醒',
    distFileName: 'cross-sell-email/flight/insurance.html',
    usesCrossSellEmailDomainMode: true,
    label: 'Flight insurance',
    createReactEmail: (domainMode) => (
      <CrossSellEmail
        {...createFlightInsuranceCrossSellEmailContent(
          createCrossSellEmailAssetUrls(domainMode),
        )}
      />
    ),
  },

  'hotel-established': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'cross-sell-email/hotel/established.html',
    usesCrossSellEmailDomainMode: true,
    label: 'Hotel established',
    createReactEmail: (domainMode) => (
      <CrossSellEmail
        {...createHotelEstablishedCrossSellEmailContent(
          createCrossSellEmailAssetUrls(domainMode),
        )}
      />
    ),
  },
  'hotel-sales': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'cross-sell-email/hotel/sales.html',
    usesCrossSellEmailDomainMode: true,
    label: 'Hotel sales',
    createReactEmail: (domainMode) => (
      <CrossSellEmail
        {...createHotelSalesCrossSellEmailContent(
          createCrossSellEmailAssetUrls(domainMode),
        )}
      />
    ),
  },
} satisfies Record<string, PreviewEmailTemplate>

export const manualEmailTemplates = {
  'full-flight-established': {
    defaultSubject: '旅遊計劃書',
    label: 'Full flight established',
    fileName: 'full-flight-established.html',
  },
  'full-flight-sales': {
    defaultSubject: '限時加購優惠',
    label: 'Full flight sales',
    fileName: 'full-flight-sales.html',
  },
  'full-flight-insurance': {
    defaultSubject: '簽證護照提醒',
    label: 'Full flight insurance',
    fileName: 'full-flight-insurance.html',
  },
} satisfies Record<string, ManualEmailTemplate>

export const previewEmailSources = ['dist', 'react', 'file'] as const
export type PreviewEmailSource = (typeof previewEmailSources)[number]

export type PreviewBuiltEmailTemplateKey = keyof typeof previewEmailTemplates
export type PreviewManualEmailTemplateKey = keyof typeof manualEmailTemplates
export type PreviewEmailTemplateKey =
  | PreviewBuiltEmailTemplateKey
  | PreviewManualEmailTemplateKey

export const previewEmailTemplateKeys = Object.keys(
  previewEmailTemplates,
) as PreviewBuiltEmailTemplateKey[]

export const manualEmailTemplateKeys = Object.keys(
  manualEmailTemplates,
) as PreviewManualEmailTemplateKey[]

export const previewAllEmailTemplateKeys = [
  ...previewEmailTemplateKeys,
  ...manualEmailTemplateKeys,
] as PreviewEmailTemplateKey[]

export function getPreviewEmailTemplateKeysForSource(
  source: PreviewEmailSource,
): readonly PreviewEmailTemplateKey[] {
  return source === 'file' ? manualEmailTemplateKeys : previewEmailTemplateKeys
}

export function getPreviewEmailTemplateLabel(
  template: PreviewEmailTemplateKey,
) {
  return isPreviewBuiltEmailTemplateKey(template)
    ? previewEmailTemplates[template].label
    : manualEmailTemplates[template].label
}

export function getPreviewEmailTemplateDefaultSubject(
  template: PreviewEmailTemplateKey,
) {
  return isPreviewBuiltEmailTemplateKey(template)
    ? previewEmailTemplates[template].defaultSubject
    : manualEmailTemplates[template].defaultSubject
}

export function previewEmailTemplateUsesCrossSellEmailDomainMode(
  template: PreviewEmailTemplateKey,
) {
  return (
    isPreviewBuiltEmailTemplateKey(template) &&
    previewEmailTemplates[template].usesCrossSellEmailDomainMode
  )
}

export function validatePreviewEmailTemplatesForSource(
  templates: readonly PreviewEmailTemplateKey[],
  source: PreviewEmailSource,
) {
  templates.forEach((template) => {
    assertPreviewEmailTemplateSupportsSource(template, source)
  })
}

export function isPreviewEmailTemplateKey(
  value: string,
): value is PreviewEmailTemplateKey {
  return (
    Object.hasOwn(previewEmailTemplates, value) ||
    Object.hasOwn(manualEmailTemplates, value)
  )
}

export function isPreviewBuiltEmailTemplateKey(
  value: PreviewEmailTemplateKey,
): value is PreviewBuiltEmailTemplateKey {
  return Object.hasOwn(previewEmailTemplates, value)
}

export function isPreviewManualEmailTemplateKey(
  value: PreviewEmailTemplateKey,
): value is PreviewManualEmailTemplateKey {
  return Object.hasOwn(manualEmailTemplates, value)
}

export function assertPreviewEmailTemplateSupportsSource(
  template: PreviewEmailTemplateKey,
  source: PreviewEmailSource,
) {
  if (source === 'file') {
    if (!isPreviewManualEmailTemplateKey(template)) {
      throw new Error(
        `Template "${template}" does not support source "file". Expected one of: dist, react.`,
      )
    }

    return
  }

  if (!isPreviewBuiltEmailTemplateKey(template)) {
    throw new Error(
      `Template "${template}" does not support source "${source}". Expected one of: file.`,
    )
  }
}
