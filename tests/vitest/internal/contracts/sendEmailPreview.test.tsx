import { randomUUID } from 'node:crypto'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import {
  type EmailBuildOutput,
  emailBuildOutputs,
} from '../../../../scripts/build-emails-core'
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

type BuiltEmailTemplateKey = EmailBuildOutput['templateKey']

const previewReactEmailExpectations = [
  {
    templateKey: 'demo-product-offer',
    includes: ['你的專屬加購推薦', '商品 A', '查看推薦'],
  },
  {
    templateKey: 'flight-established',
    includes: [
      '旅遊計劃書與限時加購優惠',
      '加購優惠於2026/04/10 13:49 截止！',
      '立即預訂交通票券',
    ],
    excludes: ['旅遊計劃書與簽證護照提醒'],
  },
  {
    templateKey: 'hotel-established',
    includes: [
      '旅遊計劃書與限時加購優惠',
      '立即預訂交通票券',
      '抵達後先搞定交通，行程更順暢',
    ],
    excludes: ['飯店下榻', '簽證護照'],
  },
  {
    templateKey: 'flight-sales',
    includes: ['旅遊計劃書與限時加購優惠', '立即搜尋飯店', '推薦熱門住宿：'],
    excludes: ['旅遊計劃書與簽證護照提醒'],
  },
  {
    templateKey: 'hotel-sales',
    includes: [
      '旅遊計劃書與限時加購優惠',
      '立即預訂交通票券',
      '抵達後先搞定交通，行程更順暢',
    ],
    excludes: ['飯店下榻', '簽證護照'],
  },
  {
    templateKey: 'flight-insurance',
    includes: ['旅遊計劃書與簽證護照提醒', '簽證護照', '申請簽證代辦'],
    excludes: ['加購優惠於2026/04/10 13:49 截止！', '航班異動可免費取消住宿'],
  },
] satisfies Array<{
  templateKey: BuiltEmailTemplateKey
  includes: string[]
  excludes?: string[]
}>

describe('email preview 寄送契約', () => {
  it('會定義 dist 與 React Email 來源的 template metadata', () => {
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
    expect(previewEmailTemplates['hotel-sales']).toMatchObject({
      distFileName: 'cross-sell-email/hotel/sales.html',
      usesCrossSellEmailDomainMode: true,
    })
    expect(previewEmailTemplates['flight-insurance']).toMatchObject({
      defaultSubject: '旅遊計劃書與簽證護照提醒',
      distFileName: 'cross-sell-email/flight/insurance.html',
      usesCrossSellEmailDomainMode: true,
    })
  })

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

  it('會讓 built templates 的 React source preview 對應到正確內容', async () => {
    expect(
      previewReactEmailExpectations.map(({ templateKey }) => templateKey),
    ).toEqual(emailBuildOutputs.map(({ templateKey }) => templateKey))

    for (const expectation of previewReactEmailExpectations) {
      const payload = await createPreviewEmailPayload({
        domainMode: 'production',
        from: 'sender@example.com',
        source: 'react',
        subject: 'Preview',
        template: expectation.templateKey,
        to: 'recipient@example.com',
      })

      if (!('react' in payload)) {
        throw new Error(
          `Expected "${expectation.templateKey}" to create a React Email payload.`,
        )
      }

      const html = await renderEmail(payload.react)

      expectation.includes.forEach((text) => {
        expect(html).toContain(text)
      })
      expectation.excludes?.forEach((text) => {
        expect(html).not.toContain(text)
      })
    }
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
