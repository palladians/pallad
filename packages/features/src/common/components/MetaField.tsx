import { Box, Text } from '@palladxyz/ui'

import { FormLabel } from './FormLabel'

interface MetaFieldProps {
  label: string
  value: string
}

export const MetaField = ({ label, value }: MetaFieldProps) => {
  return (
    <Box css={{ gap: 8 }}>
      <FormLabel>{label}</FormLabel>
      <Text css={{ lineHeight: '175%' }}>{value}</Text>
    </Box>
  )
}
