export type LiontravelDomainMode = 'uat' | 'production'

const inferableLiontravelProductionHostnames = ['flight.liontravel.com']

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

export function resolveLiontravelDomainMode(
  explicitMode?: unknown,
  hostname?: string,
): LiontravelDomainMode | undefined {
  if (isLiontravelDomainMode(explicitMode)) {
    return explicitMode
  }

  const normalizedHostname = hostname?.toLowerCase()

  if (!normalizedHostname) {
    return undefined
  }

  if (inferableLiontravelProductionHostnames.includes(normalizedHostname)) {
    return 'production'
  }

  const uatHostnames = inferableLiontravelProductionHostnames.map(
    (productionHostname) => `u${productionHostname}`,
  )

  if (uatHostnames.includes(normalizedHostname)) {
    return 'uat'
  }

  return undefined
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
