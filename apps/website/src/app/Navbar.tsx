import { Box, Text } from '@palladxyz/ui'
import NextImage from 'next/image'

export const Navbar = () => {
  return (
    <Box
      css={{
        padding: '1rem',
        backgroundColor: '$gray900',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        css={{
          flexDirection: 'row',
          gap: 12,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <NextImage src="/logo.svg" width={24} height={30} alt="Logo" />
        <Text css={{ fontSize: 20, fontWeight: '600' }}>Pallad</Text>
      </Box>
    </Box>
  )
}
