import {
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  GroupedCredentials
} from '@palladxyz/key-management'
import {
  constructTransaction,
  Network,
  PalladNetworkNames
} from '@palladxyz/pallad-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createChainProvider } from '@palladxyz/providers'
import { produce } from 'immer'
import { create } from 'zustand'
import { persist, PersistStorage } from 'zustand/middleware'

import { accountSlice, AccountStore } from '../account'
import {
  credentialSlice,
  CredentialStore,
  SingleCredentialState
} from '../credentials'
import { KeyAgents, keyAgentSlice, KeyAgentStore } from '../keyAgent'
import { AddressError, NetworkError, WalletError } from '../lib/Errors'
import { getRandomAnimalName } from '../lib/utils'
import { networkInfoSlice, NetworkInfoStore } from '../network-info'
import { objectSlice, ObjectStore } from '../objects'
import { tokenInfoSlice, TokenInfoStore } from '../token-info'
import { webProviderSlice, WebProviderStore } from '../web-provider'
import {
  getCurrentWalletHelper,
  syncAccountHelper,
  syncTransactionHelper,
  syncWalletnHelper
} from './utils'
import { GlobalVaultState, GlobalVaultStore } from './vaultState'

const _validateCurrentWallet = (wallet: SingleCredentialState | null) => {
  const credential = wallet?.credential as GroupedCredentials
  if (!wallet || !credential?.address)
    throw new WalletError('Invalid current wallet or address')
}
const _validateCurrentNetwork = (network: Network.Mina | null) => {
  if (!network) throw new NetworkError('Invalid current network')
}

const defaultGlobalVaultState: GlobalVaultState = {
  keyAgentName: '',
  credentialName: '',
  currentAccountIndex: 0,
  currentAddressIndex: 0,
  chain: Network.Mina,
  walletName: '',
  walletNetwork: PalladNetworkNames.MINA_BERKELEY,
  knownAccounts: [],
  chainIds: []
}

