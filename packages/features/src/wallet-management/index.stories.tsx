import { type StoryDefault, action } from "@ladle/react"
import { WalletManagementView } from "./views/wallet-management"

export const WalletManagement = () => {
  return (
    <WalletManagementView
      onGoBack={action("Go Back")}
      networkId="mina:devnet"
    />
  )
}

export default {
  title: "Wallet Management",
} satisfies StoryDefault
