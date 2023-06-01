import { Box } from '@palladxyz/ui'
import { AssetsList } from '@/features/overview/components/AssetsList.tsx'
import { OverviewCard } from '@/features/overview/components/OverviewCard.tsx'
import { Navbar } from '@/components/Navbar'

export const OverviewView = () => {
  return (
    <Box>
      <Navbar />
      <Box css={{ paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '$black' }}>
        <OverviewCard walletAddress="B62qmHiGSVciKvatWa7qn98kVEbGo1uogsQgkWqrxrd9rXnC9riiQvm" />
      </Box>
      <AssetsList />
    </Box>
  )
}
