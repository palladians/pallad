import { useAccount } from "@/common/hooks/use-account"
import { type SingleCredentialState, useVault } from "@palladco/vault"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountManagementView } from "../views/account-management"

export const AccountManagementRoute = () => {
  const navigate = useNavigate()
  const {
    updateCurrentWallet,
    setCredential,
    keyAgentName,
    credentials,
    walletName,
    getCurrentWallet,
  } = useVault()
  const [accountList, setAccountlist] = useState<SingleCredentialState[]>([])
  const [selectedAccount, setSelectedAccount] = useState<SingleCredentialState>(
    accountList[0],
  )
  const { copyWalletAddress } = useAccount()

  const selectAccount = (account: SingleCredentialState) => {
    setSelectedAccount(account)
    setCredential(account)
    updateCurrentWallet({
      keyAgentName,
      credentialName: account?.credentialName,
      currentAccountIndex: account?.credential?.accountIndex ?? 0,
      currentAddressIndex: account?.credential?.addressIndex ?? 0,
    })
  }

  useEffect(() => {
    const serializedList = Object.values(credentials)
    setAccountlist(serializedList)
    setSelectedAccount(getCurrentWallet().credential)
  }, [credentials, getCurrentWallet])

  return (
    <AccountManagementView
      onGoBack={() => navigate(-1)}
      walletName={walletName}
      accounts={accountList}
      onSelectAccount={selectAccount}
      selectedAccount={selectedAccount}
      onCopyWalletAddress={copyWalletAddress}
    />
  )
}
