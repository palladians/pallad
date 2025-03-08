import { useVault } from "@palladxyz/vault"
import { useNavigate } from "react-router-dom"
import { AddEditAccountView } from "../views/add-edit-account"

export const AddAccountRoute = () => {
  const { deriveNewAccount } = useVault()
  const navigate = useNavigate()

  const handleAddAccount = async (credentialName: string) => {
    await deriveNewAccount(credentialName).then(() => navigate(-1))
  }

  return (
    <AddEditAccountView
      title={"Add Account"}
      handleAddEditAccount={handleAddAccount}
    />
  )
}
