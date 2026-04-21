import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'

import type { Product } from '../../shared/types/product'
import { formatCurrency } from '../../shared/utils/formatCurrency'

interface DemoProductOfferEmailProps {
  title: string
  products: Product[]
  ctaUrl: string
}

export function DemoProductOfferEmail({
  title,
  products,
  ctaUrl,
}: DemoProductOfferEmailProps) {
  return (
    <Html lang="zh-TW">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: '#047857',
                ink: '#18181b',
                line: '#e4e4e7',
                muted: '#52525b',
                page: '#f4f4f5',
              },
              fontFamily: {
                sans: ['Arial', 'sans-serif'],
              },
            },
          },
        }}
      >
        <Head />
        <Preview>{title}</Preview>
        <Body className="bg-page text-ink m-0 font-sans">
          <Container className="mx-auto w-full max-w-140 bg-white p-6">
            <Heading className="m-0 mb-3 text-[22px] leading-7.5">
              {title}
            </Heading>
            <Text className="m-0 mb-4 text-[15px] leading-6 text-muted">
              為你整理了幾項可以一起參考的商品。
            </Text>
            <Section>
              {products.map((product) => (
                <Section
                  className="border-line mb-3 rounded-lg border p-3"
                  key={product.id}
                >
                  <Text className="m-0 mb-1 text-[15px] font-bold">
                    {product.name}
                  </Text>
                  <Text className="text-brand m-0 text-sm">
                    {formatCurrency(product.price)}
                  </Text>
                </Section>
              ))}
            </Section>
            <Button
              className="bg-brand mt-5 block rounded-lg px-4.5 py-3 text-center text-[15px] font-bold text-white no-underline"
              href={ctaUrl}
            >
              查看推薦
            </Button>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
