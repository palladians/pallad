import { useVault } from "@palladxyz/vault"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AddEditAccountView } from "../views/add-edit-account"

export const AddAccountRoute = () => {
  const { deriveNewAccount } = useVault()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleAddAccount = async (credentialName: string) => {
    setIsLoading(true)
    await deriveNewAccount(credentialName).then(() => navigate(-1))
    setIsLoading(false)
  }

  return (
    <AddEditAccountView
      title={t("account-management.addAccount")}
      handleAddEditAccount={handleAddAccount}
      isLoading={isLoading}
    />
  )
}
