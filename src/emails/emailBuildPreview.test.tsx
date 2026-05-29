import { render as renderEmail } from '@react-email/render'
import { describe, expect, it } from 'vitest'

import {
  type EmailBuildOutput,
  emailBuildOutputs,
} from '../../scripts/emails/build-core'
import { createPreviewEmailPayload } from '../../scripts/emails/preview-payload'
import {
  manualEmailTemplates,
  previewEmailTemplates,
} from '../../scripts/emails/preview-templates'

type BuiltEmailTemplateKey = EmailBuildOutput['templateKey']

const builtEmailOutputPaths = [
  'demo-product-offer/index.html',
  'cross-sell-email/flight/established.html',
  'cross-sell-email/hotel/established.html',
  'cross-sell-email/flight/sales.html',
  'cross-sell-email/hotel/sales.html',
  'cross-sell-email/flight/insurance.html',
]

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

describe('email build 與 preview app 契約', () => {
  it('會宣告目前 dist email output paths', () => {
    expect(emailBuildOutputs.map((output) => output.relativePath)).toEqual(
      builtEmailOutputPaths,
    )
  })

  it('會定義 preview sources 的 template metadata', () => {
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
    expect(manualEmailTemplates['full-flight-established']).toMatchObject({
      defaultSubject: '旅遊計劃書',
      fileName: 'full-flight-established.html',
    })
    expect(manualEmailTemplates['full-flight-sales']).toMatchObject({
      defaultSubject: '限時加購優惠',
      fileName: 'full-flight-sales.html',
    })
    expect(manualEmailTemplates['full-flight-insurance']).toMatchObject({
      defaultSubject: '簽證護照提醒',
      fileName: 'full-flight-insurance.html',
    })
  })

  it('會透過 React preview source 渲染 built templates 並包含預期內容', async () => {
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
          `預期 "${expectation.templateKey}" 會建立 React Email payload。`,
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
})
