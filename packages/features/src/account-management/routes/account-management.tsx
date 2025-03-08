import { type SingleCredentialState, useVault } from "@palladxyz/vault"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AccountManagementView } from "../views/account-management"

export const AccountManagementRoute = () => {
  const navigate = useNavigate()
  const {
    setCurrentWallet,
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

  const onSelectAccount = (account: SingleCredentialState) => {
    setSelectedAccount(account)
    setCredential(account)
    setCurrentWallet({
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
      onSelectAccount={onSelectAccount}
      selectedAccount={selectedAccount}
    />
  )
}
