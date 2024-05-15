import { useState } from "react"
import { useNavigate } from "react-router-dom"

import { useOnboardingStore } from "@/common/store/onboarding"

import { SeedBackupView } from "../views/seed-backup"

export const SeedBackupRoute = () => {
  const navigate = useNavigate()
  const mnemonicWords = useOnboardingStore((state) =>
    state.mnemonic?.split(" "),
  )
  const [mnemonicWritten, setMnemonicWritten] = useState(false)
  return (
    <SeedBackupView
      mnemonicWords={mnemonicWords ?? []}
      mnemonicWritten={mnemonicWritten}
      setMnemonicWritten={setMnemonicWritten}
      onConfirm={() => navigate("/onboarding/confirmation")}
    />
  )
}
