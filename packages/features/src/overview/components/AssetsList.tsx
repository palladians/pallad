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
    <Box css={{ flex: 1, padding: 16, gap: 12, backgroundColor: '$gray800' }}>
      <Box css={{ flexDirection: 'row', alignItems: 'center' }}>
        <Heading size="md" css={{ color: '$gray50' }}>
          Assets
        </Heading>
        <Button
          variant="link"
          css={{ width: 'auto', paddingRight: 0, color: '$gray100' }}
        >
          See Transactions
        </Button>
      </Box>
      <Box css={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <Image source={icons.iconMina} css={{ width: 40, height: 40 }} />
        <Text css={{ flex: 1, fontWeight: 500, color: '$gray100' }}>MINA</Text>
        {isLoading ? (
          <Spinner />
        ) : (
          <Text css={{ width: 'auto', color: '$gray100' }}>
            {data?.account?.balance?.total}
          </Text>
        )}
      </Box>
    </Box>
  )
}
