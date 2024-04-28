import type { StoryDefault } from "@ladle/react"
import { useState } from "react"

import { SeedBackupView } from "./seed-backup"

const TEST_MNEMONIC =
  "habit hope tip crystal because grunt nation idea electric witness alert like"

export const View = () => {
  const [mnemonicWritten, setMnemonicWritten] = useState(false)
  return (
    <SeedBackupView
      mnemonicWords={TEST_MNEMONIC.split(" ")}
      mnemonicWritten={mnemonicWritten}
      setMnemonicWritten={setMnemonicWritten}
      onConfirm={() => console.log("confirmed")}
    />
  )
}

export default {
  title: "Onboarding / Seed Backup",
} satisfies StoryDefault
