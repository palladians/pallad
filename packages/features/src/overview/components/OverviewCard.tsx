import { useFiatPrice } from '@palladxyz/offchain-data'
import { Avatar, Box, Button, icons, Image, Spinner, Text } from '@palladxyz/ui'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'
import { Clipboard, Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { FormLabel } from '../../common/components/FormLabel'
import { useAccount } from '../../common/lib/hooks'
import { truncateString } from '../../common/lib/string'

interface OverviewCardProps {
  walletAddress: string
  openReceiveModal: () => void
}

export const OverviewCard = ({ walletAddress }: OverviewCardProps) => {
  const navigate = useNavigate()
  const { data: accountQuery, isLoading: accountLoading } = useAccount()
  const account = accountQuery?.result?.data?.account
  const { data: priceQuery, isLoading: fiatPriceLoading } = useFiatPrice()
  const isLoading = accountLoading || fiatPriceLoading
  const rawTotalBalance = parseFloat(account?.balance?.total)
  const totalBalance = rawTotalBalance ? rawTotalBalance.toFixed(4) : '0'
  const rawFiatPrice = parseFloat(priceQuery?.['mina-protocol']?.usd)
  const rawFiatBalance = useMemo(
    () => rawTotalBalance * rawFiatPrice || 0,
    [rawTotalBalance, rawFiatPrice]
  )
  const fiatBalance = rawFiatBalance ? rawFiatBalance.toFixed(2) : '0'
  const meshGradientBright = easyMeshGradient({
    seed: walletAddress,
    hueRange: [180, 240]
  })
  return (
    <Box
      css={{
        width: '100%',
        height: 232,
        borderRadius: 16,
        padding: 16,
        gap: 16,
        position: 'relative',
        zIndex: 0
      }}
    >
      <Box
        css={{
          position: 'absolute',
          backgroundImage: meshGradientBright,
          width: '100%',
          height: '100%',
          filter: 'blur(64px)',
          borderRadius: 16,
          opacity: 0.3
        }}
      />
      <Box
        css={{
          position: 'absolute',
          backgroundImage: meshGradientBright,
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          borderRadius: 16
        }}
      />
      <Box
        css={{
          position: 'absolute',
          backgroundColor: '$gray900',
          top: 2,
          left: 2,
          right: 2,
          bottom: 2,
          width: 'calc(100% - 4px)',
          height: 'calc(100% - 4px)',
          borderRadius: 14,
          opacity: 0.8
        }}
      />
      {isLoading ? (
        <Box css={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </Box>
      ) : (
        <Box css={{ flex: 1, flexDirection: 'row' }}>
          <Box css={{ flex: 1, gap: 8 }}>
            <FormLabel>Balance</FormLabel>
            <Text
              css={{ fontSize: 24, fontWeight: 700, color: '$white' }}
              testID="dashboard__minaBalance"
            >
              {totalBalance} MINA
            </Text>
            <Text css={{ fontSize: 14, fontWeight: 700, color: '$primary400' }}>
              ~{fiatBalance} USD
            </Text>
          </Box>
          <Avatar label={walletAddress} />
        </Box>
      )}
      <Box css={{ gap: 8 }}>
        <FormLabel>Address</FormLabel>
        <Box css={{ flexDirection: 'row', gap: 8 }}>
          <Text
            css={{
              fontSize: 14,
              fontWeight: 700,
              color: '$primary400',
              width: 'auto'
            }}
            testID="dashboard__addressTruncated"
          >
            {truncateString({
              value: walletAddress,
              firstCharCount: 8,
              endCharCount: 8
            })}
          </Text>
          <Pressable onPress={() => Clipboard.setString(walletAddress)}>
            <Image source={icons.iconCopy} css={{ width: 20, height: 20 }} />
          </Pressable>
        </Box>
      </Box>
      <Box css={{ flexDirection: 'row', gap: 8 }}>
        <Button
          variant="secondary"
          css={{ flex: 1 }}
          onPress={() => navigate('/send')}
        >
          Send
        </Button>
        <Button
          variant="outline"
          css={{ flex: 1 }}
          onPress={() => navigate('/receive')}
        >
          Receive
        </Button>
      </Box>
    </Box>
  )
}
