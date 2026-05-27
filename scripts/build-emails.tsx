import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { render } from '@react-email/render'

import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import { createInsuranceCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/insurance'
import {
  createHotelOrderCrossSellEmailContent,
  createOrderCrossSellEmailContent,
} from '../src/emails/travel-plan-cross-sell/content/order'
import { createSalesCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/sales'
import {
  createTravelPlanCrossSellAssetUrls,
  resolveTravelPlanCrossSellEmailDomainMode,
} from '../src/emails/travel-plan-cross-sell/content/shared-assets'
import { TravelPlanCrossSellEmail } from '../src/emails/travel-plan-cross-sell/TravelPlanCrossSellEmail'

interface EmailOutput {
  fileName: string
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

function extractHtmlTagContent(html: string, tagName: 'body' | 'head') {
  const tagPattern = new RegExp(
    `<${tagName}\\b[^>]*>([\\s\\S]*)<\\/${tagName}>`,
    'i',
  )
  const match = html.match(tagPattern)

  if (!match) {
    throw new Error(
      `Unable to extract <${tagName}> content from rendered email.`,
    )
  }

  return `${match[1].trim()}\n`
}

function createFragmentOutput(fileName: string, html: string): EmailOutput {
  return {
    fileName,
    html: extractHtmlTagContent(html, 'body'),
  }
}

function createHeadOutput(fileName: string, html: string): EmailOutput {
  return {
    fileName,
    html: extractHtmlTagContent(html, 'head'),
  }
}

function createTravelPlanCrossSellOutputs(
  baseFileName: string,
  html: string,
): EmailOutput[] {
  const baseName = baseFileName.replace(/\.html$/, '')

  return [
    { fileName: baseFileName, html },
    createFragmentOutput(`${baseName}.fragment.html`, html),
    createHeadOutput(`${baseName}.head.html`, html),
  ]
}

const outDir = resolve(process.cwd(), 'dist/emails')
const travelPlanCrossSellEmailDomainMode =
  resolveTravelPlanCrossSellEmailDomainMode(
    getDomainModeArg(process.argv.slice(2)) ?? process.env.EMAIL_DOMAIN_MODE,
  )
const travelPlanCrossSellAssetUrls = createTravelPlanCrossSellAssetUrls(
  travelPlanCrossSellEmailDomainMode,
)

await mkdir(outDir, { recursive: true })

const orderCrossSellHtml = await render(
  <TravelPlanCrossSellEmail
    {...createOrderCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
  />,
)
const hotelOrderCrossSellHtml = await render(
  <TravelPlanCrossSellEmail
    {...createHotelOrderCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
  />,
)
const salesCrossSellHtml = await render(
  <TravelPlanCrossSellEmail
    {...createSalesCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
  />,
)
const insuranceCrossSellHtml = await render(
  <TravelPlanCrossSellEmail
    {...createInsuranceCrossSellEmailContent(travelPlanCrossSellAssetUrls)}
  />,
)

const emails: EmailOutput[] = [
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
  ...createTravelPlanCrossSellOutputs(
    'order-cross-sell.html',
    orderCrossSellHtml,
  ),
  ...createTravelPlanCrossSellOutputs(
    'hotel-order-cross-sell.html',
    hotelOrderCrossSellHtml,
  ),
  ...createTravelPlanCrossSellOutputs(
    'sales-cross-sell.html',
    salesCrossSellHtml,
  ),
  ...createTravelPlanCrossSellOutputs(
    'insurance-cross-sell.html',
    insuranceCrossSellHtml,
  ),
]

await Promise.all(
  emails.map((email) =>
    writeFile(resolve(outDir, email.fileName), email.html, 'utf8'),
  ),
)
