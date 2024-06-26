import type { StoryDefault } from "@ladle/react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { UnlockWalletView } from "./views/unlock-wallet"

export const UnlockWallet = () => {
  const [restartAlertVisible, setRestartAlertVisible] = useState(false)
  const form = useForm<any>()
  return (
    <UnlockWalletView
      form={form}
      onSubmit={() => console.log("submit")}
      restartAlertVisible={restartAlertVisible}
      setRestartAlertVisible={setRestartAlertVisible}
      showPassword={false}
      togglePassword={() => console.log("toggle")}
    />
  )
}

export default {
  title: "Unlock Wallet",
} satisfies StoryDefault
