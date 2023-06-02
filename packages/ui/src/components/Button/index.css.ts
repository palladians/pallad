import { CSS } from '../../lib/styled'

export const buttonBase: CSS = {
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  transitionProperty: 'color',
  transitionDuration: '0.3s',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
  outline: '2px solid transparent',
  outlineOffset: '2px',
  flexDirection: 'row',
  gap: 8
}

export const buttonVariantDefault: CSS = {
  backgroundColor: '$gray800',
  color: '$primaryForeground',
  '&:hover': {
    backgroundColor: '$gray700'
  }
}

export const buttonVariantDestructive: CSS = {
  backgroundColor: '$destructive',
  color: '$destructiveForeground',
  '&:hover': {
    backgroundColor: '$destructive',
    opacity: 0.9
  }
}

export const buttonVariantOutline: CSS = {
  border: '1px solid',
  borderColor: '$inputBorder',
  '&:hover': {
    backgroundColor: '$accent',
    color: '$accentForeground'
  }
}

export const buttonVariantSecondary: CSS = {
  backgroundColor: '$secondary',
  color: '$secondaryForeground',
  '&:hover': {
    backgroundColor: '$secondary',
    opacity: 0.8
  }
}

export const buttonVariantGhost: CSS = {
  '&:hover': {
    backgroundColor: '$accent',
    color: '$accentForeground'
  }
}

export const buttonVariantLink: CSS = {
  textDecoration: 'underline',
  textDecorationOffset: '0.25rem',
  '&:hover': {
    textDecoration: 'underline'
  },
  color: '$primary'
}

export const buttonSizeDefault: CSS = {
  height: '2.5rem',
  paddingTop: '0.5rem',
  paddingBottom: '0.5rem',
  paddingLeft: '1rem',
  paddingRight: '1rem'
}

export const buttonSizeSm: CSS = {
  height: '2.25rem',
  paddingLeft: '0.75rem',
  paddingRight: '0.75rem',
  borderRadius: '0.375rem'
}

export const buttonSizeLg: CSS = {
  height: '2.75rem',
  paddingLeft: '2rem',
  paddingRight: '2rem',
  borderRadius: '0.375rem'
}
