import { waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { createReactWebComponent } from '../../../../src/runtime/createReactWebComponent'

interface ConfigurableTestWidgetProps {
  config?: {
    title?: string
  }
}

function ConfigurableTestWidget({ config }: ConfigurableTestWidgetProps) {
  return <div>{config?.title ?? 'fallback title'}</div>
}

function getShadowText(element: HTMLElement) {
  return element.shadowRoot?.textContent ?? ''
}

describe('createReactWebComponent observed properties', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('re-renders when an observed property is set', async () => {
    createReactWebComponent<ConfigurableTestWidgetProps>({
      tagName: 'csc-property-rerender-test',
      Component: ConfigurableTestWidget,
      observedAttributes: [],
      observedProperties: ['config'],
      styles: '',
      mapElementToProps: (element) => ({
        config: (element as HTMLElement & ConfigurableTestWidgetProps).config,
      }),
    })

    const element = document.createElement('csc-property-rerender-test')
    document.body.appendChild(element)

    await waitFor(() => {
      expect(getShadowText(element)).toContain('fallback title')
    })
    ;(element as HTMLElement & ConfigurableTestWidgetProps).config = {
      title: 'property title',
    }

    await waitFor(() => {
      expect(getShadowText(element)).toContain('property title')
    })
  })

  it('captures an observed property set before custom element upgrade', async () => {
    const element = document.createElement('csc-property-upgrade-test')

    ;(element as HTMLElement & ConfigurableTestWidgetProps).config = {
      title: 'pre-upgrade title',
    }

    document.body.appendChild(element)

    createReactWebComponent<ConfigurableTestWidgetProps>({
      tagName: 'csc-property-upgrade-test',
      Component: ConfigurableTestWidget,
      observedAttributes: [],
      observedProperties: ['config'],
      styles: '',
      mapElementToProps: (candidate) => ({
        config: (candidate as HTMLElement & ConfigurableTestWidgetProps).config,
      }),
    })

    await waitFor(() => {
      expect(getShadowText(element)).toContain('pre-upgrade title')
    })
  })
})
