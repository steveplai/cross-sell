import { Body, Container, Head, Html, Tailwind } from '@react-email/components'
import { render } from '@react-email/render'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { type ReactNode, useEffect, useState } from 'react'

import { CrossSellSection } from '../../src/emails/travel-plan-cross-sell/components/CrossSellSection'
import { Header } from '../../src/emails/travel-plan-cross-sell/components/Header'
import { Highlights } from '../../src/emails/travel-plan-cross-sell/components/Highlights'
import { flightEstablishedCrossSellEmailContent } from '../../src/emails/travel-plan-cross-sell/content/established'
import { flightInsuranceCrossSellEmailContent } from '../../src/emails/travel-plan-cross-sell/content/insurance'
import { travelPlanCrossSellTailwindConfig } from '../../src/emails/travel-plan-cross-sell/tailwind-config'
import type { TravelPlanCrossSellSection } from '../../src/emails/travel-plan-cross-sell/types'

const previewHeight = 430
const previewWidth = 640

interface EmailCanvasResult {
  errorMessage?: string
  html?: string
}

function EmailCanvasDocument({ children }: { children: ReactNode }) {
  return (
    <Html lang="zh-TW">
      <Tailwind config={travelPlanCrossSellTailwindConfig}>
        <Head />
        <Body className="m-0 bg-white p-0">
          <Container className="text-ink mx-auto w-150 max-w-150 rounded-[5px] bg-white p-5 font-sans">
            {children}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

function EmailCanvas({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<EmailCanvasResult>()

  useEffect(() => {
    let isCurrent = true

    void render(<EmailCanvasDocument>{children}</EmailCanvasDocument>, {
      pretty: true,
    })
      .then((renderedHtml) => {
        if (isCurrent) {
          setResult({ html: renderedHtml })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setResult({
            errorMessage:
              error instanceof Error
                ? error.message
                : 'Failed to render email component preview.',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [children])

  if (!result) {
    return (
      <div style={{ padding: 24 }}>Rendering email component preview...</div>
    )
  }

  if (result.errorMessage) {
    return (
      <pre
        style={{
          color: '#b91c1c',
          whiteSpace: 'pre-wrap',
        }}
      >
        {result.errorMessage}
      </pre>
    )
  }

  if (!result.html) {
    return (
      <div style={{ padding: 24 }}>Rendering email component preview...</div>
    )
  }

  return (
    <iframe
      srcDoc={result.html}
      style={{
        backgroundColor: '#ffffff',
        border: 0,
        height: previewHeight,
        maxWidth: '100%',
        width: previewWidth,
      }}
      title="Travel plan cross sell component preview"
    />
  )
}

function getSection(id: string): TravelPlanCrossSellSection {
  const section = [
    ...flightEstablishedCrossSellEmailContent.sections,
    ...flightInsuranceCrossSellEmailContent.sections,
  ].find((item) => item.id === id)

  if (!section) {
    throw new Error(`Missing email sample section: ${id}`)
  }

  return section
}

const meta = {
  title: 'Emails/Cross Sell/Components',
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
        deadlineText={flightEstablishedCrossSellEmailContent.deadlineText}
        title={flightEstablishedCrossSellEmailContent.title}
      />
    </EmailCanvas>
  ),
}

export const HeaderWithoutDeadline: Story = {
  render: () => (
    <EmailCanvas>
      <Header title={flightInsuranceCrossSellEmailContent.title} />
    </EmailCanvas>
  ),
}

export const HighlightsRow: Story = {
  render: () => (
    <EmailCanvas>
      <Highlights
        highlights={flightEstablishedCrossSellEmailContent.highlights ?? []}
      />
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
