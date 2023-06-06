import { Box } from '@palladxyz/ui'
import { AssetsList } from '@/features/overview/components/AssetsList'
import { OverviewCard } from '@/features/overview/components/OverviewCard'
import { Navbar } from '@/components/Navbar'
import { useVaultStore } from '@/store/vault.ts'

export const OverviewView = () => {
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  return (
    <Box>
      <Navbar />
      <Box css={{ paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '$gray900' }}>
        <OverviewCard walletAddress={currentWallet?.walletPublicKey!} />
      </Box>
      <AssetsList />
    </Box>
  )
}
