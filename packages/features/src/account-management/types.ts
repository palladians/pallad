import type { SingleCredentialState } from "@palladxyz/vault"

export type DropdownOption = {
  name: string
  icon: JSX.Element
  onClick: (account: SingleCredentialState) => void
}
