import { Box, Button, icons, Image, Spinner, Text } from '@palladxyz/ui'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'
import { Clipboard, Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'
import useSWR from 'swr'

import { FormLabel } from '../../common/components/FormLabel'
import { fetcher } from '../../common/lib/api'
import { useAccount } from '../../common/lib/hooks'
import { truncateString } from '../../common/lib/string'

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL
const getMinaFiatPriceUrl = new URL(`${VITE_APP_API_URL}/trpc.getMinaFiatPrice`)

interface OverviewCardProps {
  walletAddress: string
  openReceiveModal: () => void
}

export const OverviewCard = ({ walletAddress }: OverviewCardProps) => {
  const navigate = useNavigate()
  const { data: accountQuery, isLoading: accountLoading } = useAccount()
  const account = accountQuery?.result?.data?.account
  const { data: priceQuery, isLoading: fiatPriceLoading } = useSWR(
    getMinaFiatPriceUrl,
    fetcher
  )
  const isLoading = accountLoading || fiatPriceLoading
  const rawTotalBalance = parseFloat(account?.balance?.total)
  const totalBalance = rawTotalBalance ? rawTotalBalance.toFixed(4) : '0'
  const rawFiatPrice = parseFloat(priceQuery?.usd)
  const rawFiatBalance = useMemo(
    () => rawTotalBalance * rawFiatPrice || 0,
    [rawTotalBalance, rawFiatPrice]
  )
  const fiatBalance = rawFiatBalance ? rawFiatBalance.toFixed(2) : '0'
  const meshGradient = easyMeshGradient({
    seed: walletAddress,
    lightnessRange: [0, 0.25]
  })
  return (
    <Box
      css={{
        width: '100%',
        height: 232,
        backgroundImage: meshGradient,
        borderRadius: 4,
        padding: 16,
        gap: 16,
        position: 'relative',
        zIndex: 0
      }}
    >
      <Image
        source={icons.noise}
        css={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}
      />
      {isLoading ? (
        <Box css={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </Box>
      ) : (
        <Box css={{ flex: 1, gap: 8 }}>
          <FormLabel>Balance</FormLabel>
          <Text
            css={{ fontSize: 24, fontWeight: 700, color: '$white' }}
            testID="dashboard__minaBalance"
          >
            {totalBalance} MINA
          </Text>
          <Text css={{ fontSize: 14, fontWeight: 700, color: '$primary500' }}>
            ~{fiatBalance} USD
          </Text>
        </Box>
      )}
      <Box css={{ gap: 8 }}>
        <FormLabel>Address</FormLabel>
        <Box css={{ flexDirection: 'row', gap: 8 }}>
          <Text
            css={{
              fontSize: 14,
              fontWeight: 700,
              color: '$primary500',
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
        <Button css={{ flex: 1 }} onPress={() => navigate('/receive')}>
          Receive
        </Button>
      </Box>
    </Box>
  )
}
