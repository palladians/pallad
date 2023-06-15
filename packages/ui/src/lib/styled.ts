import {} from 'react'
import type { CSS as StitchesCSS } from 'stitches-native'
import { createStitches } from 'stitches-native'

const baseColors = {
  white: '#ffffff',
  black: '#1a1a1a',
  primary50: '#d7fdff',
  primary100: '#aaf2ff',
  primary200: '#7ae9ff',
  primary300: '#48dfff',
  primary400: '#1ad6ff',
  primary500: '#00bde6',
  primary600: '#0093b4',
  primary700: '#006982',
  primary800: '#004050',
  primary900: '#00171f',
  secondary50: '#e9e4ff',
  secondary100: '#bdb3ff',
  secondary200: '#9280ff',
  secondary300: '#664dfe',
  secondary400: '#3c1cfd',
  secondary500: '#2403e4',
  secondary600: '#1a01b2',
  secondary700: '#120080',
  secondary800: '#09004f',
  secondary900: '#04001f',
  gray50: '#efeff5',
  gray100: '#cfcfdd',
  gray200: '#b0b0c8',
  gray300: '#9090b4',
  gray400: '#7271a0',
  gray500: '#585786',
  gray600: '#454469',
  gray700: '#31314a',
  gray800: '#1e1d2c',
  gray900: '#0a0a10',
  red50: '#ffe1f5',
  red100: '#ffb1d9',
  red200: '#ff7ebd',
  red300: '#ff4ca3',
  red400: '#ff1a89',
  red500: '#e6006f',
  red600: '#b40056',
  red700: '#82003e',
  red800: '#500025',
  red900: '#20000e'
}

export const {
  styled,
  ThemeProvider,
  theme,
  createTheme,
  useTheme,
  css,
  config
} = createStitches({
  theme: {
    colors: {
      ...baseColors,
      background: baseColors.gray900,
      backgroundElevation1: baseColors.gray800,
      backgroundElevation2: baseColors.gray700,
      body: baseColors.gray100,
      heading: baseColors.gray50,
      bodyMuted: baseColors.gray200,
      destructive: baseColors.red500,
      border: baseColors.gray300
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
export type CSS = StitchesCSS<typeof config>
