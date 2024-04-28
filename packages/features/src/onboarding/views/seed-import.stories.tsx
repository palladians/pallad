import type { StoryDefault } from "@ladle/react"
import { useForm } from "react-hook-form"

import type { MnemonicInputData } from "../types"
import { SeedImportView } from "./seed-import"

export const View = () => {
  const form = useForm<MnemonicInputData>()
  return (
    <SeedImportView
      form={form}
      mnemonicValid={true}
      onSubmit={(data) => console.log(data)}
      restoring={false}
    />
  )
}

export default {
  title: "Onboarding / Seed Import",
} satisfies StoryDefault
