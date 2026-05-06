import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'

import { config as loadDotenv } from 'dotenv'
import { Resend } from 'resend'

import {
  resolveTravelPlanCrossSellEmailDomainMode,
  type TravelPlanCrossSellEmailDomainMode,
} from '../src/emails/travel-plan-cross-sell/content/shared-assets'
import {
  createPreviewEmailPayload,
  getPreviewEmailUsage,
  parsePreviewEmailArgs,
  type PreviewEmailDefaults,
  type PreviewEmailDraft,
  previewEmailSources,
  previewEmailTemplateKeys,
  previewEmailTemplates,
  resolvePreviewEmailDefaults,
} from './send-email-preview-core'

loadDotenv({ quiet: true })

async function main() {
  const cliOptions = parsePreviewEmailArgs(process.argv.slice(2))

  if (cliOptions.help) {
    console.log(getPreviewEmailUsage())
    return
  }

  const defaults = resolvePreviewEmailDefaults(cliOptions)
  const apiKey = await promptForResendApiKey(defaults.apiKey)

  console.log(`Loaded RESEND_API_KEY: ${formatSecretPreview(apiKey)}`)

  const draft = await promptForPreviewEmailDraft(defaults)

  printSummary(draft)

  const confirmed = await promptConfirmation()

  if (!confirmed) {
    console.log('Canceled. No email was sent.')
    return
  }

  const resend = new Resend(apiKey)
  const payload = await createPreviewEmailPayload(draft)
  const result = await resend.emails.send(payload)

  if (result.error) {
    throw new Error(`Resend failed: ${result.error.message}`)
  }

  console.log(`Sent preview email. Resend email id: ${result.data.id}`)
}

async function promptForResendApiKey(defaultValue?: string) {
  const envValue = defaultValue?.trim()

  if (envValue) {
    return envValue
  }

  console.log(
    'RESEND_API_KEY is not set. Enter it for this send only; it will not be saved.',
  )

  return promptHiddenRequiredInput('RESEND_API_KEY')
}

async function promptForPreviewEmailDraft(
  defaults: PreviewEmailDefaults,
): Promise<PreviewEmailDraft> {
  const rl = createInterface({ input, output })

  try {
    const template = await promptSelect(
      rl,
      'Template',
      previewEmailTemplateKeys,
      (value) => `${value} - ${previewEmailTemplates[value].label}`,
      defaults.template,
    )
    const source = await promptSelect(
      rl,
      'Source',
      previewEmailSources,
      (value) => value,
      defaults.source,
    )
    const domainMode =
      source === 'react' && previewEmailTemplates[template].isTravelPlan
        ? await promptDomainMode(rl, defaults.domainMode)
        : undefined
    const to = await promptRequiredInput(rl, 'To', defaults.to)
    const from = await promptFrom(rl, defaults)
    const subject = await promptRequiredInput(
      rl,
      'Subject',
      defaults.subject ?? previewEmailTemplates[template].defaultSubject,
    )

    return {
      domainMode,
      from,
      source,
      subject,
      template,
      to,
    }
  } finally {
    rl.close()
  }
}

async function promptHiddenRequiredInput(label: string) {
  while (true) {
    const answer = input.isTTY
      ? (await readHiddenLine(`${label}: `)).trim()
      : await promptVisibleRequiredInput(label)

    if (answer) {
      return answer
    }

    console.log(`${label} is required.`)
  }
}

async function readHiddenLine(prompt: string) {
  return new Promise<string>((resolve, reject) => {
    const characters: string[] = []
    const wasRaw = input.isRaw

    function cleanup() {
      input.off('data', onData)

      if (input.isTTY) {
        input.setRawMode(wasRaw)
      }
    }

    function finish(value: string) {
      cleanup()
      output.write('\n')
      resolve(value)
    }

    function cancel() {
      cleanup()
      output.write('\n')
      reject(new Error('Canceled. No email was sent.'))
    }

    function onData(buffer: Buffer) {
      for (const character of buffer.toString('utf8')) {
        if (character === '\u0003' || character === '\u0004') {
          cancel()
          return
        }

        if (character === '\r' || character === '\n') {
          finish(characters.join(''))
          return
        }

        if (character === '\b' || character === '\u007f') {
          characters.pop()
          continue
        }

        if (character === '\u001b') {
          continue
        }

        if (character >= ' ') {
          characters.push(character)
        }
      }
    }

    output.write(prompt)
    input.setRawMode(true)
    input.resume()
    input.on('data', onData)
  })
}

