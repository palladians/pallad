import { Box, useDisclosure } from '@palladxyz/ui'

import { AppLayout } from '../../common/components/AppLayout'
import { useVaultStore } from '../../common/store/vault'
import { AssetsList } from '../components/AssetsList'
import { OverviewCard } from '../components/OverviewCard'
import { ReceiveModal } from '../components/ReceiveModal'

export const OverviewView = () => {
  const { isOpen: receiveModalOpened, setIsOpen: setReceiveModalOpened } =
    useDisclosure()
  const openReceiveModal = () => setReceiveModalOpened(true)
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  return (
    <AppLayout>
      {currentWallet?.walletPublicKey && (
        <ReceiveModal
          walletAddress={currentWallet.walletPublicKey}
          isOpen={receiveModalOpened}
          setIsOpen={setReceiveModalOpened}
        />
      )}
      <Box
        css={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          backgroundColor: '$gray900'
        }}
      >
        {currentWallet?.walletPublicKey && (
          <OverviewCard
            walletAddress={currentWallet.walletPublicKey}
            openReceiveModal={openReceiveModal}
          />
        )}
      </Box>
      <AssetsList />
    </AppLayout>
  )
}
