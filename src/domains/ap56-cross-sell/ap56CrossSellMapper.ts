import type { LiontravelDomainMode } from '@/shared/utils/liontravelUrl'
import type { CrossSellWidgetSection } from '@/widgets/cross-sell-widget'

import { mapAp56SectionsToWidgetSections } from './ap56CrossSellSectionMapper'
import type {
  Ap56CrossSellResponseEnvelope,
  Ap56CrossSellResponseSection,
} from './ap56CrossSellTypes'

interface MapAp56CrossSellResponseOptions {
  domainMode?: LiontravelDomainMode
}

// Convert AP-56 sections into the widget section model consumed by the
// connected widget. Non-carousel static content is supplied by the base widget.
export function mapAp56CrossSellResponseToSections(
  response:
    | Ap56CrossSellResponseEnvelope
    | Ap56CrossSellResponseSection[]
    | unknown,
  { domainMode = 'production' }: MapAp56CrossSellResponseOptions = {},
): CrossSellWidgetSection[] {
  const sections = getResponseSections(response)

  if (!sections) {
    return []
  }

  return mapAp56SectionsToWidgetSections(sections, { domainMode })
}

// #region - Functions

function getResponseSections(response: unknown) {
  if (Array.isArray(response)) {
    return response as Ap56CrossSellResponseSection[]
  }

  if (!response || typeof response !== 'object') {
    return undefined
  }

  const productDataList = (response as Ap56CrossSellResponseEnvelope)
    .ProductDataList

  return Array.isArray(productDataList)
    ? (productDataList as Ap56CrossSellResponseSection[])
    : undefined
}

// #endregion - Functions
