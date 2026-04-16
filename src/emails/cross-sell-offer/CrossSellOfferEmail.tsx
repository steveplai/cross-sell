import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

import type { Product } from '../../shared/types/product'
import { formatCurrency } from '../../shared/utils/formatCurrency'

interface CrossSellOfferEmailProps {
  title: string
  products: Product[]
  ctaUrl: string
}

export function CrossSellOfferEmail({
  title,
  products,
  ctaUrl,
}: CrossSellOfferEmailProps) {
  return (
    <Html lang="zh-TW">
      <Head />
      <Preview>{title}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>{title}</Heading>
          <Text style={copy}>為你整理了幾項可以一起參考的商品。</Text>
          <Section>
            {products.map((product) => (
              <Section key={product.id} style={productCard}>
                <Text style={productName}>{product.name}</Text>
                <Text style={price}>{formatCurrency(product.price)}</Text>
              </Section>
            ))}
          </Section>
          <Button href={ctaUrl} style={button}>
            查看推薦
          </Button>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: '#f4f4f5',
  color: '#18181b',
  fontFamily: 'Arial, sans-serif',
  margin: 0,
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '24px',
  width: '100%',
  maxWidth: '560px',
}

const heading = {
  fontSize: '22px',
  lineHeight: '30px',
  margin: '0 0 12px',
}

const copy = {
  color: '#52525b',
  fontSize: '15px',
  lineHeight: '24px',
}

const productCard = {
  border: '1px solid #e4e4e7',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
}

const productName = {
  fontSize: '15px',
  fontWeight: '700',
  margin: '0 0 4px',
}

const price = {
  color: '#047857',
  fontSize: '14px',
  margin: 0,
}

const button = {
  backgroundColor: '#047857',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'block',
  fontSize: '15px',
  fontWeight: '700',
  marginTop: '20px',
  padding: '12px 18px',
  textAlign: 'center' as const,
  textDecoration: 'none',
}
