import { Box } from '@palladxyz/ui'

import { AppLayout } from '../../common/components/AppLayout'
import { useViewAnimation } from '../../common/lib/animation'
import { useVaultStore } from '../../common/store/vault'
import { AssetsList } from '../components/AssetsList'
import { OverviewCard } from '../components/OverviewCard'

export const OverviewView = () => {
  const { shift, opacity, scale } = useViewAnimation()
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  return (
    <AppLayout>
      <Box
        style={{
          transform: [{ scale }],
          opacity,
          top: shift
        }}
      >
        <Box
          css={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
            backgroundColor: '$gray900'
          }}
        >
          {currentWallet?.walletPublicKey && (
            <OverviewCard walletAddress={currentWallet.walletPublicKey} />
          )}
        </Box>
        <AssetsList />
      </Box>
    </AppLayout>
  )
}
