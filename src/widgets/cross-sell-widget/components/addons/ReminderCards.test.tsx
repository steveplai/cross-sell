import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { CrossSellWidgetReminder } from '../../types'
import { ReminderCards } from './ReminderCards'

const reminderItems = [
  {
    id: 'external-addon',
    title: '外部加購',
    description: '前往外部服務完成加購。',
    href: 'https://example.com/addons',
    icon: 'gift',
  },
  {
    id: 'internal-addon',
    title: '站內提醒',
    description: '保留在目前站內流程。',
    href: '/addons/passport',
    icon: 'passport',
  },
  {
    id: 'insurance-addon',
    title: '保險提醒',
    description: '透過信件洽詢保險加購。',
    href: 'mailto:service@example.com',
    icon: 'insurance',
  },
  {
    id: 'button-addon',
    title: '沒有連結',
    description: '點擊後交給宿主頁處理。',
    icon: 'wifi',
  },
] satisfies CrossSellWidgetReminder[]

describe('ReminderCards', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('items 為空時不會渲染提醒區塊', () => {
    const { container } = render(<ReminderCards items={[]} title="行前提醒" />)

    expect(container).toBeEmptyDOMElement()
  })

  it('會渲染標題、可選 subtitle 與提醒卡片', () => {
    render(
      <ReminderCards
        items={reminderItems}
        subtitle="出發前先完成這些項目。"
        title="行前提醒"
      />,
    )

    expect(
      screen.getByRole('heading', { name: '行前提醒' }),
    ).toBeInTheDocument()
    expect(screen.getByText('出發前先完成這些項目。')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /外部加購/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /站內提醒/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /保險提醒/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /沒有連結/ })).toBeInTheDocument()
  })

  it('沒有 subtitle 時只渲染標題與卡片', () => {
    render(<ReminderCards items={reminderItems.slice(0, 1)} title="行前提醒" />)

    expect(
      screen.getByRole('heading', { name: '行前提醒' }),
    ).toBeInTheDocument()
    expect(screen.queryByText('出發前先完成這些項目。')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /外部加購/ })).toBeInTheDocument()
  })

  it('外部連結會以新分頁開啟，站內連結會留在目前瀏覽情境', () => {
    render(<ReminderCards items={reminderItems} title="行前提醒" />)

    const externalLink = screen.getByRole('link', { name: /外部加購/ })
    const internalLink = screen.getByRole('link', { name: /站內提醒/ })
    const mailLink = screen.getByRole('link', { name: /保險提醒/ })

    expect(externalLink).toHaveAttribute('href', 'https://example.com/addons')
    expect(externalLink).toHaveAttribute('target', '_blank')
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(internalLink).toHaveAttribute('href', '/addons/passport')
    expect(internalLink).not.toHaveAttribute('target')
    expect(internalLink).not.toHaveAttribute('rel')
    expect(mailLink).toHaveAttribute('href', 'mailto:service@example.com')
    expect(mailLink).not.toHaveAttribute('target')
    expect(mailLink).not.toHaveAttribute('rel')
  })

  it('點擊 link 或 button 時會回報 addon id', async () => {
    const user = userEvent.setup()
    const onSelectAddon = vi.fn()

    render(
      <ReminderCards
        items={reminderItems}
        onSelectAddon={onSelectAddon}
        title="行前提醒"
      />,
    )

    fireEvent.click(screen.getByRole('link', { name: /外部加購/ }))
    await user.click(screen.getByRole('button', { name: /沒有連結/ }))

    expect(onSelectAddon).toHaveBeenNthCalledWith(1, 'external-addon')
    expect(onSelectAddon).toHaveBeenNthCalledWith(2, 'button-addon')
  })
})
