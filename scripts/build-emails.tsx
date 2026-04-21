import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { render } from '@react-email/render'

import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import { insuranceCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/insurance'
import { orderCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/order'
import { salesCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/sales'
import { TravelPlanCrossSellEmail } from '../src/emails/travel-plan-cross-sell/TravelPlanCrossSellEmail'

const outDir = resolve(process.cwd(), 'dist/emails')

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
      <TravelPlanCrossSellEmail {...orderCrossSellEmailContent} />,
    ),
  },
  {
    fileName: 'sales-cross-sell.html',
    html: await render(
      <TravelPlanCrossSellEmail {...salesCrossSellEmailContent} />,
    ),
  },
  {
    fileName: 'insurance-cross-sell.html',
    html: await render(
      <TravelPlanCrossSellEmail {...insuranceCrossSellEmailContent} />,
    ),
  },
]

await Promise.all(
  emails.map((email) =>
    writeFile(resolve(outDir, email.fileName), email.html, 'utf8'),
  ),
)
