import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { ReceiveView } from "./views/receive"

export const Receive = () => {
  return (
    <ReceiveView
      walletName="Test"
      publicKey="B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5"
      onCopyWalletAddress={action("Address Copied")}
      onGoBack={action("Go Back")}
    />
  )
}

export default {
  title: "Receive",
} satisfies StoryDefault
