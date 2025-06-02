import { type StoryDefault, action } from "@ladle/react"
import { Network } from "@palladco/pallad-core"
import type { SingleCredentialState } from "@palladco/vault"
import { AccountManagementView } from "./views/account-management"
import { AddEditAccountView } from "./views/add-edit-account"
const keyAgentName = "TestKeyAgent"
const walletName = "TesWallet"

const accounts: SingleCredentialState[] = [
  {
    credentialName: "First",
    keyAgentName: keyAgentName,
    credential: {
      "@context": ["https://w3id.org/wallet/v1"],
      id: "mina-cred-123",
      type: "MinaAddress",
      controller: "did:key:z6MkjQkU7hD8q1fS7P3X4f3kY9v2",
      name: "Sample Mina Account",
      description: "This is a dummy Mina credential for testing purposes.",
      chain: Network.Mina,
      addressIndex: 0,
      accountIndex: 0,
      address: "B62qjzAXN9NkX8K6JfGzYz4qVQoMrkL4uJ3FgkFjVZd4W5X5cQFQkCG",
      encryptedPrivateKeyBytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
    },
    lastSelected: undefined,
  },
  {
    credentialName: "Second",
    keyAgentName: keyAgentName,
    credential: {
      "@context": ["https://w3id.org/wallet/v1"],
      id: "mina-cred-123",
      type: "MinaAddress",
      controller: "did:key:z6MkjQkU7hD8q1fS7P3X4f3kY9v2",
      name: "Sample Mina Account",
      description: "This is a dummy Mina credential for testing purposes.",
      chain: Network.Mina,
      addressIndex: 1,
      accountIndex: 1,
      address: "B62qjzAXN9NkX8K6JfGzYz4qVQoMrkL4uJ3FgkFjVZd4W5X5cQFQkCF",
      encryptedPrivateKeyBytes: new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 11]),
    },
    lastSelected: undefined,
  },
]

export const AccountManagement = () => {
  const selectedIndex = 0
  return (
    <AccountManagementView
      onGoBack={action("Go Back")}
      walletName={walletName}
      accounts={accounts}
      onSelectAccount={(account: SingleCredentialState): void => {
        action(`${account}`)
      }}
      selectedAccount={accounts[selectedIndex]}
      onCopyWalletAddress={action("Copy Wallet Address")}
    />
  )
}

export const AddAccount = () => {
  return (
    <AddEditAccountView
      title={"Add Account"}
      handleAddEditAccount={async (credentialName: string): Promise<void> => {
        action(`${credentialName}`)
      }}
      isLoading={false}
    />
  )
}

export const EditAccount = () => {
  const selectedIndex = 0
  return (
    <AddEditAccountView
      title={"Edit Account"}
      account={accounts[selectedIndex]}
      handleAddEditAccount={async (credentialName: string): Promise<void> => {
        action(`${credentialName}`)
      }}
      isLoading={false}
    />
  )
}

export default {
  title: "Wallet Management",
} satisfies StoryDefault
