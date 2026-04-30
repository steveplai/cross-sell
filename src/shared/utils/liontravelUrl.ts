export type LiontravelDomainMode = 'uat' | 'production'

interface CreateLiontravelUrlOptions {
  domainMode: LiontravelDomainMode
  productionHostname: string
  pathname: string
  query?: Record<string, string | number | undefined>
}

export function createLiontravelOrigin(
  productionHostname: string,
  domainMode: LiontravelDomainMode,
) {
  const hostname =
    domainMode === 'uat' ? `u${productionHostname}` : productionHostname

  return `https://${hostname}`
}

export function isLiontravelDomainMode(
  value: unknown,
): value is LiontravelDomainMode {
  return value === 'uat' || value === 'production'
}

export function createLiontravelUrl({
  domainMode,
  pathname,
  productionHostname,
  query,
}: CreateLiontravelUrlOptions) {
  const url = new URL(
    pathname,
    createLiontravelOrigin(productionHostname, domainMode),
  )

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value))
      }
    })
  }

  return url.toString()
}