async function promptVisibleRequiredInput(label: string) {
  const rl = createInterface({ input, output })

  try {
    return (await rl.question(`${label}: `)).trim()
  } finally {
    rl.close()
  }
}

async function promptSelect<T extends string>(
  rl: ReturnType<typeof createInterface>,
  label: string,
  options: readonly T[],
  formatOption: (value: T) => string,
  defaultValue?: T,
): Promise<T> {
  const defaultIndex = defaultValue ? options.indexOf(defaultValue) : -1
  const defaultPrompt =
    defaultIndex >= 0 ? ` [${String(defaultIndex + 1)}]` : ''

  console.log(`\n${label}:`)

  options.forEach((option, index) => {
    console.log(`  ${index + 1}. ${formatOption(option)}`)
  })

  while (true) {
    const answer = (
      await rl.question(`Choose ${label.toLowerCase()}${defaultPrompt}: `)
    ).trim()

    if (!answer && defaultIndex >= 0) {
      return options[defaultIndex]
    }

    const selectedIndex = Number(answer) - 1

    if (Number.isInteger(selectedIndex) && options[selectedIndex]) {
      return options[selectedIndex]
    }

    const directMatch = options.find((option) => option === answer)

    if (directMatch) {
      return directMatch
    }

    console.log(`Enter a number from 1 to ${options.length}.`)
  }
}

async function promptDomainMode(
  rl: ReturnType<typeof createInterface>,
  defaultValue?: TravelPlanCrossSellEmailDomainMode,
) {
  const value = await promptSelect(
    rl,
    'Domain mode',
    ['uat', 'production'] as const,
    (option) => option,
    defaultValue ?? 'uat',
  )

  return resolveTravelPlanCrossSellEmailDomainMode(value)
}

async function promptFrom(
  rl: ReturnType<typeof createInterface>,
  defaults: PreviewEmailDefaults,
) {
  if (defaults.from) {
    return defaults.from
  }

  const options = defaults.fromOptions ?? []

  if (options.length > 0) {
    return promptSelectOrCustomInput(rl, 'From', options, 'Custom sender')
  }

  return promptRequiredInput(rl, 'From')
}

async function promptSelectOrCustomInput(
  rl: ReturnType<typeof createInterface>,
  label: string,
  options: readonly string[],
  customLabel: string,
) {
  const customIndex = options.length

  console.log(`\n${label}:`)

  options.forEach((option, index) => {
    console.log(`  ${index + 1}. ${option}`)
  })
  console.log(`  ${customIndex + 1}. ${customLabel}`)

  while (true) {
    const answer = (
      await rl.question(`Choose ${label.toLowerCase()} [1]: `)
    ).trim()

    if (!answer) {
      return options[0]
    }

    const selectedIndex = Number(answer) - 1

    if (Number.isInteger(selectedIndex) && options[selectedIndex]) {
      return options[selectedIndex]
    }

    if (selectedIndex === customIndex) {
      return promptRequiredInput(rl, label)
    }

    console.log(`Enter a number from 1 to ${options.length + 1}.`)
  }
}

async function promptRequiredInput(
  rl: ReturnType<typeof createInterface>,
  label: string,
  defaultValue?: string,
) {
  const defaultPrompt = defaultValue ? ` [${defaultValue}]` : ''

  while (true) {
    const answer = (await rl.question(`${label}${defaultPrompt}: `)).trim()
    const value = answer || defaultValue

    if (value?.trim()) {
      return value.trim()
    }

    console.log(`${label} is required.`)
  }
}

async function promptConfirmation() {
  const rl = createInterface({ input, output })

  try {
    const answer = (await rl.question('\nSend this preview email? [y/N]: '))
      .trim()
      .toLowerCase()

    return answer === 'y' || answer === 'yes'
  } finally {
    rl.close()
  }
}

function printSummary(draft: PreviewEmailDraft) {
  console.log('\nPreview email summary:')
  console.log(`  Template: ${draft.template}`)
  console.log(`  Source: ${draft.source}`)

  if (draft.source === 'react' && draft.domainMode) {
    console.log(`  Domain mode: ${draft.domainMode}`)
  }

  console.log(`  To: ${draft.to}`)
  console.log(`  From: ${draft.from}`)
  console.log(`  Subject: ${draft.subject}`)
}

function formatSecretPreview(value: string) {
  const secret = value.trim()

  if (secret.length <= 4) {
    return `${'*'.repeat(secret.length)} (${secret.length} chars)`
  }

  return `${secret.slice(0, 4)}... (${secret.length} chars)`
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
