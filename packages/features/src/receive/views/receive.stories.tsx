import type { StoryDefault } from "@ladle/react"

import { ReceiveView } from "./receive"

export const View = () => {
  return (
    <ReceiveView
      gradientBackground=""
      publicKey="B62XXX"
      onCopyWalletAddress={() => console.log("copy address")}
      onGoBack={() => console.log("go back")}
      theme="dark"
    />
  )
}

export default {
  title: "Dashboard / Receive",
} satisfies StoryDefault
