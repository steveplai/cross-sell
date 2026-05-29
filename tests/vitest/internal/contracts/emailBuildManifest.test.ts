import { describe, expect, it } from 'vitest'

import { emailBuildOutputs } from '../../../../scripts/emails/build-core'
import { previewEmailTemplates } from '../../../../scripts/emails/preview-templates'

describe('email build manifest 契約', () => {
  it('built outputs 會符合 preview template dist filenames', () => {
    emailBuildOutputs.forEach((output) => {
      expect(previewEmailTemplates).toHaveProperty(output.templateKey)
      expect(previewEmailTemplates[output.templateKey].distFileName).toBe(
        output.relativePath,
      )
    })
  })
})
