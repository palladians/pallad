import type { ChainDerivationArgs } from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
import { getSessionPersistence } from "@palladxyz/persistence"
import { DEFAULT_NETWORK, KeyAgents, useVault } from "@palladxyz/vault"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { useMixpanel } from "react-mixpanel-browser"
import { useNavigate } from "react-router-dom"

import { useAppStore } from "@/common/store/app"
import { useOnboardingStore } from "@/common/store/onboarding"

import { MnemonicConfirmationView } from "../views/mnemonic-confirmation"

const getConfirmationIndex = () => {
  return Math.floor(Math.random() * 12)
}

export const MnemonicConfirmationRoute = () => {
  const mixpanel = useMixpanel()
  const [restoring, setRestoring] = useState(false)
  const restoreWallet = useVault((state) => state.restoreWallet)
  const [confirmationIndex] = useState(getConfirmationIndex())
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized,
  )
  const navigate = useNavigate()
  const { spendingPassword, walletName, mnemonic } = useOnboardingStore(
    (state) => ({
      spendingPassword: state.spendingPassword,
      walletName: state.walletName,
      mnemonic: state.mnemonic,
    }),
  )
  const mnemonicSplit = useMemo(() => mnemonic?.split(" "), [mnemonic])
  const mnemonicConfirmationForm = useForm({
    defaultValues: {
      mnemonicWord: "",
    },
  })
  const mnemonicWord = mnemonicConfirmationForm.watch("mnemonicWord")
  const confirmationValid = useMemo(
    () => mnemonicSplit?.[confirmationIndex] === mnemonicWord,
    [mnemonicWord, mnemonicSplit, confirmationIndex],
  )
  const onSubmit = async () => {
    if (!walletName) return
    if (!spendingPassword) return
    if (!mnemonic) return
    getSessionPersistence().setItem("spendingPassword", spendingPassword)
    await useVault.persist.rehydrate()
    const restoreArgs: ChainDerivationArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
    }
    try {
      setRestoring(true)
      await restoreWallet(
        restoreArgs,
        DEFAULT_NETWORK,
        {
          mnemonicWords: mnemonic.split(" "),
          getPassphrase: () =>
            new Promise<Uint8Array>((resolve) =>
              resolve(Buffer.from(spendingPassword)),
            ),
        },
        walletName,
        KeyAgents.InMemory,
        "Test", // TODO: make this a configurable credential name or random if not provided
      )
      mixpanel.track("WalletCreated")
      setVaultStateInitialized()
      return navigate("/onboarding/finish")
    } finally {
      setRestoring(false)
    }
  }
  return (
    <MnemonicConfirmationView
      confirmationIndex={confirmationIndex}
      form={mnemonicConfirmationForm}
      confirmationValid={confirmationValid}
      onSubmit={onSubmit}
      restoring={restoring}
    />
  )
}
