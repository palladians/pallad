import { type StoryDefault, action } from "@ladle/react"
import type { Account } from "./types"
import { AccountManagementView } from "./views/account-management"
import { EditAccountView } from "./views/edit-account"

const accounts: Account[] = [
  {
    name: "First",
    publicKey: "B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5",
  },
  {
    name: "Second",
    publicKey: "B62qoWVkExh5zK69A7J3h6XoBovJh9fChXFsq6TQzB6LkVjZpQ7NVRC",
  },
  {
    name: "Third",
    publicKey: "B62qmTzX8U9dVYaWwXKzJ5v5vYxGQ3MHT9nD6Z5f2PqL8kNbVRP7hJb",
  },
]

export const AccountManagement = () => {
  const selectedIndex = 1
  return (
    <AccountManagementView
      onGoBack={action("Go Back")}
      walletName={accounts[selectedIndex].name}
      accounts={accounts}
    />
  )
}

export const EditAccount = () => {
  return (
    <EditAccountView account={accounts[2]} onSubmit={action("Update name")} />
  )
}

export default {
  title: "Wallet Management",
} satisfies StoryDefault
