import { useVault } from "@palladco/vault"
import { CredentialsView } from "../views/credentials"

export const CredentialsRoute = () => {
  const credentials = useVault((store) => Object.entries(store.objects))
  return <CredentialsView credentials={credentials} />
}
