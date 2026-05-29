import type { ReactNode } from 'react'

import type { CrossSellEmailAssetUrls } from '../src/emails/cross-sell-email/content/index'
import {
  createFlightEstablishedCrossSellEmailContent,
  createFlightInsuranceCrossSellEmailContent,
  createFlightSalesCrossSellEmailContent,
  createHotelEstablishedCrossSellEmailContent,
  createHotelSalesCrossSellEmailContent,
} from '../src/emails/cross-sell-email/content/index'
import { CrossSellEmail } from '../src/emails/cross-sell-email/CrossSellEmail'
import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import type { PreviewBuiltEmailTemplateKey } from './email-preview-templates'

export interface EmailBuildOutput {
  templateKey: PreviewBuiltEmailTemplateKey
  relativePath: string
  createReactEmail: (assetUrls: CrossSellEmailAssetUrls) => ReactNode
}

export const emailBuildOutputs: readonly EmailBuildOutput[] = [
  {
    templateKey: 'demo-product-offer',
    relativePath: 'demo-product-offer/index.html',
    createReactEmail: () => (
      <DemoProductOfferEmail
        ctaUrl="https://example.com/recommendations"
        products={sampleProducts}
        title="你的專屬加購推薦"
      />
    ),
  },
  {
    templateKey: 'flight-established',
    relativePath: 'cross-sell-email/flight/established.html',
    createReactEmail: (assetUrls) => (
      <CrossSellEmail
        {...createFlightEstablishedCrossSellEmailContent(assetUrls)}
      />
    ),
  },
  {
    templateKey: 'hotel-established',
    relativePath: 'cross-sell-email/hotel/established.html',
    createReactEmail: (assetUrls) => (
      <CrossSellEmail
        {...createHotelEstablishedCrossSellEmailContent(assetUrls)}
      />
    ),
  },
  {
    templateKey: 'flight-sales',
    relativePath: 'cross-sell-email/flight/sales.html',
    createReactEmail: (assetUrls) => (
      <CrossSellEmail {...createFlightSalesCrossSellEmailContent(assetUrls)} />
    ),
  },
  {
    templateKey: 'hotel-sales',
    relativePath: 'cross-sell-email/hotel/sales.html',
    createReactEmail: (assetUrls) => (
      <CrossSellEmail {...createHotelSalesCrossSellEmailContent(assetUrls)} />
    ),
  },
  {
    templateKey: 'flight-insurance',
    relativePath: 'cross-sell-email/flight/insurance.html',
    createReactEmail: (assetUrls) => (
      <CrossSellEmail
        {...createFlightInsuranceCrossSellEmailContent(assetUrls)}
      />
    ),
  },
]
