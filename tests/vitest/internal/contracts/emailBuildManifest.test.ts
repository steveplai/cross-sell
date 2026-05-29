import { describe, expect, it } from 'vitest'

import { emailBuildOutputs } from '../../../../scripts/emails/build-core'
import { previewEmailTemplates } from '../../../../scripts/emails/preview-templates'

describe('email build manifest', () => {
  it('matches preview template dist filenames for built outputs', () => {
    emailBuildOutputs.forEach((output) => {
      expect(previewEmailTemplates).toHaveProperty(output.templateKey)
      expect(previewEmailTemplates[output.templateKey].distFileName).toBe(
        output.relativePath,
      )
    })
  })
})
