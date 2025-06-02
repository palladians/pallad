import { type SingleCredentialState, useVault } from "@palladco/vault"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { AddEditAccountView } from "../views/add-edit-account"

export const EditAccountRoute = () => {
  const {
    credentials,
    setCredential,
    removeCredential,
    updateCurrentWallet,
    keyAgentName,
  } = useVault()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { addressIndex } = useParams<{ addressIndex: string }>()
  const [editingAccount, setEditingAccount] = useState<SingleCredentialState>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!credentials || addressIndex === undefined || addressIndex === null)
      return

    const serializedList = Object.values(credentials)
    const account = serializedList.find(
      (account) =>
        Number(account?.credential?.addressIndex) === Number(addressIndex),
    )

    if (account) setEditingAccount(account)
  }, [addressIndex, credentials])

  const handleEditAccount = async (credentialName: string) => {
    setIsLoading(true)
    if (editingAccount) {
      const updatedAccount = {
        ...editingAccount,
        credentialName,
      }

      //Remove before setCredential as setCredential creates a new credential entry
      if (editingAccount.credentialName !== credentialName) {
        removeCredential(editingAccount.credentialName)
        setEditingAccount(updatedAccount)
        setCredential(updatedAccount)
        updateCurrentWallet({
          keyAgentName,
          credentialName: updatedAccount?.credentialName,
          currentAccountIndex: updatedAccount?.credential?.accountIndex ?? 0,
          currentAddressIndex: updatedAccount?.credential?.addressIndex ?? 0,
        })
      }
      toast.success(t("accountManagement.accountEdited"))
      navigate(-1)
    }
    setIsLoading(false)
  }

  return (
    <AddEditAccountView
      title={t("accountManagement.editAccount")}
      account={editingAccount}
      handleAddEditAccount={handleEditAccount}
      isLoading={isLoading}
    />
  )
}
