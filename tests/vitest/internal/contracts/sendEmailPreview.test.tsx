import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  parsePreviewEmailArgs,
  resolvePreviewEmailDefaults,
  resolvePreviewEmailFromOptions,
  resolvePreviewEmailSource,
  resolvePreviewEmailTemplateKey,
} from '../../../../scripts/emails/preview-core'
import {
  createPreviewEmailPayload,
  createPreviewEmailPayloads,
  readDistEmailHtml,
  readManualEmailHtml,
} from '../../../../scripts/emails/preview-payload'

describe('email preview 寄送契約', () => {
  it('會解析 CLI options 並套用環境變數預設值', () => {
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

  it('會拒絕無效的 template、source 與 domain mode 值', () => {
    expect(() => resolvePreviewEmailTemplateKey('unknown')).toThrow(
      'Invalid email template "unknown"',
    )
    expect(resolvePreviewEmailSource('file')).toBe('file')
    expect(() => resolvePreviewEmailSource('ftp')).toThrow(
      'Invalid email source "ftp"',
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

  it('提供 --from 時會忽略 RESEND_FROM_OPTIONS', () => {
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

  it('dist email 檔案不存在時會回傳清楚的錯誤', async () => {
    const root = join(tmpdir(), `email-preview-missing-${randomUUID()}`)

    await expect(readDistEmailHtml('flight-established', root)).rejects.toThrow(
      'Run pnpm build:emails first',
    )
  })

  it('會從 dist email 檔案建立 HTML payload', async () => {
    const root = join(tmpdir(), `email-preview-${randomUUID()}`)

    await mkdir(join(root, 'dist/emails/latest/cross-sell-email/flight'), {
      recursive: true,
    })
    await writeFile(
      join(root, 'dist/emails/latest/cross-sell-email/flight/established.html'),
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

  it('會從 manual email 檔案建立 HTML payload', async () => {
    const root = join(tmpdir(), `manual-email-preview-${randomUUID()}`)

    await mkdir(join(root, 'manual-emails'), { recursive: true })
    await writeFile(
      join(root, 'manual-emails/full-flight-insurance.html'),
      '<html><body>full flight insurance</body></html>',
      'utf8',
    )

    try {
      await expect(
        createPreviewEmailPayload(
          {
            from: 'sender@example.com',
            source: 'file',
            subject: 'Manual Preview',
            template: 'full-flight-insurance',
            to: 'recipient@example.com',
          },
          root,
        ),
      ).resolves.toMatchObject({
        from: 'sender@example.com',
        html: '<html><body>full flight insurance</body></html>',
        subject: 'Manual Preview',
        to: 'recipient@example.com',
      })
    } finally {
      await rm(root, { force: true, recursive: true })
    }
  })

  it('manual email 檔案不存在時會回傳清楚的錯誤', async () => {
    const root = join(tmpdir(), `manual-email-missing-${randomUUID()}`)

    await expect(
      readManualEmailHtml('full-flight-insurance', root),
    ).rejects.toThrow(
      'Copy the full HTML email into manual-emails/full-flight-insurance.html',
    )
  })

  it('會拒絕 source 與 template 類型不相容的組合', async () => {
    expect(() =>
      resolvePreviewEmailDefaults(
        parsePreviewEmailArgs(['--source=file', '--template=flight-insurance']),
        {},
      ),
    ).toThrow('Template "flight-insurance" does not support source "file"')
    expect(() =>
      resolvePreviewEmailDefaults(
        parsePreviewEmailArgs([
          '--source=react',
          '--template=full-flight-insurance',
        ]),
        {},
      ),
    ).toThrow(
      'Template "full-flight-insurance" does not support source "react"',
    )
    await expect(
      createPreviewEmailPayload({
        from: 'sender@example.com',
        source: 'file',
        subject: 'Preview',
        template: 'flight-insurance',
        to: 'recipient@example.com',
      }),
    ).rejects.toThrow(
      'Template "flight-insurance" does not support source "file"',
    )
    await expect(
      createPreviewEmailPayload({
        from: 'sender@example.com',
        source: 'react',
        subject: 'Preview',
        template: 'full-flight-insurance',
        to: 'recipient@example.com',
      }),
    ).rejects.toThrow(
      'Template "full-flight-insurance" does not support source "react"',
    )
    await expect(readDistEmailHtml('full-flight-insurance')).rejects.toThrow(
      'Template "full-flight-insurance" does not support source "dist"',
    )
  })

  it('會建立不預先渲染 HTML 的 React Email payload', async () => {
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

  it('會為多個 templates 建立共用寄送設定且主旨各自獨立的 payloads', async () => {
    const root = join(tmpdir(), `email-preview-multiple-${randomUUID()}`)

    await mkdir(join(root, 'dist/emails/latest/cross-sell-email/flight'), {
      recursive: true,
    })
    await writeFile(
      join(root, 'dist/emails/latest/cross-sell-email/flight/established.html'),
      '<html><body>order</body></html>',
      'utf8',
    )
    await writeFile(
      join(root, 'dist/emails/latest/cross-sell-email/flight/sales.html'),
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
