import { AppLayout } from '../../common/components/AppLayout'
import { AssetsList } from '../components/AssetsList'
import { OverviewCard } from '../components/OverviewCard'

export const OverviewView = () => {
  const currentWallet = {
    walletPublicKey: 'B62XD'
  }
  return (
    <AppLayout>
      <div>
        <div className="p-4 bg-sky-960">
          {currentWallet?.walletPublicKey && (
            <OverviewCard walletAddress={currentWallet.walletPublicKey} />
          )}
        </div>
        <AssetsList />
      </div>
    </AppLayout>
  )
}
