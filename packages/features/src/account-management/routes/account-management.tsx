import { useAccount } from "@/common/hooks/use-account"
import { useNavigate } from "react-router"
import { AccountManagementView } from "../views/account-management"

export const AccounttManagementRoute = () => {
  const navigate = useNavigate()
  const { networkId, publicKey } = useAccount()
  return (
    <AccountManagementView
      onGoBack={() => navigate(-1)}
      networkId={networkId}
      publicKey={publicKey}
      walletName={""}
      accounts={[]}
    />
    //   publicKey={publicKey}
    //   walletName={currentWallet.credential.keyAgentName}
    //   onCopyWalletAddress={copyWalletAddress}
    // />
  )
}
