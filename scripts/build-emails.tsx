import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { render } from '@react-email/render'

import { CrossSellOfferEmail } from '../src/emails/cross-sell-offer/CrossSellOfferEmail'
import { sampleProducts } from '../src/emails/cross-sell-offer/sample-data'

const outDir = resolve(process.cwd(), 'dist/emails')

await mkdir(outDir, { recursive: true })

const html = await render(
  <CrossSellOfferEmail
    ctaUrl="https://example.com/recommendations"
    products={sampleProducts}
    title="你的專屬加購推薦"
  />,
)

await writeFile(resolve(outDir, 'cross-sell-offer.html'), html, 'utf8')
