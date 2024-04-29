import type { StoryDefault } from "@ladle/react"

import { ReceiveView } from "./receive"

export const View = () => {
  return (
    <ReceiveView
      publicKey="B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5"
      onCopyWalletAddress={() => console.log("copy address")}
      onGoBack={() => console.log("go back")}
    />
  )
}

export default {
  title: "Receive",
} satisfies StoryDefault
