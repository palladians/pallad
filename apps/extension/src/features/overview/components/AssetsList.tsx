import { Box, Heading, icons, Image, Text, Button } from '@palladxyz/ui'

export const AssetsList = () => {
  return (
    <Box css={{ padding: 16, gap: 12 }}>
      <Box css={{ flexDirection: 'row', alignItems: 'center' }}>
        <Heading size="md">Assets</Heading>
        <Button variant="link" css={{ width: 'auto', paddingRight: 0 }}>
          See Transactions
        </Button>
      </Box>
      <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <Image source={icons.iconMina} css={{ width: 40, height: 40 }} />
        <Text css={{ flex: 1, fontWeight: 500 }}>MINA</Text>
        <Text css={{ width: 'auto' }}>361</Text>
      </Box>
    </Box>
  )
}
