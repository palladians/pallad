import { type Story, type StoryDefault, action } from "@ladle/react"
import { useState } from "react"
import { useForm } from "react-hook-form"

import type { MnemonicConfirmationData, MnemonicInputData } from "./types"

import { CreateWalletView } from "./views/create-wallet"
import { RestoreWalletView } from "./views/restore-wallet"
import { SeedBackupView } from "./views/seed-backup"
import { SeedBackupConfirmationView } from "./views/seed-backup-confirmation"
import { SeedBackupSecurityView } from "./views/seed-backup-security"
import { SeedImportView } from "./views/seed-import"
import { SeedImportSecurityView } from "./views/seed-import-security"
import { StartView } from "./views/start"
import { StayConnectedView } from "./views/stay-connected"

const TEST_MNEMONIC =
  "habit hope tip crystal because grunt nation idea electric witness alert like"

export const Start = () => (
  <StartView
    onCreateClicked={action("Create Clicked")}
    onRestoreClicked={action("Restore Clicked")}
  />
)

export const StayConnected = () => (
  <StayConnectedView onGoToDashboard={action("Go To Dashboard")} />
)

export const CreateWallet = () => (
  <CreateWalletView onSubmit={action("Submit")} />
)

export const RestoreWallet = () => (
  <RestoreWalletView onSubmit={action("Submit")} />
)

export const SeedBackupConfirmation: Story<{ confirmationValid: boolean }> = ({
  confirmationValid,
}) => {
  const form = useForm<MnemonicConfirmationData>()
  return (
    <SeedBackupConfirmationView
      form={form}
      confirmationIndex={6}
      confirmationValid={confirmationValid}
      onSubmit={() => console.log("confirmed")}
      restoring={false}
    />
  )
}

export const SeedBackupSecurity = () => {
  return <SeedBackupSecurityView onConfirm={action("Security confirmed")} />
}

export const SeedBackup = () => {
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

export const SeedImportSecurity = () => {
  return <SeedImportSecurityView onConfirm={action("Security confirmed")} />
}

export const SeedImport = () => {
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
  title: "Onboarding",
  args: {
    confirmationValid: false,
  },
} satisfies StoryDefault
