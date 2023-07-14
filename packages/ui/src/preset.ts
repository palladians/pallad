import { definePreset } from '@pandacss/dev'

const baseColors = {
  'primary.50': { value: '#d8f9ff' },
  'primary.100': { value: '#abe7ff' },
  'primary.200': { value: '#7bd5ff' },
  'primary.300': { value: '#49c4ff' },
  'primary.400': { value: '#1ab3ff' },
  'primary.500': { value: '#009ae6' },
  'primary.600': { value: '#0078b4' },
  'primary.700': { value: '#005582' },
  'primary.800': { value: '#003451' },
  'primary.900': { value: '#001221' },
  'secondary.50': { value: '#e9e4ff' },
  'secondary.100': { value: '#bdb3ff' },
  'secondary.200': { value: '#9280ff' },
  'secondary.300': { value: '#664dfe' },
  'secondary.400': { value: '#3c1cfd' },
  'secondary.500': { value: '#2403e4' },
  'secondary.600': { value: '#1a01b2' },
  'secondary.700': { value: '#120080' },
  'secondary.800': { value: '#09004f' },
  'secondary.900': { value: '#04001f' }
}

export const preset = definePreset({
  theme: {
    extend: {
      tokens: {
        colors: {
          ...baseColors
        },
        fonts: {
          body: { value: '"Hanken Grotesk Variable", system-ui, sans-serif' },
          heading: { value: 'Georgia, serif' },
          mono: { value: 'Menlo, monospace' }
        }
      }
    }
  },
  patterns: {
    extend: {
      card: {
        transform(props) {
          return {
            borderWidth: '1px',
            borderColor: 'gray.700',
            borderRadius: 8,
            ...props
          }
        }
      }
    }
  }
})
