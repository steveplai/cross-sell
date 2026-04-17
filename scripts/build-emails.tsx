import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { render } from '@react-email/render'

import { CrossSellOfferEmail } from '../src/emails/cross-sell-offer/CrossSellOfferEmail'
import { sampleProducts } from '../src/emails/cross-sell-offer/sample-data'
import { OrderCrossSellEmail } from '../src/emails/order-cross-sell/OrderCrossSellEmail'
import { orderCrossSellSampleData } from '../src/emails/order-cross-sell/sample-data'

const outDir = resolve(process.cwd(), 'dist/emails')

await mkdir(outDir, { recursive: true })

const emails = [
  {
    fileName: 'cross-sell-offer.html',
    html: await render(
      <CrossSellOfferEmail
        ctaUrl="https://example.com/recommendations"
        products={sampleProducts}
        title="你的專屬加購推薦"
      />,
    ),
  },
  {
    fileName: 'order-cross-sell.html',
    html: await render(<OrderCrossSellEmail {...orderCrossSellSampleData} />),
  },
]

await Promise.all(
  emails.map((email) =>
    writeFile(resolve(outDir, email.fileName), email.html, 'utf8'),
  ),
)
