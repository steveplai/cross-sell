import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { ReactNode } from 'react'
import type { CreateEmailOptions } from 'resend'

import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import { createInsuranceCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/insurance'
import { createOrderCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/order'
import { createSalesCrossSellEmailContent } from '../src/emails/travel-plan-cross-sell/content/sales'
import {
  createTravelPlanCrossSellAssetUrls,
  resolveTravelPlanCrossSellEmailDomainMode,
  type TravelPlanCrossSellEmailDomainMode,
} from '../src/emails/travel-plan-cross-sell/content/shared-assets'
import { TravelPlanCrossSellEmail } from '../src/emails/travel-plan-cross-sell/TravelPlanCrossSellEmail'

export const previewEmailSources = ['dist', 'react'] as const
export type PreviewEmailSource = (typeof previewEmailSources)[number]

export type PreviewEmailTemplateKey = keyof typeof previewEmailTemplates

export interface PreviewEmailCliOptions {
  domainMode?: string
  from?: string
  help?: boolean
  source?: string
  subject?: string
  template?: string
  to?: string
}

export interface PreviewEmailDefaults {
  apiKey?: string
  domainMode?: TravelPlanCrossSellEmailDomainMode
  from?: string
  source?: PreviewEmailSource
  subject?: string
  template?: PreviewEmailTemplateKey
  to?: string
}

export interface PreviewEmailDraft {
  domainMode?: TravelPlanCrossSellEmailDomainMode
  from: string
  source: PreviewEmailSource
  subject: string
  template: PreviewEmailTemplateKey
  to: string
}

interface PreviewEmailTemplate {
  defaultSubject: string
  distFileName: string
  isTravelPlan: boolean
  label: string
  createReactEmail: (
    domainMode: TravelPlanCrossSellEmailDomainMode,
  ) => ReactNode
}

export const previewEmailTemplates = {
  'demo-product-offer': {
    defaultSubject: '你的專屬加購推薦',
    distFileName: 'demo-product-offer.html',
    isTravelPlan: false,
    label: 'Demo product offer',
    createReactEmail: () => (
      <DemoProductOfferEmail
        ctaUrl="https://example.com/recommendations"
        products={sampleProducts}
        title="你的專屬加購推薦"
      />
    ),
  },
  'order-cross-sell': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'order-cross-sell.html',
    isTravelPlan: true,
    label: 'Order cross-sell',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createOrderCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'sales-cross-sell': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'sales-cross-sell.html',
    isTravelPlan: true,
    label: 'Sales cross-sell',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createSalesCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'insurance-cross-sell': {
    defaultSubject: '旅遊計劃書與簽證護照提醒',
    distFileName: 'insurance-cross-sell.html',
    isTravelPlan: true,
    label: 'Insurance cross-sell',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createInsuranceCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
} satisfies Record<string, PreviewEmailTemplate>

export const previewEmailTemplateKeys = Object.keys(
  previewEmailTemplates,
) as PreviewEmailTemplateKey[]

export function parsePreviewEmailArgs(args: string[]): PreviewEmailCliOptions {
  const options: PreviewEmailCliOptions = {}
  const valueOptions = new Set([
    'domain-mode',
    'from',
    'source',
    'subject',
    'template',
    'to',
  ])

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }

    if (!arg.startsWith('--')) {
      throw new Error(`Unexpected argument "${arg}". Use --help for usage.`)
    }

    const rawName = arg.slice(2)
    const equalsIndex = rawName.indexOf('=')
    const name = equalsIndex >= 0 ? rawName.slice(0, equalsIndex) : rawName
    const inlineValue =
      equalsIndex >= 0 ? rawName.slice(equalsIndex + 1) : undefined

    if (!valueOptions.has(name)) {
      throw new Error(`Unknown option "--${name}". Use --help for usage.`)
    }

    const value = inlineValue ?? args[index + 1]

    if (!value || (inlineValue === undefined && value.startsWith('--'))) {
      throw new Error(`Missing value for "--${name}".`)
    }

    if (inlineValue === undefined) {
      index += 1
    }

    switch (name) {
      case 'domain-mode':
        options.domainMode = value
        break
      case 'from':
        options.from = value
        break
      case 'source':
        options.source = value
        break
      case 'subject':
        options.subject = value
        break
      case 'template':
        options.template = value
        break
      case 'to':
        options.to = value
        break
    }
  }

  return options
}

export function resolvePreviewEmailDefaults(
  cliOptions: PreviewEmailCliOptions,
  env: NodeJS.ProcessEnv = process.env,
): PreviewEmailDefaults {
  const template = cliOptions.template
    ? resolvePreviewEmailTemplateKey(cliOptions.template)
    : undefined
  const source = cliOptions.source
    ? resolvePreviewEmailSource(cliOptions.source)
    : undefined
  const domainMode = cliOptions.domainMode
    ? resolveTravelPlanCrossSellEmailDomainMode(cliOptions.domainMode)
    : undefined

  return {
    apiKey: env.RESEND_API_KEY,
    domainMode,
    from: cliOptions.from ?? env.RESEND_FROM,
    source,
    subject: cliOptions.subject,
    template,
    to: cliOptions.to ?? env.RESEND_TO,
  }
}

export function resolvePreviewEmailTemplateKey(
  value: string,
): PreviewEmailTemplateKey {
  if (isPreviewEmailTemplateKey(value)) {
    return value
  }

  throw new Error(
    `Invalid email template "${value}". Expected one of: ${previewEmailTemplateKeys.join(
      ', ',
    )}.`,
  )
}

export function resolvePreviewEmailSource(value: string): PreviewEmailSource {
  if (previewEmailSources.includes(value as PreviewEmailSource)) {
    return value as PreviewEmailSource
  }

  throw new Error(
    `Invalid email source "${value}". Expected "dist" or "react".`,
  )
}

export async function createPreviewEmailPayload(
  draft: PreviewEmailDraft,
  root = process.cwd(),
): Promise<CreateEmailOptions> {
  const basePayload = {
    from: draft.from,
    subject: draft.subject,
    to: draft.to,
  }

  if (draft.source === 'dist') {
    return {
      ...basePayload,
      html: await readDistEmailHtml(draft.template, root),
    }
  }

  return {
    ...basePayload,
    react: previewEmailTemplates[draft.template].createReactEmail(
      draft.domainMode ?? 'uat',
    ),
  }
}

export async function readDistEmailHtml(
  template: PreviewEmailTemplateKey,
  root = process.cwd(),
) {
  const fileName = previewEmailTemplates[template].distFileName
  const filePath = resolve(root, 'dist/emails', fileName)

  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new Error(
        `Missing dist email file: ${filePath}. Run pnpm build:emails first, or choose source "react".`,
        { cause: error },
      )
    }

    throw error
  }
}

export function getPreviewEmailUsage() {
  return `Usage:
  pnpm send:email:preview [options]

Options:
  --template <template>       ${previewEmailTemplateKeys.join(' | ')}
  --source <source>           dist | react
  --domain-mode <mode>        uat | production
  --to <email>                Recipient email. Defaults to RESEND_TO.
  --from <sender>             Sender email. Defaults to RESEND_FROM.
  --subject <subject>         Email subject.
  --help                      Show this help.

Optional environment:
  RESEND_API_KEY (prompted if missing)
  RESEND_FROM
  RESEND_TO
`
}

function isPreviewEmailTemplateKey(
  value: string,
): value is PreviewEmailTemplateKey {
  return Object.hasOwn(previewEmailTemplates, value)
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
