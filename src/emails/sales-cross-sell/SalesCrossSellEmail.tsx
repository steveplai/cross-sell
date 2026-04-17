import {
  TravelPlanCrossSellEmail,
  type TravelPlanCrossSellEmailProps,
  type TravelPlanCrossSellHighlight,
  type TravelPlanCrossSellSection,
} from '../travel-plan-cross-sell/TravelPlanCrossSellEmail'

export type SalesCrossSellHighlight = TravelPlanCrossSellHighlight
export type SalesCrossSellSection = TravelPlanCrossSellSection
export type SalesCrossSellEmailProps = TravelPlanCrossSellEmailProps

export function SalesCrossSellEmail(props: SalesCrossSellEmailProps) {
  return <TravelPlanCrossSellEmail {...props} />
}
