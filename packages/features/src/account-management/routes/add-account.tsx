import { useVault } from "@palladco/vault"
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
    await deriveNewAccount(credentialName).then(() => navigate("/dashboard"))
    setIsLoading(false)
  }

  return (
    <AddEditAccountView
      title={t("accountManagement.addAccount")}
      handleAddEditAccount={handleAddAccount}
      isLoading={isLoading}
    />
  )
}
