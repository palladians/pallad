import { createStitches } from 'stitches-native'
import type * as Stitches from 'stitches-native'

export const { styled, ThemeProvider, theme, createTheme, useTheme, css, config } = createStitches({
  theme: {
    colors: {
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(222, 47.4%, 11.2%)',
      muted: 'hsl(210, 40%, 96.1%)',
      mutedForeground: 'hsl(215, 16.3%, 46.9%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(222, 47.4%, 11.2%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(222, 47.4%, 11.2%)',
      border: 'hsl(214, 31.8%, 91.4%)',
      input: 'hsl(214, 31.8%, 91.4%)',
      primary: 'hsl(222, 47.4%, 11.2%)',
      primaryForeground: 'hsl(210, 40%, 98%)',
      secondary: 'hsl(210, 40%, 96.1%)',
      secondaryForeground: 'hsl(222, 47.4%, 11.2%)',
      accent: 'hsl(210, 40%, 96.1%)',
      accentForeground: 'hsl(222, 47.4%, 11.2%)',
      destructive: 'hsl(0, 100%, 50%)',
      destructiveForeground: 'hsl(210, 40%, 98%)',
      ring: 'hsl(215, 20.2%, 65.1%)',
      white: '#ffffff',
      black: '#000000'
    },
    space: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px',
      '2xl': '96px'
    },
    fontSizes: {
      sm: '12px',
      md: '16px',
      lg: '20px',
      xl: '24px',
      '2xl': '32px'
    },
    fonts: {
      body: '"Inter", system-ui, sans-serif',
      heading: 'Georgia, serif',
      mono: 'Menlo, monospace'
    },
    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },
    sizes: {
      full: '100%',
      containerSm: '640px',
      containerMd: '768px',
      containerLg: '1024px',
      containerXl: '1280px'
    },
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    }
  }
})
export const darkTheme = createTheme({})
export type Theme = typeof theme
export type CSS = Stitches.CSS<typeof config>
