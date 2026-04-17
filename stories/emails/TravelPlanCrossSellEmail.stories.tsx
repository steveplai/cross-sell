import { render } from '@react-email/render'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'

import { insuranceCrossSellSampleData } from '../../src/emails/travel-plan-cross-sell/sample-data/insurance'
import { orderCrossSellSampleData } from '../../src/emails/travel-plan-cross-sell/sample-data/order'
import { salesCrossSellSampleData } from '../../src/emails/travel-plan-cross-sell/sample-data/sales'
import { TravelPlanCrossSellEmail } from '../../src/emails/travel-plan-cross-sell/TravelPlanCrossSellEmail'
import type { TravelPlanCrossSellEmailProps } from '../../src/emails/travel-plan-cross-sell/types'

interface EmailPreviewProps {
  data: TravelPlanCrossSellEmailProps
}

interface EmailPreviewResult {
  data: TravelPlanCrossSellEmailProps
  errorMessage?: string
  html?: string
}

function EmailPreview({ data }: EmailPreviewProps) {
  const [result, setResult] = useState<EmailPreviewResult>()

  useEffect(() => {
    let isCurrent = true

    void render(<TravelPlanCrossSellEmail {...data} />, { pretty: true })
      .then((renderedHtml) => {
        if (isCurrent) {
          setResult({ data, html: renderedHtml })
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setResult({
            data,
            errorMessage:
              error instanceof Error
                ? error.message
                : 'Failed to render email.',
          })
        }
      })

    return () => {
      isCurrent = false
    }
  }, [data])

  if (!result || result.data !== data) {
    return <div style={{ padding: 24 }}>Rendering email preview...</div>
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
    return <div style={{ padding: 24 }}>Rendering email preview...</div>
  }

  return (
    <iframe
      srcDoc={result.html}
      style={{
        backgroundColor: '#ffffff',
        border: 0,
        height: 900,
        maxWidth: '100%',
        width: 640,
      }}
      title="Travel plan cross sell email preview"
    />
  )
}

const meta = {
  title: 'Emails/Travel Plan Cross Sell/Full Email',
  component: EmailPreview,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmailPreview>

export default meta

type Story = StoryObj<typeof meta>

export const Order: Story = {
  args: {
    data: orderCrossSellSampleData,
  },
}

export const Sales: Story = {
  args: {
    data: salesCrossSellSampleData,
  },
}

export const Insurance: Story = {
  args: {
    data: insuranceCrossSellSampleData,
  },
}
