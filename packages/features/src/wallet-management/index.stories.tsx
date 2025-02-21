import { type StoryDefault, action } from "@ladle/react"
import { WalletManagementView } from "./views/wallet-management"

export const WalletManagement = () => {
  return (
    <WalletManagementView
      onGoBack={action("Go Back")}
      networkId="mina:devnet"
      publicKey="B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5"
      walletName="Test"
      onCopyWalletAddress={action("Address Copied")}
    />
  )
}

export default {
  title: "Wallet Management",
} satisfies StoryDefault
