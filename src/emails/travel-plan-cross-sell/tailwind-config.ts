import { pixelBasedPreset } from '@react-email/components'

function createEmailPixelSpacingScale(max = 200) {
  const spacing: Record<string, string> = { px: '1px' }

  for (let quarterStep = 0; quarterStep <= max * 4; quarterStep += 1) {
    const spacingValue = quarterStep / 4
    const key = `${spacingValue}`

    spacing[key] = `${quarterStep}px`
  }

  return spacing
}

export const travelPlanCrossSellTailwindConfig = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      spacing: createEmailPixelSpacingScale(),
      colors: {
        ink: '#222222',
        muted: '#666666',
        nature: '#f7f7f7',
        orange: '#ff5b1a',
        'brand-red': '#f03742',
        'brand-red-soft': 'rgba(240, 55, 66, 0.1)',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'Arial', 'sans-serif'],
      },
    },
  },
}
