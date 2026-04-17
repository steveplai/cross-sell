import {
  TravelPlanCrossSellEmail,
  type TravelPlanCrossSellEmailProps,
  type TravelPlanCrossSellHighlight,
  type TravelPlanCrossSellSection,
} from '../travel-plan-cross-sell/TravelPlanCrossSellEmail'

export type OrderCrossSellHighlight = TravelPlanCrossSellHighlight
export type OrderCrossSellSection = TravelPlanCrossSellSection
export type OrderCrossSellEmailProps = TravelPlanCrossSellEmailProps

export function OrderCrossSellEmail(props: OrderCrossSellEmailProps) {
  return <TravelPlanCrossSellEmail {...props} />
}
