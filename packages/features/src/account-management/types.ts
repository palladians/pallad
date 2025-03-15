import type { SingleCredentialState } from "@palladco/vault"

export type DropdownOption = {
  name: string
  icon: JSX.Element
  onClick: (account: SingleCredentialState) => void
}
