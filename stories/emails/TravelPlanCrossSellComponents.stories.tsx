import { Tailwind } from '@react-email/components'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode,Suspense } from 'react'

import { CrossSellSection } from '../../src/emails/travel-plan-cross-sell/components/CrossSellSection'
import { Header } from '../../src/emails/travel-plan-cross-sell/components/Header'
import { Highlights } from '../../src/emails/travel-plan-cross-sell/components/Highlights'
import { insuranceCrossSellSampleData } from '../../src/emails/travel-plan-cross-sell/sample-data/insurance'
import { orderCrossSellSampleData } from '../../src/emails/travel-plan-cross-sell/sample-data/order'
import { travelPlanCrossSellTailwindConfig } from '../../src/emails/travel-plan-cross-sell/tailwind-config'
import type { TravelPlanCrossSellSection } from '../../src/emails/travel-plan-cross-sell/types'

const previewWidth = 600

function EmailCanvas({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Preparing preview...</div>}>
      <Tailwind config={travelPlanCrossSellTailwindConfig}>
        <div
          style={{
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
            fontFamily: '"Noto Sans TC", Arial, sans-serif',
            padding: 20,
            width: previewWidth,
          }}
        >
          {children}
        </div>
      </Tailwind>
    </Suspense>
  )
}

function getSection(id: string): TravelPlanCrossSellSection {
  const section = [
    ...orderCrossSellSampleData.sections,
    ...insuranceCrossSellSampleData.sections,
  ].find((item) => item.id === id)

  if (!section) {
    throw new Error(`Missing email sample section: ${id}`)
  }

  return section
}

const meta = {
  title: 'Emails/Travel Plan Cross Sell/Components',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const HeaderWithDeadline: Story = {
  render: () => (
    <EmailCanvas>
      <Header
        deadlineText={orderCrossSellSampleData.deadlineText}
        title={orderCrossSellSampleData.title}
      />
    </EmailCanvas>
  ),
}

export const HeaderWithoutDeadline: Story = {
  render: () => (
    <EmailCanvas>
      <Header title={insuranceCrossSellSampleData.title} />
    </EmailCanvas>
  ),
}

export const HighlightsRow: Story = {
  render: () => (
    <EmailCanvas>
      <Highlights highlights={orderCrossSellSampleData.highlights ?? []} />
    </EmailCanvas>
  ),
}

export const FeaturedSection: Story = {
  render: () => (
    <EmailCanvas>
      <CrossSellSection section={getSection('transportation')} />
    </EmailCanvas>
  ),
}

export const CompactSection: Story = {
  render: () => (
    <EmailCanvas>
      <CrossSellSection section={getSection('hotel')} />
    </EmailCanvas>
  ),
}

export const EmphasisSection: Story = {
  render: () => (
    <EmailCanvas>
      <CrossSellSection section={getSection('visa-passport')} />
    </EmailCanvas>
  ),
}
