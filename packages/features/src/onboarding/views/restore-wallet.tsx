import { WalletInfoForm } from '../components/wallet-info-form'
import { WalletInfoData } from '../types'

type RestoreWalletViewProps = {
  onSubmit: (data: WalletInfoData) => void
}

export const RestoreWalletView = ({ onSubmit }: RestoreWalletViewProps) => (
  <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
)
