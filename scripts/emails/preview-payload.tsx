import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import type { CreateEmailOptions } from 'resend'

import type { PreviewEmailDraft } from './preview-core'
import {
  assertPreviewEmailTemplateSupportsSource,
  isPreviewBuiltEmailTemplateKey,
  isPreviewManualEmailTemplateKey,
  manualEmailTemplates,
  type PreviewEmailTemplateKey,
  previewEmailTemplates,
  validatePreviewEmailTemplatesForSource,
} from './preview-templates'

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

  assertPreviewEmailTemplateSupportsSource(draft.template, draft.source)

  if (draft.source === 'dist') {
    return {
      ...basePayload,
      html: await readDistEmailHtml(draft.template, root),
    }
  }

  if (draft.source === 'file') {
    return {
      ...basePayload,
      html: await readManualEmailHtml(draft.template, root),
    }
  }

  if (!isPreviewBuiltEmailTemplateKey(draft.template)) {
    throw new Error(
      `Template "${draft.template}" does not support source "react". Expected one of: file.`,
    )
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

  validatePreviewEmailTemplatesForSource(templates, draft.source)

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
  if (!isPreviewBuiltEmailTemplateKey(template)) {
    throw new Error(
      `Template "${template}" does not support source "dist". Expected one of: file.`,
    )
  }

  const fileName = previewEmailTemplates[template].distFileName
  const filePath = resolve(root, 'dist/emails', 'latest', fileName)

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

export async function readManualEmailHtml(
  template: PreviewEmailTemplateKey,
  root = process.cwd(),
) {
  if (!isPreviewManualEmailTemplateKey(template)) {
    throw new Error(
      `Template "${template}" does not support source "file". Expected one of: dist, react.`,
    )
  }

  const fileName = manualEmailTemplates[template].fileName
  const filePath = resolve(root, 'manual-emails', fileName)

  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new Error(
        `Missing manual email file: ${filePath}. Copy the full HTML email into manual-emails/${fileName}, or choose source "dist" or "react" for built templates.`,
        { cause: error },
      )
    }

    throw error
  }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
