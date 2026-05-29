import { describe, expect, it } from 'vitest'

import { emailBuildOutputs } from '../../../../scripts/build-emails-core'
import { previewEmailTemplates } from '../../../../scripts/send-email-preview-core'

const builtEmailOutputPaths = [
  'demo-product-offer/index.html',
  'cross-sell-email/flight/established.html',
  'cross-sell-email/hotel/established.html',
  'cross-sell-email/flight/sales.html',
  'cross-sell-email/hotel/sales.html',
  'cross-sell-email/flight/insurance.html',
]

describe('email build manifest', () => {
  it('declares the current dist email output paths', () => {
    expect(emailBuildOutputs.map((output) => output.relativePath)).toEqual(
      builtEmailOutputPaths,
    )
  })

  it('matches preview template dist filenames for built outputs', () => {
    emailBuildOutputs.forEach((output) => {
      expect(previewEmailTemplates).toHaveProperty(output.templateKey)
      expect(previewEmailTemplates[output.templateKey].distFileName).toBe(
        output.relativePath,
      )
    })
  })
})
