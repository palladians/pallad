import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { ReceiveView } from "./receive"

export const View = () => {
  return (
    <ReceiveView
      publicKey="B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5"
      onLogoClicked={action("Logo Clicked")}
      onCopyWalletAddress={action("Address Copied")}
      onGoBack={action("Go Back")}
    />
  )
}

export default {
  title: "Receive",
} satisfies StoryDefault
