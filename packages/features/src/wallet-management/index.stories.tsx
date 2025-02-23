import { type StoryDefault, action } from "@ladle/react"
import type { Account } from "./types"
import { WalletManagementView } from "./views/wallet-management"

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

export const WalletManagement = () => {
  const selectedIndex = 1
  return (
    <WalletManagementView
      onGoBack={action("Go Back")}
      networkId="mina:devnet"
      publicKey={accounts[selectedIndex].publicKey}
      walletName={accounts[selectedIndex].name}
      accounts={accounts}
    />
  )
}

export default {
  title: "Wallet Management",
} satisfies StoryDefault
