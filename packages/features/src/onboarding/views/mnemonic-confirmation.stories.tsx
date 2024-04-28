import type { Story, StoryDefault } from "@ladle/react"
import { useForm } from "react-hook-form"

import type { MnemonicConfirmationData } from "../types"
import { MnemonicConfirmationView } from "./mnemonic-confirmation"

export const View: Story<{ confirmationValid: boolean }> = ({
  confirmationValid,
}) => {
  const form = useForm<MnemonicConfirmationData>()
  return (
    <MnemonicConfirmationView
      form={form}
      confirmationIndex={6}
      confirmationValid={confirmationValid}
      onSubmit={() => console.log("confirmed")}
      restoring={false}
    />
  )
}

export default {
  title: "Onboarding / Mnemonic Confirmation",
  args: {
    confirmationValid: false,
  },
} satisfies StoryDefault
