import type { StoryDefault } from "@ladle/react"
import { useForm } from "react-hook-form"

import type { MnemonicConfirmationData } from "../types"
import { MnemonicConfirmationView } from "./mnemonic-confirmation"

export const View = () => {
  const form = useForm<MnemonicConfirmationData>()
  return (
    <MnemonicConfirmationView
      form={form}
      confirmationIndex={6}
      confirmationValid={false}
      onSubmit={() => console.log("confirmed")}
      restoring={false}
    />
  )
}

export default {
  title: "Onboarding / Mnemonic Confirmation",
} satisfies StoryDefault
