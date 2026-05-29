import { act, waitFor } from '@testing-library/react'
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

describe('createReactWebComponent 的 observed properties 契約', () => {
  afterEach(async () => {
    await act(async () => {
      document.body.innerHTML = ''
    })
  })

  it('設定 observed property 時會重新渲染', async () => {
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
    await act(async () => {
      document.body.appendChild(element)
    })

    await waitFor(() => {
      expect(getShadowText(element)).toContain('fallback title')
    })
    await act(async () => {
      ;(element as HTMLElement & ConfigurableTestWidgetProps).config = {
        title: 'property title',
      }
    })

    await waitFor(() => {
      expect(getShadowText(element)).toContain('property title')
    })
  })

  it('會保留 custom element upgrade 前已設定的 observed property', async () => {
    const element = document.createElement('csc-property-upgrade-test')

    ;(element as HTMLElement & ConfigurableTestWidgetProps).config = {
      title: 'pre-upgrade title',
    }

    await act(async () => {
      document.body.appendChild(element)
    })

    await act(async () => {
      createReactWebComponent<ConfigurableTestWidgetProps>({
        tagName: 'csc-property-upgrade-test',
        Component: ConfigurableTestWidget,
        observedAttributes: [],
        observedProperties: ['config'],
        styles: '',
        mapElementToProps: (candidate) => ({
          config: (candidate as HTMLElement & ConfigurableTestWidgetProps)
            .config,
        }),
      })
    })

    await waitFor(() => {
      expect(getShadowText(element)).toContain('pre-upgrade title')
    })
  })
})
