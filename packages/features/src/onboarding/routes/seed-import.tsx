import { validateMnemonic, wordlist } from "@palladxyz/key-management"
import type { ChainDerivationArgs } from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
import { getSessionPersistence } from "@palladxyz/persistence"
import { DEFAULT_NETWORK, KeyAgents, useVault } from "@palladxyz/vault"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useMixpanel } from "react-mixpanel-browser"
import { useNavigate } from "react-router-dom"
import { shallow } from "zustand/shallow"

import { useAppStore } from "@/common/store/app"
import { useOnboardingStore } from "@/common/store/onboarding"

import type { MnemonicInputData } from "../types"
import { SeedImportView } from "../views/seed-import"

export const SeedImportRoute = () => {
  const mixpanel = useMixpanel()
  const [restoring, setRestoring] = useState(false)
  const restoreWallet = useVault((state) => state.restoreWallet)
  const navigate = useNavigate()
  const { walletName, spendingPassword } = useOnboardingStore(
    // TODO: fix this useOnboardingStore it is deprecated
    (state) => ({
      spendingPassword: state.spendingPassword,
      walletName: state.walletName,
    }),
    shallow,
  )
  const setVaultStateInitialized = useAppStore(
    (state) => state.setVaultStateInitialized,
  )
  const mnemonicInputForm = useForm<MnemonicInputData>()
  const mnemonic = mnemonicInputForm.watch("mnemonic")
  const chain = Network.Mina // TODO: useForm<ChainInputData>()
  const mnemonicValid = validateMnemonic(mnemonic?.join(" "), wordlist)
  const onSubmit: SubmitHandler<MnemonicInputData> = async (data) => {
    if (!walletName) return
    if (!spendingPassword) return
    getSessionPersistence().setItem("spendingPassword", spendingPassword)
    await useVault.persist.rehydrate()

    const restoreArgs: ChainDerivationArgs = {
      network: chain,
      accountIndex: 0,
      addressIndex: 0,
    }
    try {
      setRestoring(true)
      await restoreWallet(
        restoreArgs,
        DEFAULT_NETWORK,
        {
          mnemonicWords: data.mnemonic,
          getPassphrase: () =>
            new Promise<Uint8Array>((resolve) =>
              resolve(Buffer.from(spendingPassword)),
            ),
        },
        walletName,
        KeyAgents.InMemory,
        "Test", // TODO: make this a configurable credential name or random if not provided
      )
      mixpanel.track("WalletRestored")
      setVaultStateInitialized()
      return navigate("/onboarding/finish")
    } finally {
      setRestoring(false)
    }
  }
  return (
    <SeedImportView
      form={mnemonicInputForm}
      onSubmit={onSubmit}
      mnemonicValid={mnemonicValid}
      restoring={restoring}
    />
  )
}
