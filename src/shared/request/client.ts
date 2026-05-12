import { ApiError, RequestTimeoutError } from './errors'

export interface RequestClientOptions {
  baseUrl: string
  fetchImpl?: typeof fetch
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>)
  timeoutMs?: number
}

export interface RequestClient {
  get<T>(pathname: string, init?: RequestInit): Promise<T>
  request<T>(pathname: string, init?: RequestInit): Promise<T>
}

const defaultTimeoutMs = 8000

export function createRequestClient({
  baseUrl,
  fetchImpl = fetch,
  headers,
  timeoutMs = defaultTimeoutMs,
}: RequestClientOptions): RequestClient {
  async function request<T>(pathname: string, init: RequestInit = {}) {
    const url = createRequestUrl(baseUrl, pathname)
    const controller = new AbortController()
    let didTimeout = false
    const timeoutId = globalThis.setTimeout(() => {
      didTimeout = true
      controller.abort()
    }, timeoutMs)
    const abortListener = () => controller.abort()

    init.signal?.addEventListener('abort', abortListener)

    try {
      if (init.signal?.aborted) {
        throw createAbortError()
      }

      const requestHeaders = await createHeaders(headers, init.headers)

      if (controller.signal.aborted) {
        throw createAbortError()
      }

      const res = await fetchImpl(url, {
        ...init,
        headers: requestHeaders,
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new ApiError({
          body: await parseResponseBody(res),
          status: res.status,
          statusText: res.statusText,
          url,
        })
      }

      return (await parseResponseBody(res)) as T
    } catch (error) {
      if (
        didTimeout &&
        error instanceof DOMException &&
        error.name === 'AbortError'
      ) {
        throw new RequestTimeoutError(url, timeoutMs)
      }

      throw error
    } finally {
      globalThis.clearTimeout(timeoutId)
      init.signal?.removeEventListener('abort', abortListener)
    }
  }

  return {
    get<T>(pathname: string, init?: RequestInit) {
      return request<T>(pathname, { ...init, method: 'GET' })
    },
    request,
  }
}

function createAbortError() {
  return new DOMException('Aborted', 'AbortError')
}

function createRequestUrl(baseUrl: string, pathname: string) {
  return new URL(pathname, normalizeBaseUrl(baseUrl)).toString()
}

function normalizeBaseUrl(baseUrl: string) {
  const absoluteBaseUrl = /^https?:\/\//i.test(baseUrl)
    ? baseUrl
    : `https://${baseUrl}`

  return absoluteBaseUrl.endsWith('/') ? absoluteBaseUrl : `${absoluteBaseUrl}/`
}

async function createHeaders(
  defaultHeaders:
    | HeadersInit
    | (() => HeadersInit | Promise<HeadersInit>)
    | undefined,
  initHeaders: HeadersInit | undefined,
) {
  const headers = new Headers({ Accept: 'application/json' })
  const resolvedDefaultHeaders =
    typeof defaultHeaders === 'function'
      ? await defaultHeaders()
      : defaultHeaders

  mergeHeaders(headers, resolvedDefaultHeaders)
  mergeHeaders(headers, initHeaders)

  return headers
}

function mergeHeaders(target: Headers, source: HeadersInit | undefined) {
  if (!source) {
    return
  }

  new Headers(source).forEach((value, key) => {
    target.set(key, value)
  })
}

async function parseResponseBody(res: Response) {
  if (res.status === 204) {
    return undefined
  }

  const text = await res.text()

  if (!text) {
    return undefined
  }

  try {
    return JSON.parse(text) as unknown
  } catch {
    return text
  }
}
