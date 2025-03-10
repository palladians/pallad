import { useVault } from "@palladxyz/vault"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AddEditAccountView } from "../views/add-edit-account"

export const AddAccountRoute = () => {
  const { deriveNewAccount } = useVault()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleAddAccount = async (credentialName: string) => {
    setIsLoading(true)
    await deriveNewAccount(credentialName).then(() => navigate(-1))
    setIsLoading(false)
  }

  return (
    <AddEditAccountView
      title={"Add Account"}
      handleAddEditAccount={handleAddAccount}
      isLoading={isLoading}
    />
  )
}