export const useVault = create<
  AccountStore &
    CredentialStore &
    KeyAgentStore &
    ObjectStore &
    NetworkInfoStore &
    TokenInfoStore &
    WebProviderStore &
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
      ...webProviderSlice(set, get, store),
      ...defaultGlobalVaultState,
      // This is now available in the networkInfo store
      // api.networkInfo.setCurrentNetworkName(networkName)
      setChain(chain) {
        return set(
          produce((state) => {
            state.chain = chain
          })
        )
      },
      setKnownAccounts(address) {
        return set(
          produce((state) => {
            state.knownAccounts = [...state.knownAccounts, address]
          })
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
          })
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
      _syncWallet: async () => {
        await syncWalletnHelper(get)
      },
      getCurrentNetwork: () => {
        const { getCurrentNetworkInfo } = get()
        const network = getCurrentNetworkInfo().networkName
        return network
      },
      // TODO: this must emit an event `chainChanged`
      switchNetwork: async (networkName) => {
        // if the network info is already stored we can just switch to it using the networkName
        //switchNetwork: async (networkName) => {
        const {
          setCurrentNetworkName,
          getCurrentWallet,
          _syncWallet,
          ensureAccount
        } = get()
        const currentWallet = getCurrentWallet()
        if (!currentWallet)
          throw new Error('Current wallet is null, empty or undefined')
        const publicKey =
          await getCurrentWallet()?.credential?.credential?.address // todo: DRY this up
        if (!publicKey)
          throw new AddressError(
            'Wallet address is undefined in switchNetwork method'
          )
        ensureAccount(networkName, publicKey)
        setCurrentNetworkName(networkName)
        await _syncWallet()
      },
      getCredentials: (query, props = []) => {
        const { searchCredentials } = get()
        return searchCredentials(query, props)
      },
      getWalletAccountInfo: () => {
        const { getCurrentWallet, getCurrentNetwork, getAccountsInfo } = get()
        const currentWallet = getCurrentWallet()
        _validateCurrentWallet(currentWallet.credential)
        const currentNetwork = getCurrentNetwork()
        _validateCurrentNetwork(
          currentNetwork as unknown as typeof Network.Mina
        )
        const walletCredential = currentWallet?.credential
          .credential as GroupedCredentials
        return (
          getAccountsInfo(currentNetwork, walletCredential?.address as string)
            ?.accountInfo || null
        )
      },
      getWalletTransactions: () => {
        const { getCurrentWallet, getCurrentNetwork, getTransactions } = get()
        const currentWallet = getCurrentWallet()
        if (!currentWallet)
          throw new WalletError(
            'Current wallet is null, empty or undefined in getTransactions method'
          )
        const walletCredential = currentWallet.credential
          .credential as GroupedCredentials
        const walletAddress = walletCredential?.address
        if (!walletAddress)
          throw new AddressError(
            'Wallet address is undefined in getTransactions method'
          )
        const currentNetwork = getCurrentNetwork() as PalladNetworkNames
        if (!currentNetwork)
          throw new NetworkError(
            'Current network is null, empty or undefined in getTransactions method'
          )
        return getTransactions(currentNetwork, walletAddress, 'MINA') || null
      },
      sign: async (signable, args, getPassphrase) => {
        const { getCurrentWallet, restoreKeyAgent } = get()
        const currentWallet = getCurrentWallet()
        // use current wallet to sign
        if (!currentWallet?.credential) {
          throw new WalletError(
            'Current wallet is null, empty or undefined in sign method'
          )
        }
        if (!currentWallet.singleKeyAgentState) {
          throw new WalletError('Key agent state is not set')
        }
        const keyAgentState = currentWallet.singleKeyAgentState
        if (keyAgentState === null) {
          throw new WalletError('Key agent state is undefined in sign method')
        }
        const credential = currentWallet.credential
          .credential as GroupedCredentials

        const keyAgent = restoreKeyAgent(keyAgentState.name, getPassphrase)
        const signed = await keyAgent?.sign(credential, signable, args)
        return signed
      },
      constructTx: (args) => {
        // TODO: agnostic construct transaction Util that takes any transaction type
        return constructTransaction(args.transaction, args.transactionKind)
      },
      submitTx: async (submitTxArgs) => {
        const { getCurrentNetworkInfo, getCurrentWallet, _syncTransactions } =
          get()
        const providerConfig = getCurrentNetworkInfo()
        const provider = createChainProvider(providerConfig)
        const publicKey = getCurrentWallet().credential.credential?.address
        if (!publicKey)
          throw new AddressError(
            'Wallet address is undefined in submitTx method'
          )
        const txResult = await provider.submitTransaction(submitTxArgs)
        await _syncTransactions(providerConfig, publicKey)
        return txResult
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
        credentialName = getRandomAnimalName()
        // TODO: add providerConfig object here
      ) => {
        const {
          initialiseKeyAgent,
          restoreKeyAgent,
          setCredential,
          setCurrentWallet,
          _syncWallet,
          ensureAccount,
          setKnownAccounts,
          getCurrentNetworkInfo,
          updateNetworkInfo,
          setCurrentNetworkName
        } = get()
        const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        // TODO: this should be a key agent method? can we simplify this?
        await initialiseKeyAgent(keyAgentName, keyAgentType, agentArgs)
        const keyAgent = restoreKeyAgent(keyAgentName, getPassphrase)
        if (!keyAgent)
          throw new WalletError('keyAgent is undefined in restoreWallet method') // TODO: we can derive credential direct from the key Agent Store
        const derivedCredential = await keyAgent?.deriveCredentials(
          args,
          getPassphrase,
          true // has to be true
        )
        if (!derivedCredential)
          throw new WalletError(
            'Derived credential is undefined in restoreWallet method'
          )
        const singleCredentialState: SingleCredentialState = {
          credentialName: credentialName,
          keyAgentName: keyAgentName,
          credential: derivedCredential
        }
        // TODO: set the current network info, restore and create wallet
        // should take some providerConfig object
        setCredential(singleCredentialState)
        setCurrentWallet({
          keyAgentName,
          credentialName,
          currentAccountIndex: derivedCredential.accountIndex,
          currentAddressIndex: derivedCredential.addressIndex
        })
        // set the first known account
        setKnownAccounts(derivedCredential.address)
        // set the chainIds
        const providerConfig = getCurrentNetworkInfo()
        if (!providerConfig) {
          throw new Error(
            `Could not find providerConfig for ${providerConfig} in updateChainId`
          )
        }

        const provider = createChainProvider(providerConfig)
        if (!provider.getNodeStatus) {
          throw new Error(
            `Could not getNodeStatus for ${providerConfig} in updateChainId`
          )
        }

        const response = await provider.getNodeStatus()
        if (!response.daemonStatus.chainId) {
          throw new Error(
            `Could not get chainId for ${providerConfig} in updateChainId`
          )
        }
        updateNetworkInfo(providerConfig.networkName, {
          chainId: response.daemonStatus.chainId
        })
        setCurrentNetworkName(providerConfig.networkName)
        ensureAccount(network, derivedCredential.address)
        getSecurePersistence().setItem('foo', 'bar' as any)
        await _syncWallet()
      },
      restartWallet: () => {
        const {
          getCurrentWallet,
          keyAgentName,
          getCurrentNetwork,
          removeKeyAgent,
          removeAccount,
          removeCredential
        } = get()
        const currentWallet = getCurrentWallet()
        const currentNetwork = getCurrentNetwork()
        removeAccount(currentNetwork as PalladNetworkNames, '')
        removeKeyAgent(keyAgentName)
        removeCredential(currentWallet.credential.credentialName)
      },
      // web provider APIs
      getAccounts: () => {
        return get().knownAccounts
      },
      getBalance: (ticker) => {
        if (!ticker) ticker = 'MINA'
        const { getCurrentWallet, getCurrentNetworkInfo, getAccountInfo } =
          get()
        const currentWallet = getCurrentWallet()
        const currentNetwork = getCurrentNetworkInfo()
        const publicKey = currentWallet.credential.credential?.address
        if (!publicKey)
          throw new AddressError(
            'Wallet address is undefined in getBalance method'
          )
        const accountInfo = getAccountInfo(
          currentNetwork.networkName,
          publicKey,
          ticker
        )
        return accountInfo.balance.total
      },
      getChainId: () => {
        // could also fetch this from the daemon provider
        // TODO: consider syncing the chainId on switchNetwork
        const { getCurrentNetworkInfo } = get()
        const currentNetwork = getCurrentNetworkInfo()
        return currentNetwork.chainId
      }
    }),
    {
      name: 'PalladVault',
      storage:
        import.meta.env['VITE_APP_LADLE'] === 'true'
          ? undefined
          : (getSecurePersistence() as PersistStorage<any>)
    }
  )
)
