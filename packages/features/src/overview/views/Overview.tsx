import { AppLayout } from '../../common/components/AppLayout'
import { AssetsList } from '../components/AssetsList'
import { OverviewCard } from '../components/OverviewCard'

export const OverviewView = () => {
  const currentWallet = {
    walletPublicKey: 'B62XD'
  }
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4">
        {currentWallet?.walletPublicKey && (
          <OverviewCard walletAddress={currentWallet.walletPublicKey} />
        )}
        <AssetsList />
      </div>
    </AppLayout>
  )
}
