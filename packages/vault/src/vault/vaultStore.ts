import { generateMnemonicWords } from "@palladxyz/key-management"
import { Network, PalladNetworkNames } from "@palladxyz/pallad-core"
import { produce } from "immer"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { createClient } from "@mina-js/klesia-sdk"
import { TransactionBodySchema } from "@mina-js/utils"
import { type AccountStore, accountSlice } from "../account"
import { type CredentialStore, credentialSlice } from "../credentials"
import { type KeyAgentStore, KeyAgents, keyAgentSlice } from "../keyAgent"
import { getRandomAnimalName } from "../lib/utils"
import { type NetworkInfoStore, networkInfoSlice } from "../network-info"
import { type ObjectStore, objectSlice } from "../objects"
import { type TokenInfoStore, tokenInfoSlice } from "../token-info"
import { securePersistence } from "../utils"
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
  syncWalletnHelper,
} from "./utils"
import type { GlobalVaultState, GlobalVaultStore } from "./vaultState"

const defaultGlobalVaultState: GlobalVaultState = {
  keyAgentName: "",
  credentialName: "",
  currentAccountIndex: 0,
  currentAddressIndex: 0,
  chain: Network.Mina,
  walletName: "",
  walletNetwork:
    (process.env.VITE_APP_DEFAULT_NETWORK ?? "Mainnet") === "Mainnet"
      ? PalladNetworkNames.MINA_MAINNET
      : PalladNetworkNames.MINA_DEVNET,
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
      _syncAccountInfo: async (providerConfig, publicKey) => {
        await syncAccountHelper(get, providerConfig, publicKey)
      },
      _syncTransactions: async (providerConfig, publicKey) => {
        await syncTransactionHelper(get, providerConfig, publicKey)
      },
      _syncWallet: async (networkName) => {
        await syncWalletnHelper(get, networkName)
      },
      getCurrentNetwork: () => {
        const { getCurrentNetworkInfo } = get()
        const network = getCurrentNetworkInfo().networkName
        return network
      },
      // TODO: this must emit an event `chainChanged`
      switchNetwork: async (networkName) => {
        await switchNetworkHelper(get, networkName)
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
        const { currentNetworkName } = get()
        const networkName =
          currentNetworkName === "Mainnet" ? "mainnet" : "devnet"
        const klesia = createClient({ network: networkName })
        const { result } = await klesia.request<"mina_sendTransaction">({
          method: "mina_sendTransaction",
          params: [
            {
              input: signedTransaction.data,
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
      getChainId: () => {
        // could also fetch this from the daemon provider
        // TODO: consider syncing the chainId on switchNetwork
        const { getCurrentNetworkInfo } = get()
        const currentNetwork = getCurrentNetworkInfo()
        return currentNetwork.chainId
      },
    }),
    {
      name: "PalladVault",
      storage: createJSONStorage(() => securePersistence),
    },
  ),
)
