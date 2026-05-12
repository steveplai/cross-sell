import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { RequestClient } from '@/shared/request'

import { FlightOrderCrossSellConnected } from './FlightOrderCrossSellConnected'
import { flightOrderCrossSellSampleData } from './sampleData'
import type { FlightOrderCrossSellData } from './types'

type MockRequestClientRequest = (
  pathname: string,
  init?: RequestInit,
) => Promise<unknown>

function cloneSampleData(overrides: Partial<FlightOrderCrossSellData> = {}) {
  const sampleData = JSON.parse(
    JSON.stringify(flightOrderCrossSellSampleData),
  ) as FlightOrderCrossSellData

  return {
    ...sampleData,
    ...overrides,
  }
}

function createMockRequestClient(get: MockRequestClientRequest): RequestClient {
  return {
    get: <T,>(pathname: string, init?: RequestInit) =>
      get(pathname, init) as Promise<T>,
    request: <T,>(pathname: string, init?: RequestInit) =>
      get(pathname, init) as Promise<T>,
  }
}

describe('FlightOrderCrossSellConnected', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('renders provided data without calling the API', () => {
    const get = vi.fn<MockRequestClientRequest>()
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnected
        data={cloneSampleData()}
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    expect(
      screen.getByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(get).not.toHaveBeenCalled()
  })

  it('loads API data by order number and unwraps the response data', async () => {
    const get = vi.fn<MockRequestClientRequest>().mockResolvedValue({
      data: cloneSampleData(),
    })
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnected
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByRole('heading', { name: '探索東京飯店' }),
    ).toBeInTheDocument()
    expect(get).toHaveBeenCalledWith(
      '/api/flight-orders/202605120001/cross-sell',
      {
        signal: expect.any(AbortSignal),
      },
    )
  })

  it('hides the widget when API loading fails in hidden error mode', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('failed'))
    const requestClient = createMockRequestClient(get)

    const { container } = render(
      <FlightOrderCrossSellConnected
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    await waitFor(() => {
      expect(get).toHaveBeenCalled()
    })
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement()
    })
  })

  it('shows an error message when API loading fails in message error mode', async () => {
    const get = vi
      .fn<MockRequestClientRequest>()
      .mockRejectedValue(new Error('failed'))
    const requestClient = createMockRequestClient(get)

    render(
      <FlightOrderCrossSellConnected
        errorMode="message"
        orderNumber="202605120001"
        requestClient={requestClient}
      />,
    )

    expect(
      await screen.findByText('目前無法載入推薦內容，請稍後再試。'),
    ).toBeInTheDocument()
  })
})
