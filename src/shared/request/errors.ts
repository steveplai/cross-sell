export interface ApiErrorOptions {
  body?: unknown
  status: number
  statusText: string
  url: string
}

export class ApiError extends Error {
  body?: unknown
  status: number
  statusText: string
  url: string

  constructor({ body, status, statusText, url }: ApiErrorOptions) {
    super(`Request failed with status ${status}`)
    this.name = 'ApiError'
    this.body = body
    this.status = status
    this.statusText = statusText
    this.url = url
  }
}

export class RequestTimeoutError extends Error {
  timeoutMs: number
  url: string

  constructor(url: string, timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`)
    this.name = 'RequestTimeoutError'
    this.timeoutMs = timeoutMs
    this.url = url
  }
}
