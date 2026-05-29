import '../../../../src/entries/cross-sell-widget/mount'

import { describe, expect, it } from 'vitest'

describe('widget Mount API 建置資訊', () => {
  it('會在公開全域 API 物件上暴露建置資訊', () => {
    expect(window.CrossSellWidget?.version).toBe('development')
    expect(window.CrossSellWidget?.build).toEqual({
      version: 'development',
      widgetName: 'cross-sell-widget',
      commit: 'unknown',
      mode: 'mount',
      builtAt: 'unknown',
    })
    expect(window.CrossSellWidget?.mount).toBeTypeOf('function')
  })
})
