import {
  TravelPlanCrossSellEmail,
  type TravelPlanCrossSellEmailProps,
  type TravelPlanCrossSellSection,
} from '../travel-plan-cross-sell/TravelPlanCrossSellEmail'

export type InsuranceCrossSellSection = TravelPlanCrossSellSection
export type InsuranceCrossSellEmailProps = TravelPlanCrossSellEmailProps

export function InsuranceCrossSellEmail(props: InsuranceCrossSellEmailProps) {
  return <TravelPlanCrossSellEmail {...props} />
}
