declare const __CROSS_SELL_BUILD_BUILT_AT__: string | undefined
declare const __CROSS_SELL_BUILD_COMMIT__: string | undefined
declare const __CROSS_SELL_BUILD_VERSION__: string | undefined

export type WidgetBuildMode = 'mount' | 'wc'

export interface WidgetBuildMetadata {
  version: string
  widgetName: string
  commit: string
  mode: WidgetBuildMode
  builtAt: string
}

const fallbackBuildVersion = 'development'
const fallbackCommit = 'unknown'
const fallbackBuiltAt = 'unknown'

function getDefinedBuildValue(value: string | undefined, fallback: string) {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

export function createWidgetBuildMetadata(
  widgetName: string,
  mode: WidgetBuildMode,
): WidgetBuildMetadata {
  return {
    version: getDefinedBuildValue(
      typeof __CROSS_SELL_BUILD_VERSION__ === 'string'
        ? __CROSS_SELL_BUILD_VERSION__
        : undefined,
      fallbackBuildVersion,
    ),
    widgetName,
    commit: getDefinedBuildValue(
      typeof __CROSS_SELL_BUILD_COMMIT__ === 'string'
        ? __CROSS_SELL_BUILD_COMMIT__
        : undefined,
      fallbackCommit,
    ),
    mode,
    builtAt: getDefinedBuildValue(
      typeof __CROSS_SELL_BUILD_BUILT_AT__ === 'string'
        ? __CROSS_SELL_BUILD_BUILT_AT__
        : undefined,
      fallbackBuiltAt,
    ),
  }
}
