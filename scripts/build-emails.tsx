import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { render } from '@react-email/render'

import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import {
  createFlightEstablishedCrossSellEmailContent,
  createHotelEstablishedCrossSellEmailContent,
} from '../src/emails/travel-plan-cross-sell/content/established'
import { createFlightInsuranceCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/insurance'
import { createFlightSalesCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/sales'
import {
  createTravelPlanCrossSellAssetUrls,
  resolveTravelPlanCrossSellEmailDomainMode,
} from '../src/emails/travel-plan-cross-sell/content/shared-assets'
import { TravelPlanCrossSellEmail } from '../src/emails/travel-plan-cross-sell/TravelPlanCrossSellEmail'

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
const travelPlanCrossSellEmailDomainMode =
  resolveTravelPlanCrossSellEmailDomainMode(
    getDomainModeArg(process.argv.slice(2)) ?? process.env.EMAIL_DOMAIN_MODE,
  )
const travelPlanCrossSellAssetUrls = createTravelPlanCrossSellAssetUrls(
  travelPlanCrossSellEmailDomainMode,
)

await rm(outDir, { force: true, recursive: true })
await mkdir(outDir, { recursive: true })

const flightEstablishedHtml = await render(
  <TravelPlanCrossSellEmail
    {...createFlightEstablishedCrossSellEmailContent(
      travelPlanCrossSellAssetUrls,
    )}
  />,
)
const hotelEstablishedHtml = await render(
  <TravelPlanCrossSellEmail
    {...createHotelEstablishedCrossSellEmailContent(
      travelPlanCrossSellAssetUrls,
    )}
  />,
)
const flightSalesHtml = await render(
  <TravelPlanCrossSellEmail
    {...createFlightSalesCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
  />,
)
const flightInsuranceHtml = await render(
  <TravelPlanCrossSellEmail
    {...createFlightInsuranceCrossSellEmailContent(
      travelPlanCrossSellAssetUrls,
    )}
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
    relativePath: 'travel-plan-cross-sell/flight/established.html',
    html: flightEstablishedHtml,
  },
  {
    relativePath: 'travel-plan-cross-sell/hotel/established.html',
    html: hotelEstablishedHtml,
  },
  {
    relativePath: 'travel-plan-cross-sell/flight/sales.html',
    html: flightSalesHtml,
  },
  {
    relativePath: 'travel-plan-cross-sell/flight/insurance.html',
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
