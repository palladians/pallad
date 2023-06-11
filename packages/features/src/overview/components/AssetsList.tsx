import {
  Box,
  Button,
  Heading,
  icons,
  Image,
  Spinner,
  Text
} from '@palladxyz/ui'

import { useAccount } from '../../common/lib/hooks'

export const AssetsList = () => {
  const { data, isLoading } = useAccount()
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
        {isLoading ? (
          <Spinner />
        ) : (
          <Text css={{ width: 'auto' }}>{data?.account?.balance?.total}</Text>
        )}
      </Box>
    </Box>
  )
}
