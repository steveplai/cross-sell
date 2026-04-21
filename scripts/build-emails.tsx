import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { render } from '@react-email/render'

import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import { createInsuranceCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/insurance'
import { createOrderCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/order'
import { createSalesCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/sales'
import {
  createTravelPlanCrossSellAssetUrls,
  resolveTravelPlanCrossSellEmailDomainMode,
} from '../src/emails/travel-plan-cross-sell/content/shared-assets'
import { TravelPlanCrossSellEmail } from '../src/emails/travel-plan-cross-sell/TravelPlanCrossSellEmail'

const outDir = resolve(process.cwd(), 'dist/emails')
const travelPlanCrossSellEmailDomainMode =
  resolveTravelPlanCrossSellEmailDomainMode(process.env.EMAIL_DOMAIN_MODE)
const travelPlanCrossSellAssetUrls = createTravelPlanCrossSellAssetUrls(
  travelPlanCrossSellEmailDomainMode,
)

await mkdir(outDir, { recursive: true })

const emails = [
  {
    fileName: 'demo-product-offer.html',
    html: await render(
      <DemoProductOfferEmail
        ctaUrl="https://example.com/recommendations"
        products={sampleProducts}
        title="你的專屬加購推薦"
      />,
    ),
  },
  {
    fileName: 'order-cross-sell.html',
    html: await render(
      <TravelPlanCrossSellEmail
        {...createOrderCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
      />,
    ),
  },
  {
    fileName: 'sales-cross-sell.html',
    html: await render(
      <TravelPlanCrossSellEmail
        {...createSalesCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
      />,
    ),
  },
  {
    fileName: 'insurance-cross-sell.html',
    html: await render(
      <TravelPlanCrossSellEmail
        {...createInsuranceCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
      />,
    ),
  },
]

await Promise.all(
  emails.map((email) =>
    writeFile(resolve(outDir, email.fileName), email.html, 'utf8'),
  ),
)
