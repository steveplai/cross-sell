import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { render } from '@react-email/render'

import {
  createCrossSellEmailAssetUrls,
  createFlightEstablishedCrossSellEmailContent,
  createFlightInsuranceCrossSellEmailContent,
  createFlightSalesCrossSellEmailContent,
  createHotelEstablishedCrossSellEmailContent,
  createHotelSalesCrossSellEmailContent,
  resolveCrossSellEmailDomainMode,
} from '../src/emails/cross-sell-email/content/index'
import { CrossSellEmail } from '../src/emails/cross-sell-email/CrossSellEmail'
import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'

interface EmailOutput {
  relativePath: string
  html: string
}

function getDomainModeArg(args: string[]) {
  const domainModeFlag = '--domain-mode'

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === domainModeFlag) {
      const value = args[index + 1]

      if (!value) {
        throw new Error(`Missing value for ${domainModeFlag}.`)
      }

      return value
    }

    if (arg.startsWith(`${domainModeFlag}=`)) {
      return arg.slice(`${domainModeFlag}=`.length)
    }
  }

  return undefined
}

const outDir = resolve(process.cwd(), 'dist/emails')
const crossSellEmailDomainMode = resolveCrossSellEmailDomainMode(
  getDomainModeArg(process.argv.slice(2)) ?? process.env.EMAIL_DOMAIN_MODE,
)
const crossSellEmailAssetUrls = createCrossSellEmailAssetUrls(
  crossSellEmailDomainMode,
)

await rm(outDir, { force: true, recursive: true })
await mkdir(outDir, { recursive: true })

const flightEstablishedHtml = await render(
  <CrossSellEmail
    {...createFlightEstablishedCrossSellEmailContent(crossSellEmailAssetUrls)}
  />,
)
const hotelEstablishedHtml = await render(
  <CrossSellEmail
    {...createHotelEstablishedCrossSellEmailContent(crossSellEmailAssetUrls)}
  />,
)
const flightSalesHtml = await render(
  <CrossSellEmail
    {...createFlightSalesCrossSellEmailContent(crossSellEmailAssetUrls)}
  />,
)
const hotelSalesHtml = await render(
  <CrossSellEmail
    {...createHotelSalesCrossSellEmailContent(crossSellEmailAssetUrls)}
  />,
)
const flightInsuranceHtml = await render(
  <CrossSellEmail
    {...createFlightInsuranceCrossSellEmailContent(crossSellEmailAssetUrls)}
  />,
)

const emails: EmailOutput[] = [
  {
    relativePath: 'demo-product-offer/index.html',
    html: await render(
      <DemoProductOfferEmail
        ctaUrl="https://example.com/recommendations"
        products={sampleProducts}
        title="你的專屬加購推薦"
      />,
    ),
  },
  {
    relativePath: 'cross-sell-email/flight/established.html',
    html: flightEstablishedHtml,
  },
  {
    relativePath: 'cross-sell-email/hotel/established.html',
    html: hotelEstablishedHtml,
  },
  {
    relativePath: 'cross-sell-email/flight/sales.html',
    html: flightSalesHtml,
  },
  {
    relativePath: 'cross-sell-email/hotel/sales.html',
    html: hotelSalesHtml,
  },
  {
    relativePath: 'cross-sell-email/flight/insurance.html',
    html: flightInsuranceHtml,
  },
]

await Promise.all(
  emails.map(async (email) => {
    const filePath = resolve(outDir, email.relativePath)

    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, email.html, 'utf8')
  }),
)
