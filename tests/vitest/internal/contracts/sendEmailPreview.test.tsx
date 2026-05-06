import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  createPreviewEmailPayload,
  parsePreviewEmailArgs,
  previewEmailTemplates,
  readDistEmailHtml,
  resolvePreviewEmailDefaults,
  resolvePreviewEmailSource,
  resolvePreviewEmailTemplateKey,
} from '../../../../scripts/send-email-preview-core'

describe('send email preview contracts', () => {
  it('defines template metadata for dist and React Email sources', () => {
    expect(previewEmailTemplates['demo-product-offer']).toMatchObject({
      defaultSubject: '你的專屬加購推薦',
      distFileName: 'demo-product-offer.html',
      isTravelPlan: false,
    })
    expect(previewEmailTemplates['order-cross-sell']).toMatchObject({
      defaultSubject: '旅遊計劃書與限時加購優惠',
      distFileName: 'order-cross-sell.html',
      isTravelPlan: true,
    })
    expect(previewEmailTemplates['sales-cross-sell']).toMatchObject({
      distFileName: 'sales-cross-sell.html',
      isTravelPlan: true,
    })
    expect(previewEmailTemplates['insurance-cross-sell']).toMatchObject({
      defaultSubject: '旅遊計劃書與簽證護照提醒',
      distFileName: 'insurance-cross-sell.html',
      isTravelPlan: true,
    })
  })

  it('parses CLI options and applies env defaults', () => {
    const cliOptions = parsePreviewEmailArgs([
      '--template=order-cross-sell',
      '--source',
      'react',
      '--to',
      'cli-to@example.com',
      '--domain-mode=production',
    ])
    const defaults = resolvePreviewEmailDefaults(cliOptions, {
      RESEND_API_KEY: 'key',
      RESEND_FROM: 'sender@example.com',
      RESEND_TO: 'env-to@example.com',
    })

    expect(defaults).toMatchObject({
      apiKey: 'key',
      domainMode: 'production',
      from: 'sender@example.com',
      source: 'react',
      template: 'order-cross-sell',
      to: 'cli-to@example.com',
    })
  })

  it('rejects invalid template, source, and domain mode values', () => {
    expect(() => resolvePreviewEmailTemplateKey('unknown')).toThrow(
      'Invalid email template "unknown"',
    )
    expect(() => resolvePreviewEmailSource('file')).toThrow(
      'Invalid email source "file"',
    )
    expect(() =>
      resolvePreviewEmailDefaults(
        parsePreviewEmailArgs(['--domain-mode=staging']),
        {},
      ),
    ).toThrow('Invalid EMAIL_DOMAIN_MODE "staging"')
  })

  it('returns a clear error when a dist email file is missing', async () => {
    const root = join(tmpdir(), `email-preview-missing-${randomUUID()}`)

    await expect(readDistEmailHtml('order-cross-sell', root)).rejects.toThrow(
      'Run pnpm build:emails first',
    )
  })

  it('creates an html payload from a dist email file', async () => {
    const root = join(tmpdir(), `email-preview-${randomUUID()}`)

    await mkdir(join(root, 'dist/emails'), { recursive: true })
    await writeFile(
      join(root, 'dist/emails/order-cross-sell.html'),
      '<html><body>preview</body></html>',
      'utf8',
    )

    try {
      await expect(
        createPreviewEmailPayload(
          {
            from: 'sender@example.com',
            source: 'dist',
            subject: 'Preview',
            template: 'order-cross-sell',
            to: 'recipient@example.com',
          },
          root,
        ),
      ).resolves.toMatchObject({
        from: 'sender@example.com',
        html: '<html><body>preview</body></html>',
        subject: 'Preview',
        to: 'recipient@example.com',
      })
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('creates a React Email payload without rendering html', async () => {
    const payload = await createPreviewEmailPayload({
      domainMode: 'production',
      from: 'sender@example.com',
      source: 'react',
      subject: 'Preview',
      template: 'insurance-cross-sell',
      to: 'recipient@example.com',
    })

    expect(payload).toMatchObject({
      from: 'sender@example.com',
      subject: 'Preview',
      to: 'recipient@example.com',
    })
    expect('react' in payload).toBe(true)
    expect('html' in payload).toBe(false)
  })
})
