import { createStitches } from 'stitches-native'
import type * as Stitches from 'stitches-native'

export const { styled, ThemeProvider, theme, createTheme, useTheme, css, config } = createStitches({
  theme: {
    colors: {
      background: 'hsl(0, 0%, 100%)',
      foreground: 'hsl(222.2, 47.4%, 11.2%)',
      muted: 'hsl(210, 40%, 96.1%)',
      mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
      popover: 'hsl(0, 0%, 100%)',
      popoverForeground: 'hsl(222.2, 47.4%, 11.2%)',
      card: 'hsl(0, 0%, 100%)',
      cardForeground: 'hsl(222.2, 47.4%, 11.2%)',
      border: 'hsl(214.3, 31.8%, 91.4%)',
      input: 'hsl(214.3, 31.8%, 91.4%)',
      primary: 'hsl(222.2, 47.4%, 11.2%)',
      primaryForeground: 'hsl(210, 40%, 98%)',
      secondary: 'hsl(210, 40%, 96.1%)',
      secondaryForeground: 'hsl(222.2, 47.4%, 11.2%)',
      accent: 'hsl(210, 40%, 96.1%)',
      accentForeground: 'hsl(222.2, 47.4%, 11.2%)',
      destructive: 'hsl(0, 100%, 50%)',
      destructiveForeground: 'hsl(210, 40%, 98%)',
      ring: 'hsl(215, 20.2%, 65.1%)'
    }
  }
})
export const darkTheme = createTheme({})
export type Theme = typeof theme
export type CSS = Stitches.CSS<typeof config>
