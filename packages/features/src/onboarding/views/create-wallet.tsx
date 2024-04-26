import { WalletInfoForm } from "../components/wallet-info-form"
import type { WalletInfoData } from "../types"

type CreateWalletViewProps = {
  onSubmit: (data: WalletInfoData) => void
}

export const CreateWalletView = ({ onSubmit }: CreateWalletViewProps) => (
  <WalletInfoForm title="Create Wallet" onSubmit={onSubmit} />
)
