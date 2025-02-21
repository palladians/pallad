import { useAccount } from "@/common/hooks/use-account"
import { useNavigate } from "react-router"
import { WalletManagementView } from "../views/wallet-management"

export const WalletManagementRoute = () => {
  const navigate = useNavigate()
  const { networkId } = useAccount()
  return (
    <WalletManagementView onGoBack={() => navigate(-1)} networkId={networkId} />
    //   publicKey={publicKey}
    //   walletName={currentWallet.credential.keyAgentName}
    //   onCopyWalletAddress={copyWalletAddress}
    // />
  )
}
