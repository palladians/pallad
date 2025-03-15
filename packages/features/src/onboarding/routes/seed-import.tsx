import { validateMnemonic, wordlist } from "@palladco/key-management"
import type { ChainDerivationArgs } from "@palladco/key-management"
import { Network } from "@palladco/pallad-core"
import { sessionPersistence } from "@palladco/vault"
import { DEFAULT_NETWORK, KeyAgents, useVault } from "@palladco/vault"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { shallow } from "zustand/shallow"

import { useAppStore } from "@/common/store/app"
import { useOnboardingStore } from "@/common/store/onboarding"

import { utf8ToBytes } from "@noble/hashes/utils"
import type { MnemonicInputData } from "../types"
import { SeedImportView } from "../views/seed-import"

export const SeedImportRoute = () => {
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
    sessionPersistence.setItem("spendingPassword", spendingPassword)
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
          getPassphrase: () => utf8ToBytes(spendingPassword),
        },
        walletName,
        KeyAgents.InMemory,
        "Personal", // TODO: make this a configurable credential name or random if not provided
      )
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
