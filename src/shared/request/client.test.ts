import { afterEach, describe, expect, it, vi } from 'vitest'

import { createRequestClient } from './client'
import { RequestTimeoutError } from './errors'

type FetchMock = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

describe('createRequestClient', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('會組合 base URL、request headers 與解析後的 JSON body', async () => {
    const fetchMock = vi.fn<FetchMock>(async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    })
    const client = createRequestClient({
      baseUrl: 'https://www.liontravel.com',
      fetchImpl: fetchMock as unknown as typeof fetch,
      headers: {
        'x-widget-name': 'cross-sell-widget',
      },
    })

    await expect(
      client.get('/api/flight-orders/abc/cross-sell', {
        headers: {
          'x-request-id': 'request-1',
        },
      }),
    ).resolves.toEqual({ ok: true })

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.liontravel.com/api/flight-orders/abc/cross-sell',
      expect.objectContaining({
        method: 'GET',
      }),
    )

    const init = fetchMock.mock.calls[0][1]
    const headers = new Headers(init?.headers)

    expect(headers.get('accept')).toBe('application/json')
    expect(headers.get('x-widget-name')).toBe('cross-sell-widget')
    expect(headers.get('x-request-id')).toBe('request-1')
  })

  it('會接受只有 host 的 base URLs 並預設使用 https', async () => {
    const fetchMock = vi.fn<FetchMock>(async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    })
    const client = createRequestClient({
      baseUrl: 'www.liontravel.com',
      fetchImpl: fetchMock as unknown as typeof fetch,
    })

    await client.get('/api/flight-orders/abc/cross-sell')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://www.liontravel.com/api/flight-orders/abc/cross-sell',
      expect.any(Object),
    )
  })

  it('會將非 2xx responses 正規化為 ApiError', async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(JSON.stringify({ message: 'bad request' }), {
        status: 400,
        statusText: 'Bad Request',
      })
    }) as unknown as typeof fetch
    const client = createRequestClient({
      baseUrl: 'https://www.liontravel.com',
      fetchImpl,
    })

    await expect(client.get('/api/bad')).rejects.toMatchObject({
      body: { message: 'bad request' },
      status: 400,
      statusText: 'Bad Request',
      url: 'https://www.liontravel.com/api/bad',
    })
  })

  it('會在設定的 timeout 後中止 requests', async () => {
    vi.useFakeTimers()

    const fetchImpl = vi.fn((_url, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'))
        })
      })
    }) as unknown as typeof fetch
    const client = createRequestClient({
      baseUrl: 'https://www.liontravel.com',
      fetchImpl,
      timeoutMs: 10,
    })
    const request = client.get('/api/slow')
    const timeoutExpectation =
      expect(request).rejects.toBeInstanceOf(RequestTimeoutError)
    const detailExpectation = expect(request).rejects.toMatchObject({
      timeoutMs: 10,
      url: 'https://www.liontravel.com/api/slow',
    })

    await vi.advanceTimersByTimeAsync(10)
    await timeoutExpectation
    await detailExpectation
  })

  it('會保留 caller aborts，不會將其正規化為 timeout', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    const fetchImpl = vi.fn((_url, init) => {
      return new Promise<Response>((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => {
          reject(abortError)
        })
      })
    }) as unknown as typeof fetch
    const client = createRequestClient({
      baseUrl: 'https://www.liontravel.com',
      fetchImpl,
    })
    const controller = new AbortController()
    const request = client.get('/api/cancelled', {
      signal: controller.signal,
    })
    const abortExpectation = expect(request).rejects.toMatchObject({
      name: abortError.name,
    })

    controller.abort()

    await abortExpectation
  })

  it('caller signal 已經 aborted 時不會呼叫 fetch', async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
    }) as unknown as typeof fetch
    const client = createRequestClient({
      baseUrl: 'https://www.liontravel.com',
      fetchImpl,
    })
    const controller = new AbortController()

    controller.abort()

    await expect(
      client.get('/api/cancelled', {
        signal: controller.signal,
      }),
    ).rejects.toMatchObject({
      name: 'AbortError',
    })
    expect(fetchImpl).not.toHaveBeenCalled()
  })
})
