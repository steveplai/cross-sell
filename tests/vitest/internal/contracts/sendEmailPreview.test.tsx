import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  createPreviewEmailPayload,
  createPreviewEmailPayloads,
  parsePreviewEmailArgs,
  previewEmailTemplates,
  readDistEmailHtml,
  resolvePreviewEmailDefaults,
  resolvePreviewEmailFromOptions,
  resolvePreviewEmailSource,
  resolvePreviewEmailTemplateKey,
} from '../../../../scripts/send-email-preview-core'

describe('send email preview contracts', () => {
  it('defines template metadata for dist and React Email sources', () => {
    expect(previewEmailTemplates['demo-product-offer']).toMatchObject({
      defaultSubject: '你的專屬加購推薦',
      distFileName: 'demo-product-offer/index.html',
      usesCrossSellEmailDomainMode: false,
    })
    expect(previewEmailTemplates['flight-established']).toMatchObject({
      defaultSubject: '旅遊計劃書與限時加購優惠',
      distFileName: 'cross-sell-email/flight/established.html',
      usesCrossSellEmailDomainMode: true,
    })
    expect(previewEmailTemplates['hotel-established']).toMatchObject({
      defaultSubject: '旅遊計劃書與限時加購優惠',
      distFileName: 'cross-sell-email/hotel/established.html',
      usesCrossSellEmailDomainMode: true,
    })
    expect(previewEmailTemplates['flight-sales']).toMatchObject({
      distFileName: 'cross-sell-email/flight/sales.html',
      usesCrossSellEmailDomainMode: true,
    })
    expect(previewEmailTemplates['flight-insurance']).toMatchObject({
      defaultSubject: '旅遊計劃書與簽證護照提醒',
      distFileName: 'cross-sell-email/flight/insurance.html',
      usesCrossSellEmailDomainMode: true,
    })
  })

  it('parses CLI options and applies env defaults', () => {
    const cliOptions = parsePreviewEmailArgs([
      '--template=flight-established,flight-sales',
      '--template',
      'flight-insurance',
      '--source',
      'react',
      '--to',
      'cli-to@example.com',
      '--domain-mode=production',
    ])
    const defaults = resolvePreviewEmailDefaults(cliOptions, {
      RESEND_API_KEY: 'key',
      RESEND_FROM_OPTIONS: '["sender@example.com","other-sender@example.com"]',
      RESEND_TO: 'env-to@example.com',
    })

    expect(defaults).toMatchObject({
      apiKey: 'key',
      domainMode: 'production',
      fromOptions: ['sender@example.com', 'other-sender@example.com'],
      source: 'react',
      templates: ['flight-established', 'flight-sales', 'flight-insurance'],
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
    expect(() => resolvePreviewEmailFromOptions('sender@example.com')).toThrow(
      'Invalid RESEND_FROM_OPTIONS',
    )
  })

  it('ignores RESEND_FROM_OPTIONS when --from is provided', () => {
    const defaults = resolvePreviewEmailDefaults(
      parsePreviewEmailArgs(['--from=cli-sender@example.com']),
      {
        RESEND_FROM_OPTIONS:
          '["env-sender@example.com","other-sender@example.com"]',
      },
    )

    expect(defaults).toMatchObject({
      from: 'cli-sender@example.com',
      fromOptions: [],
    })
  })

  it('returns a clear error when a dist email file is missing', async () => {
    const root = join(tmpdir(), `email-preview-missing-${randomUUID()}`)

    await expect(readDistEmailHtml('flight-established', root)).rejects.toThrow(
      'Run pnpm build:emails first',
    )
  })

  it('creates an html payload from a dist email file', async () => {
    const root = join(tmpdir(), `email-preview-${randomUUID()}`)

    await mkdir(join(root, 'dist/emails/cross-sell-email/flight'), {
      recursive: true,
    })
    await writeFile(
      join(root, 'dist/emails/cross-sell-email/flight/established.html'),
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
            template: 'flight-established',
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
      template: 'flight-insurance',
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

  it('creates payloads for multiple templates with shared send settings and separate subjects', async () => {
    const root = join(tmpdir(), `email-preview-multiple-${randomUUID()}`)

    await mkdir(join(root, 'dist/emails/cross-sell-email/flight'), {
      recursive: true,
    })
    await writeFile(
      join(root, 'dist/emails/cross-sell-email/flight/established.html'),
      '<html><body>order</body></html>',
      'utf8',
    )
    await writeFile(
      join(root, 'dist/emails/cross-sell-email/flight/sales.html'),
      '<html><body>sales</body></html>',
      'utf8',
    )

    try {
      await expect(
        createPreviewEmailPayloads(
          {
            from: 'sender@example.com',
            source: 'dist',
            subjects: {
              'flight-established': 'Order Preview',
              'flight-sales': 'Sales Preview',
            },
            templates: ['flight-established', 'flight-sales'],
            to: 'recipient@example.com',
          },
          root,
        ),
      ).resolves.toMatchObject([
        {
          from: 'sender@example.com',
          html: '<html><body>order</body></html>',
          subject: 'Order Preview',
          to: 'recipient@example.com',
        },
        {
          from: 'sender@example.com',
          html: '<html><body>sales</body></html>',
          subject: 'Sales Preview',
          to: 'recipient@example.com',
        },
      ])
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })
})
