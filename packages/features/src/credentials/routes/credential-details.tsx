import { type CredentialId, useVault } from "@palladco/vault"
import { useNavigate, useParams } from "react-router"
import { CredentialDetailsView } from "../views/credential-details"

export const CredentialDetailsRoute = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const credential = useVault((state) =>
    JSON.stringify(state.getObject(id as CredentialId), null, "\t"),
  )
  const removeObject = useVault((state) => state.removeObject)
  const onCredentialDelete = () => {
    const result = window.confirm(
      "Are you sure you want to delete this credential?",
    )
    if (!result) return
    removeObject(id as CredentialId)
    return navigate("/credentials")
  }
  if (!id) return null
  return (
    <CredentialDetailsView
      id={id}
      credential={credential}
      onGoBack={() => navigate("/credentials")}
      onDelete={onCredentialDelete}
    />
  )
}
