import { act } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import {
  createMountApi,
  type MountedWidget,
} from '../../../../src/runtime/createMountApi'

interface TestWidgetProps {
  label: string
}

function TestWidget({ label }: TestWidgetProps) {
  return <span data-testid="mounted-widget">{label}</span>
}

describe('createMountApi runtime 契約', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('會用 selector target 掛載 widget 並注入 document styles', async () => {
    document.body.innerHTML = '<div id="widget-target"></div>'
    const mount = createMountApi(TestWidget, 'mount-api-selector-test', '.x{}')

    await act(async () => {
      mount('#widget-target', { label: '初始內容' })
    })

    expect(document.querySelector('#widget-target')).toHaveTextContent(
      '初始內容',
    )
    expect(
      document.head.querySelectorAll(
        'style[data-cross-sell-style="mount-api-selector-test"]',
      ),
    ).toHaveLength(1)
  })

  it('會用 Element target 掛載、更新並卸載 widget', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const mount = createMountApi(TestWidget, 'mount-api-element-test', '.x{}')
    let mounted: MountedWidget<TestWidgetProps> | undefined

    await act(async () => {
      mounted = mount(target, { label: '第一版' })
    })

    expect(target).toHaveTextContent('第一版')

    if (!mounted) {
      throw new Error('預期 mount API 會回傳 mounted widget 控制物件。')
    }

    const mountedWidget = mounted

    await act(async () => {
      mountedWidget.update({ label: '第二版' })
    })

    expect(target).toHaveTextContent('第二版')

    await act(async () => {
      mountedWidget.unmount()
    })

    expect(target).toBeEmptyDOMElement()
  })

  it('同一個 target 重複 mount 時會更新既有 React root', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const mount = createMountApi(TestWidget, 'mount-api-reuse-test', '.x{}')
    let firstMount: MountedWidget<TestWidgetProps> | undefined
    let secondMount: MountedWidget<TestWidgetProps> | undefined

    await act(async () => {
      firstMount = mount(target, { label: '第一次掛載' })
    })
    await act(async () => {
      secondMount = mount(target, { label: '第二次掛載' })
    })

    expect(target).toHaveTextContent('第二次掛載')
    expect(
      document.head.querySelectorAll(
        'style[data-cross-sell-style="mount-api-reuse-test"]',
      ),
    ).toHaveLength(1)

    if (!firstMount || !secondMount) {
      throw new Error('預期重複 mount 會回傳 mounted widget 控制物件。')
    }

    const secondMountedWidget = secondMount

    await act(async () => {
      secondMountedWidget.unmount()
    })
  })

  it('找不到 selector target 時會拋出錯誤', () => {
    const mount = createMountApi(TestWidget, 'mount-api-missing-test', '.x{}')

    expect(() => mount('#missing-target', { label: '不會掛載' })).toThrow(
      'Mount target not found: #missing-target',
    )
  })
})
