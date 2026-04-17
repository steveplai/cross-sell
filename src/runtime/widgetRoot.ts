export const widgetRootAttribute = 'data-csc-widget'
export const widgetRootNameAttribute = 'data-csc-widget-name'
export const widgetRootSelector = `[${widgetRootAttribute}]`
export const widgetRootProps = { [widgetRootAttribute]: '' } as const

export type WidgetRootProps = ReturnType<typeof createWidgetRootProps>

export function createWidgetRootProps(widgetName: string) {
  return {
    [widgetRootAttribute]: '',
    [widgetRootNameAttribute]: widgetName,
  } as const
}
