import {
  type CrossSellEmailDomainMode,
  resolveCrossSellEmailDomainMode,
} from '../../src/emails/cross-sell-email/content/index'
import {
  isPreviewEmailTemplateKey,
  previewAllEmailTemplateKeys,
  type PreviewEmailSource,
  previewEmailSources,
  type PreviewEmailTemplateKey,
  validatePreviewEmailTemplatesForSource,
} from './preview-templates'

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
  domainMode?: CrossSellEmailDomainMode
  from?: string
  fromOptions?: string[]
  source?: PreviewEmailSource
  subject?: string
  templates?: PreviewEmailTemplateKey[]
  to?: string
}

export interface PreviewEmailDraft {
  domainMode?: CrossSellEmailDomainMode
  from: string
  source: PreviewEmailSource
  subjects: Partial<Record<PreviewEmailTemplateKey, string>>
  templates: PreviewEmailTemplateKey[]
  to: string
}

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
  const source = cliOptions.source
    ? resolvePreviewEmailSource(cliOptions.source)
    : undefined
  const templates = cliOptions.templates
    ? resolvePreviewEmailTemplateKeys(cliOptions.templates)
    : undefined
  const domainMode = cliOptions.domainMode
    ? resolveCrossSellEmailDomainMode(cliOptions.domainMode)
    : undefined

  if (source && templates) {
    validatePreviewEmailTemplatesForSource(templates, source)
  }

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
    `Invalid email template "${value}". Expected one of: ${previewAllEmailTemplateKeys.join(
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
    `Invalid email source "${value}". Expected "dist", "react", or "file".`,
  )
}

export function getPreviewEmailUsage() {
  return `Usage:
  pnpm send:email [options]

Options:
  --template <template>       ${previewAllEmailTemplateKeys.join(' | ')}
                              May be comma-separated or repeated.
  --source <source>           dist | react | file
  --domain-mode <mode>        uat | production (react source only)
  --to <email>                Recipient email. Defaults to RESEND_TO.
  --from <sender>             Sender email. Skips RESEND_FROM_OPTIONS prompt.
  --subject <subject>         Default subject for each selected email.
  --help                      Show this help.

Optional environment:
  RESEND_API_KEY (prompted if missing)
  RESEND_FROM_OPTIONS (JSON array of sender choices)
  RESEND_TO

Manual file source:
  Copy full HTML emails into manual-emails/ before using --source=file.
`
}
