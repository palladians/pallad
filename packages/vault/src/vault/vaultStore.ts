import {
  type ChainDerivationArgs,
  generateMnemonicWords,
} from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
import { produce } from "immer"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { createClient } from "@mina-js/klesia-sdk"
import { TransactionBodySchema } from "@mina-js/utils"
import { utf8ToBytes } from "@noble/hashes/utils"
import { type AccountStore, accountSlice } from "../account"
import {
  type CredentialName,
  type CredentialStore,
  type SingleCredentialState,
  credentialSlice,
} from "../credentials"
import { type KeyAgentStore, KeyAgents, keyAgentSlice } from "../keyAgent"
import { WalletError } from "../lib/Errors"
import { getRandomAnimalName } from "../lib/utils"
import { type NetworkInfoStore, networkInfoSlice } from "../network-info"
import { type ObjectStore, objectSlice } from "../objects"
import { type TokenInfoStore, tokenInfoSlice } from "../token-info"
import { securePersistence, sessionPersistence } from "../utils"
import {
  getBalanceHelper,
  getCurrentWalletHelper,
  getWalletAccountInfoHelper,
  getWalletTransactionsHelper,
  restartWalletHelper,
  restoreWalletHelper,
  signHelper,
  switchNetworkHelper,
  syncAccountHelper,
  syncTransactionHelper,
  syncWalletHelper,
} from "./utils"
import type { GlobalVaultState, GlobalVaultStore } from "./vaultState"

const defaultGlobalVaultState: GlobalVaultState = {
  keyAgentName: "",
  credentialName: "",
  currentAccountIndex: 0,
  currentAddressIndex: 0,
  chain: Network.Mina,
  walletName: "",
  walletNetworkId:
    (process.env.VITE_APP_DEFAULT_NETWORK_ID ?? "mina:mainnet") ===
    "mina:mainnet"
      ? "mina:mainnet"
      : "mina:devnet",
  knownAccounts: [],
  chainIds: [],
}

export const useVault = create<
  AccountStore &
    CredentialStore &
    KeyAgentStore &
    ObjectStore &
    NetworkInfoStore &
    TokenInfoStore &
    GlobalVaultStore
