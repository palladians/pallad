import { WalletInfoForm } from "../components/wallet-info-form"
import type { WalletInfoData } from "../types"

type RestoreWalletViewProps = {
  onSubmit: (data: WalletInfoData) => void
}

export const RestoreWalletView = ({ onSubmit }: RestoreWalletViewProps) => (
  <WalletInfoForm title="Restore Wallet" onSubmit={onSubmit} />
)
