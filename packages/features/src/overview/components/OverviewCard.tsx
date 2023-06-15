import { Box, Button, icons, Image, Spinner, Text } from '@palladxyz/ui'
import easyMeshGradient from 'easy-mesh-gradient'
import { useMemo } from 'react'
import { Clipboard, Pressable } from 'react-native'

import { useAccount } from '../../common/lib/hooks'
import { trpc } from '../../common/lib/trpc'
import { truncateString } from '../../common/lib/string'

interface OverviewCardProps {
  walletAddress: string
}

export const OverviewCard = ({ walletAddress }: OverviewCardProps) => {
  const { data: accountQuery, isLoading: accountLoading } = useAccount()
  const { data: priceQuery, isLoading: fiatPriceLoading } =
    trpc.mina.fiatPrice.useSWR()
  const isLoading = accountLoading || fiatPriceLoading
  const rawTotalBalance = parseFloat(accountQuery?.account?.balance?.total)
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
          <Text css={{ fontSize: 14, fontWeight: 700 }}>Balance</Text>
          <Text css={{ fontSize: 24, fontWeight: 700, color: '$white' }}>
            {totalBalance} MINA
          </Text>
          <Text css={{ fontSize: 14, fontWeight: 700, color: '$primary500' }}>
            ~{fiatBalance} USD
          </Text>
        </Box>
      )}
      <Box css={{ gap: 8 }}>
        <Text css={{ fontSize: 14, fontWeight: 700 }}>Address</Text>
        <Box css={{ flexDirection: 'row', gap: 8 }}>
          <Text
            css={{
              fontSize: 14,
              fontWeight: 700,
              color: '$primary500',
              width: 'auto'
            }}
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
        <Button variant="secondary" css={{ flex: 1 }}>
          Send
        </Button>
        <Button css={{ flex: 1 }}>Receive</Button>
      </Box>
    </Box>
  )
}
