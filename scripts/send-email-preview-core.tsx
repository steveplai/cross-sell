import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { ReactNode } from 'react'
import type { CreateEmailOptions } from 'resend'

import { DemoProductOfferEmail } from '../src/emails/demo-product-offer/DemoProductOfferEmail'
import { sampleProducts } from '../src/emails/demo-product-offer/sample-data'
import {
  createFlightEstablishedCrossSellEmailContent,
  createFlightInsuranceCrossSellEmailContent,
  createFlightSalesCrossSellEmailContent,
  createHotelEstablishedCrossSellEmailContent,
  createTravelPlanCrossSellAssetUrls,
  resolveTravelPlanCrossSellEmailDomainMode,
  type TravelPlanCrossSellEmailDomainMode,
} from '../src/emails/travel-plan-cross-sell/content/index'
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
  templates?: string[]
  to?: string
}

export interface PreviewEmailDefaults {
  apiKey?: string
  domainMode?: TravelPlanCrossSellEmailDomainMode
  from?: string
  fromOptions?: string[]
  source?: PreviewEmailSource
  subject?: string
  templates?: PreviewEmailTemplateKey[]
  to?: string
}

export interface PreviewEmailDraft {
  domainMode?: TravelPlanCrossSellEmailDomainMode
  from: string
  source: PreviewEmailSource
  subjects: Partial<Record<PreviewEmailTemplateKey, string>>
  templates: PreviewEmailTemplateKey[]
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
    distFileName: 'demo-product-offer/index.html',
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
  'flight-established': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'travel-plan-cross-sell/flight/established.html',
    isTravelPlan: true,
    label: 'Flight established',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createFlightEstablishedCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'hotel-established': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'travel-plan-cross-sell/hotel/established.html',
    isTravelPlan: true,
    label: 'Hotel established',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createHotelEstablishedCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'flight-sales': {
    defaultSubject: '旅遊計劃書與限時加購優惠',
    distFileName: 'travel-plan-cross-sell/flight/sales.html',
    isTravelPlan: true,
    label: 'Flight sales',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createFlightSalesCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'flight-insurance': {
    defaultSubject: '旅遊計劃書與簽證護照提醒',
    distFileName: 'travel-plan-cross-sell/flight/insurance.html',
    isTravelPlan: true,
    label: 'Flight insurance',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createFlightEstablishedCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'full-flight-established': {
    defaultSubject: '旅遊計劃書',
    distFileName: 'travel-plan-cross-sell/flight/full-established.html',
    isTravelPlan: true,
    label: 'Full flight established',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createFlightSalesCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'full-flight-sales': {
    defaultSubject: '限時加購優惠',
    distFileName: 'travel-plan-cross-sell/flight/full-sales.html',
    isTravelPlan: true,
    label: 'Full flight sales',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createFlightInsuranceCrossSellEmailContent(
          createTravelPlanCrossSellAssetUrls(domainMode),
        )}
      />
    ),
  },
  'full-flight-insurance': {
    defaultSubject: '簽證護照提醒',
    distFileName: 'travel-plan-cross-sell/flight/full-insurance.html',
    isTravelPlan: true,
    label: 'Full flight insurance',
    createReactEmail: (domainMode) => (
      <TravelPlanCrossSellEmail
        {...createFlightInsuranceCrossSellEmailContent(
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
        options.templates = [
          ...(options.templates ?? []),
          ...parsePreviewEmailTemplateOption(value),
        ]
        break
      case 'to':
        options.to = value
        break
    }
  }

  return options
}

function parsePreviewEmailTemplateOption(value: string) {
  const templates = value
    .split(',')
    .map((template) => template.trim())
    .filter(Boolean)

  if (templates.length === 0) {
    throw new Error('Missing value for "--template".')
  }

  return templates
}

export function resolvePreviewEmailDefaults(
  cliOptions: PreviewEmailCliOptions,
  env: NodeJS.ProcessEnv = process.env,
): PreviewEmailDefaults {
  const templates = cliOptions.templates
    ? resolvePreviewEmailTemplateKeys(cliOptions.templates)
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
    from: cliOptions.from,
    fromOptions: cliOptions.from
      ? []
      : resolvePreviewEmailFromOptions(env.RESEND_FROM_OPTIONS),
    source,
    subject: cliOptions.subject,
    templates,
    to: cliOptions.to ?? env.RESEND_TO,
  }
}

export function resolvePreviewEmailFromOptions(value?: string) {
  const rawValue = value?.trim()

  if (!rawValue) {
    return []
  }

  let parsed: unknown

  try {
    parsed = JSON.parse(rawValue)
  } catch (error) {
    throw new Error(
      'Invalid RESEND_FROM_OPTIONS. Expected a JSON array of sender strings.',
      { cause: error },
    )
  }

  if (
    !Array.isArray(parsed) ||
    parsed.some((option) => typeof option !== 'string' || !option.trim())
  ) {
    throw new Error(
      'Invalid RESEND_FROM_OPTIONS. Expected a JSON array of sender strings.',
    )
  }

  return parsed.map((option) => option.trim())
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

export function resolvePreviewEmailTemplateKeys(
  values: readonly string[],
): PreviewEmailTemplateKey[] {
  const templates = values.map((value) => resolvePreviewEmailTemplateKey(value))

  return [...new Set(templates)]
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
  draft: Omit<PreviewEmailDraft, 'subjects' | 'templates'> & {
    subject: string
    template: PreviewEmailTemplateKey
  },
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

export async function createPreviewEmailPayloads(
  draft: PreviewEmailDraft,
  root = process.cwd(),
): Promise<CreateEmailOptions[]> {
  const { subjects, templates, ...sendSettings } = draft

  return Promise.all(
    templates.map((template) =>
      createPreviewEmailPayload(
        {
          ...sendSettings,
          subject: resolvePreviewEmailDraftSubject(subjects, template),
          template,
        },
        root,
      ),
    ),
  )
}

function resolvePreviewEmailDraftSubject(
  subjects: PreviewEmailDraft['subjects'],
  template: PreviewEmailTemplateKey,
) {
  const subject = subjects[template]?.trim()

  if (!subject) {
    throw new Error(`Missing subject for template "${template}".`)
  }

  return subject
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
                              May be comma-separated or repeated.
  --source <source>           dist | react
  --domain-mode <mode>        uat | production
  --to <email>                Recipient email. Defaults to RESEND_TO.
  --from <sender>             Sender email. Skips RESEND_FROM_OPTIONS prompt.
  --subject <subject>         Default subject for each selected email.
  --help                      Show this help.

Optional environment:
  RESEND_API_KEY (prompted if missing)
  RESEND_FROM_OPTIONS (JSON array of sender choices)
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
