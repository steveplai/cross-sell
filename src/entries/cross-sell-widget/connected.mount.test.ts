import './connected.mount'

import { describe, expect, it } from 'vitest'

describe('connected widget Mount API 建置資訊', () => {
  it('會在公開全域 API 物件上暴露建置資訊', () => {
    expect(window.CrossSellWidgetConnected?.version).toBe('development')
    expect(window.CrossSellWidgetConnected?.build).toEqual({
      version: 'development',
      widgetName: 'cross-sell-widget-connected',
      commit: 'unknown',
      mode: 'mount',
      builtAt: 'unknown',
    })
    expect(window.CrossSellWidgetConnected?.mount).toBeTypeOf('function')
  })
})