>()(
  persist(
    (set, get, store) => ({
      ...accountSlice(set, get, store),
      ...credentialSlice(set, get, store),
      ...keyAgentSlice(set, get, store),
      ...objectSlice(set, get, store),
      ...networkInfoSlice(set, get, store),
      ...tokenInfoSlice(set, get, store),
      ...defaultGlobalVaultState,
      // This is now available in the networkInfo store
      // api.networkInfo.setCurrentNetworkName(networkName)
      setChain(chain) {
        return set(
          produce((state) => {
            state.chain = chain
          }),
        )
      },
      setKnownAccounts(address) {
        return set(
          produce((state) => {
            state.knownAccounts = [...state.knownAccounts, address]
          }),
        )
      },
      // TODO: create a new store for wallet?
      setCurrentWallet(payload) {
        return set(
          produce((state) => {
            state.keyAgentName = payload.keyAgentName
            state.credentialName = payload.credentialName
            state.currentAccountIndex = payload.currentAccountIndex
            state.currentAddressIndex = payload.currentAddressIndex
          }),
        )
      },
      // the credential doesn't need to be returned, nor does the transactions, nor the singleKeyAgentState
      getCurrentWallet() {
        return getCurrentWalletHelper(get)
      },
      deriveNewAccount: async () => {
        const {
          restoreKeyAgent,
          keyAgentName,
          knownAccounts,
          setKnownAccounts,
          addAccount,
          getNetworkId,
          setCurrentWallet,
          setCredential,
        } = get()
        const spendingPassword =
          (await sessionPersistence.getItem("spendingPassword")) || ""
        const getPassphrase = () => utf8ToBytes(spendingPassword)
        await useVault.persist.rehydrate()
        const keyAgent = restoreKeyAgent(keyAgentName, getPassphrase)
        if (!keyAgent)
          throw new WalletError("keyAgent is undefined in restoreWallet method")
        await useVault.persist.rehydrate()

        const args: ChainDerivationArgs = {
          network: Network.Mina,
          accountIndex: knownAccounts.length + 1,
          addressIndex: knownAccounts.length + 1,
        }

        const derivedCredential = await keyAgent?.deriveCredentials(
          args,
          getPassphrase,
          true, // has to be true
        )
        if (!derivedCredential)
          throw new WalletError(
            "Derived credential is undefined in restoreWallet method",
          )

        const credentialName: CredentialName = getRandomAnimalName()
        const singleCredentialState: SingleCredentialState = {
          credentialName: credentialName,
          keyAgentName: keyAgentName,
          credential: derivedCredential,
        }

        setCredential(singleCredentialState)

        setCurrentWallet({
          keyAgentName,
          credentialName,
          currentAccountIndex: 1,
          currentAddressIndex: 1,
        })

        setKnownAccounts(derivedCredential.address)
        addAccount(getNetworkId(), derivedCredential.address)
      },
      _syncAccountInfo: async (providerConfig, publicKey) => {
        await syncAccountHelper(get, providerConfig, publicKey)
      },
      _syncTransactions: async (providerConfig, publicKey) => {
        await syncTransactionHelper(get, providerConfig, publicKey)
      },
      _syncWallet: async (networkId) => {
        await syncWalletHelper(get, networkId)
      },
      getCurrentNetworkId: () => {
        const { currentNetworkId } = get()
        return currentNetworkId
      },
      // TODO: this must emit an event `chainChanged`
      switchNetwork: async (networkId) => {
        await switchNetworkHelper(get, networkId)
      },
      getCredentials: (query, props = []) => {
        const { searchCredentials } = get()
        return searchCredentials(query, props)
      },
      getWalletAccountInfo: () => {
        getWalletAccountInfoHelper(get)
      },
      getWalletTransactions: () => {
        return getWalletTransactionsHelper(get)
      },
      sign: async (signable, args, getPassphrase) => {
        return await signHelper(get, signable, args, getPassphrase)
      },
      constructTx: (args) => {
        return TransactionBodySchema.parse(args.transaction)
      },
      submitTx: async ({ signedTransaction, type }) => {
        const { currentNetworkId } = get()
        const networkName =
          currentNetworkId === "mina:mainnet" ? "mainnet" : "devnet"
        const klesia = createClient({ network: networkName })
        const result = await klesia.request<"mina_sendTransaction">({
          method: "mina_sendTransaction",
          params: [
            {
              input: signedTransaction.data as never,
              signature: signedTransaction.signature,
            },
            type as "payment" | "delegation",
          ],
        })
        return result
      },
      createWallet: (strength = 128) => {
        const mnemonic = generateMnemonicWords(strength)
        return { mnemonic }
      },
      restoreWallet: async (
        args,
        network,
        { mnemonicWords, getPassphrase },
        keyAgentName,
        keyAgentType = KeyAgents.InMemory,
        credentialName = getRandomAnimalName(),
        // TODO: add providerConfig object here
      ) => {
        await restoreWalletHelper(
          get,
          args,
          network,
          { mnemonicWords, getPassphrase },
          keyAgentName,
          keyAgentType,
          credentialName,
        )
      },
      restartWallet: () => {
        restartWalletHelper(get)
      },
      // web provider APIs
      getAccounts: () => {
        return get().knownAccounts
      },
      getBalance: (ticker) => {
        return getBalanceHelper(get, ticker)
      },
      getNetworkId: () => {
        const { currentNetworkId } = get()
        return currentNetworkId
      },
    }),
    {
      name: "PalladVault",
      storage: createJSONStorage(() => securePersistence),
    },
  ),
)
