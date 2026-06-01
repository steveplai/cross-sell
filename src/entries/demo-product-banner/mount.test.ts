import './mount'

import { describe, expect, it } from 'vitest'

describe('demo product banner Mount API 建置資訊', () => {
  it('會在公開全域 API 物件上暴露建置資訊', () => {
    expect(window.DemoProductBanner?.version).toBe('development')
    expect(window.DemoProductBanner?.build).toEqual({
      version: 'development',
      widgetName: 'demo-product-banner',
      commit: 'unknown',
      mode: 'mount',
      builtAt: 'unknown',
    })
    expect(window.DemoProductBanner?.mount).toBeTypeOf('function')
  })
})
