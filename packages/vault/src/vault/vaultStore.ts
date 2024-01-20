import {
  constructTransaction,
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  GroupedCredentials,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina, Networks } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { getSecurePersistence } from '@palladxyz/persistence'
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
import { NetworkManager } from '../lib/Network'
import { ProviderManager } from '../lib/Provider'
import { getRandomAnimalName } from '../lib/utils'
import { networkInfoSlice, NetworkInfoStore } from '../network-info'
import { objectSlice, ObjectStore } from '../objects'
import { providerSlice, ProviderStore } from '../providers'
import { GlobalVaultState, GlobalVaultStore } from './vaultState'

const NETWORK_CONFIG = {
  [Mina.Networks.MAINNET]: {
    nodeUrl: 'https://proxy.minaexplorer.com/graphql',
    archiveUrl: 'https://graphql.minaexplorer.com'
  },
  [Mina.Networks.DEVNET]: {
    nodeUrl: 'https://proxy.devnet.minaexplorer.com/',
    archiveUrl: 'https://devnet.graphql.minaexplorer.com'
  },
  [Mina.Networks.BERKELEY]: {
    nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
    archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
  },
  [Mina.Networks.TESTWORLD]: {
    nodeUrl: 'https://proxy.testworld.minaexplorer.com/',
    archiveUrl: 'https://testworld.graphql.minaexplorer.com'
  }
} as const

const networkManager = new NetworkManager<Multichain.MultiChainNetworks>(
  NETWORK_CONFIG,
  Mina.Networks.BERKELEY
)
const providerManager = new ProviderManager<Multichain.MultiChainNetworks>(
  NETWORK_CONFIG
)

const _validateCurrentWallet = (wallet: SingleCredentialState | null) => {
  const credential = wallet?.credential as GroupedCredentials
  if (!wallet || !credential?.address)
    throw new WalletError('Invalid current wallet or address')
}
const _validateCurrentNetwork = (
  network: Multichain.MultiChainNetworks | null
) => {
  if (!network) throw new NetworkError('Invalid current network')
}

const defaultGlobalVaultState: GlobalVaultState = {
  keyAgentName: '',
  credentialName: '',
  currentAccountIndex: 0,
  currentAddressIndex: 0,
  chain: Network.Mina,
  walletName: '',
  walletNetwork: Mina.Networks.BERKELEY
}

export const useVault = create<
  AccountStore &
    CredentialStore &
    KeyAgentStore &
    ProviderStore &
    ObjectStore &
    NetworkInfoStore &
    GlobalVaultStore
>()(
  persist(
    (set, get, store) => ({
      ...accountSlice(set, get, store),
      ...credentialSlice(set, get, store),
      ...keyAgentSlice(set, get, store),
      ...providerSlice(set, get, store),
      ...objectSlice(set, get, store),
      ...networkInfoSlice(set, get, store),
      // TODO: add token Info store
      ...defaultGlobalVaultState,
      // This is now available in the networkInfo store
      // api.networkInfo.setCurrentNetworkInfo(networkName, providerConfigMainnet)
      setChain(chain) {
        return set(
          produce((state) => {
            state.chain = chain
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
      // TODO: simplify this method
      // the credential doesn't need to be returned, nor does the transactions, nor the singleKeyAgentState
      getCurrentWallet() {
        const {
          getKeyAgent,
          keyAgentName,
          getCredential,
          credentialName,
          getAccountInfo,
          walletNetwork
        } = get()
        const singleKeyAgentState = getKeyAgent(keyAgentName)
        const credential = getCredential(credentialName)
        const publicKey = credential.credential?.address ?? ''
        return {
          singleKeyAgentState,
          credential,
          accountInfo: getAccountInfo(walletNetwork, publicKey).accountInfo,
          transactions: [] // TODO: figure out why this is fixed to empty?
        }
      },
      // TODO: remove providerManager
      _syncAccountInfo: async (network, derivedCredential) => {
        if (!derivedCredential) {
          throw new WalletError(
            'Derived credential is undefined in syncAccountInfo method'
          )
        }
        /*
        // TODO: remove providerManager
        // TODO: improve accountInfo store as there are now an array of accounts custom tokens
        // TODO: add a get current account public key method on wallet store
        _syncAccountInfo: async (providerConfig, publicKey) => {
        const { setAccountInfo } = get()
        provider = createMinaProvider(providerConfig)
        const accountInfo = await provider?.getAccountInfo({ publicKey: publickey })
        setAccountInfo(providerConfig.networkName, publickey, accountInfo)
        */
        const provider = providerManager.getProvider(network)
        if (!provider) {
          throw new NetworkError(
            'Mina provider is undefined in syncAccountInfo method'
          )
        }
        const accountInfo = await provider?.getAccountInfo({
          publicKey: derivedCredential.address
        })
        if (!accountInfo) {
          throw new WalletError(
            'Account info is undefined in syncAccountInfo method'
          )
        }
        const { setAccountInfo } = get()
        setAccountInfo(network, derivedCredential.address, accountInfo)
      },
      _syncTransactions: async (network, derivedCredential) => {
        /*
        // TODO: remove providerManager
        _syncTransactions: async (providerConfig, publicKey) => {
        const { setTransactions } = get()
        provider = createMinaProvider(providerConfig)
        const transactions = await provider?.getTransactions({ addresses: [publickey] })
        setTransactions(providerConfig.networkName, publickey, transactions) // note: there is no pagination now
        */
        if (!derivedCredential)
          throw new Error('Derived credential is undefined')
        const provider = providerManager.getProvider(network)
        if (!provider)
          throw new NetworkError(
            'Mina archive provider is undefined in syncTransactions method'
          )
        const transactions = await provider.getTransactions({
          addresses: [derivedCredential.address]
        })
        if (!transactions)
          throw new WalletError(
            'Transactions are undefined in syncTransactions method'
          )
        const { setTransactions } = get()
        setTransactions(
          network,
          derivedCredential.address,
          transactions.pageResults
        )
      },
      _syncWallet: async (network, derivedCredential) => {
        /*
        // TODO: add a get current account public key method on wallet store
        _syncWallet: async () => {
        const { getCurrentNetworkInfo, getCurrentAccountPublicKey } = get()
        const publickey = getCurrentAccountPublicKey()
        const providerConfig = getCurrentNetworkInfo()
        _syncAccountInfo(providerConfig, publickey)
        _syncTransactions(providerConfig, publickey)
        */
        if (!derivedCredential) {
          throw new WalletError(
            'Derived credential is undefined in syncWallet method'
          )
        }
        if (providerManager.getProvider(network) === null) {
          throw new NetworkError(
            'Mina provider is undefined in syncWallet method'
          )
        }
        const { _syncAccountInfo, _syncTransactions } = get()
        await _syncAccountInfo(network, derivedCredential as GroupedCredentials)
        await _syncTransactions(
          network,
          derivedCredential as GroupedCredentials
        )
      },
      getCurrentNetwork: () => {
        /*
          const { getCurrentNetworkInfo } = get()
          const network = getCurrentNetworkInfo().networkName
        */
        return networkManager.getCurrentNetwork()
      },
      switchNetwork: async (network) => {
        /*
          // if the network info is already stored we can just switch to it using the networkName
          switchNetwork: async (networkName) => {
          const { setCurrentNetworkInfo } = get()
          setCurrentNetworkInfo(networkName)
          await _syncWallet()
        */
        const provider = networkManager.getActiveProvider()
        if (!provider)
          throw new NetworkError(
            'Mina provider is undefined in switchNetwork method'
          )
        networkManager.switchNetwork(network)
        const { getCurrentWallet, _syncWallet, ensureAccount } = get()
        const currentWallet = getCurrentWallet()
        if (!currentWallet)
          throw new Error('Current wallet is null, empty or undefined')
        ensureAccount(network, currentWallet.accountInfo.publicKey)
        await _syncWallet(
          network,
          currentWallet.credential.credential as GroupedCredentials
        )
        return set({ currentNetwork: network })
      },
      getCredentials: (query, props = []) => {
        const { searchCredentials } = get()
        return searchCredentials(query, props)
      },
      getWalletAccountInfo: async () => {
        /*
          // TODO: add a get current account public key method on wallet store
          getWalletAccountInfo: async () => {
          const { getCurrentNetworkInfo, getCurrentAccountPublicKey } = get()
          const publickey = getCurrentAccountPublicKey()
          const providerConfig = getCurrentNetworkInfo()
          return getAccountInfo(providerConfig.networkName, publickey)
        */
        const { getCurrentWallet, getCurrentNetwork, getAccountInfo } = get()
        const currentWallet = getCurrentWallet()
        _validateCurrentWallet(currentWallet.credential)
        const currentNetwork = getCurrentNetwork() as Networks
        _validateCurrentNetwork(currentNetwork)
        const walletCredential = currentWallet?.credential
          .credential as GroupedCredentials
        return (
          getAccountInfo(currentNetwork, walletCredential?.address as string)
            ?.accountInfo || null
        )
      },
      getWalletTransactions: async () => {
        /*
          // TODO: add a get current account public key method on wallet store
          getWalletTransactions: async () => {
          const { getCurrentNetworkInfo, getCurrentAccountPublicKey } = get()
          const publickey = getCurrentAccountPublicKey()
          const providerConfig = getCurrentNetworkInfo()
          return getTransactions(providerConfig.networkName, publickey)
        */
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
        const currentNetwork = getCurrentNetwork() as Networks
        if (!currentNetwork)
          throw new NetworkError(
            'Current network is null, empty or undefined in getTransactions method'
          )
        return getTransactions(currentNetwork, walletAddress) || null
      },
      sign: async (signable, getPassphrase) => {
        /*
          We can use the new sign api methods here and leave this
          to the key agent request method to handle the signing
          // TODO add the networkType here too, maybe a util on the ProviderConfig object could work
          sign: async (signable, args, getPassphrase) => {
          const { getKeyAgent, getCurrentCredential } = get()
          const keyAgent = getKeyAgent()
          const credential = getCurrentCredential()
          return keyAgent?.request(keyAgent.keyAgentName, credential, signable, args)
        */
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
        // TODO: the `args` must be an argument to the sign method
        const args: MinaSpecificArgs = {
          network: Network.Mina,
          accountIndex: 0,
          addressIndex: 0,
          // TODO: the network type must be an argument
          networkType: 'testnet'
        }
        const keyAgent = restoreKeyAgent(keyAgentState.name, getPassphrase)
        const signed = await keyAgent?.sign(credential, signable, args)
        return signed
      },
      constructTx: async (transaction, kind) => {
        return constructTransaction(transaction, kind)
      },
      submitTx: async (submitTxArgs) => {
        /*
        const { getCurrentNetworkInfo } = get()
        const providerConfig = getCurrentNetworkInfo()
        const provider = createMinaProvider(providerConfig)
        const txResult = await provider?.submitTransaction(submitTxArgs)
        await _syncTransactions(providerConfig)
        return txResult
        */
        const { getCurrentWallet, getCurrentNetwork, _syncTransactions } = get()
        const currentWallet = getCurrentWallet()
        const network = getCurrentNetwork() as Networks
        const txResult = await providerManager
          .getProvider(network)
          ?.submitTransaction(submitTxArgs)
        await _syncTransactions(
          // TODO: should this not be sync accountinfo & transactions?
          network,
          currentWallet?.credential.credential as GroupedCredentials
        )
        return txResult
      },
      createWallet: async (strength = 128) => {
        const mnemonic = generateMnemonicWords(strength)
        return { mnemonic }
      },
      restoreWallet: async (
        payload,
        args,
        network,
        { mnemonicWords, getPassphrase },
        keyAgentName,
        keyAgentType = KeyAgents.InMemory,
        credentialName = getRandomAnimalName()
      ) => {
        const {
          initialiseKeyAgent,
          restoreKeyAgent,
          setCredential,
          setCurrentWallet,
          _syncWallet,
          ensureAccount
        } = get()
        const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        // TODO: this should be a key agent method? can we simplify this?
        await initialiseKeyAgent(keyAgentName, keyAgentType, agentArgs)
        const keyAgent = restoreKeyAgent(keyAgentName, getPassphrase)
        const derivedCredential = await keyAgent?.deriveCredentials(
          payload,
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
        setCredential(singleCredentialState)
        setCurrentWallet({
          keyAgentName,
          credentialName,
          currentAccountIndex: derivedCredential.accountIndex,
          currentAddressIndex: derivedCredential.addressIndex
        })
        ensureAccount(network, derivedCredential.address)
        getSecurePersistence().setItem('foo', 'bar' as any)
        await _syncWallet(network, derivedCredential)
      },
      restartWallet: () => {
        const {
          getCurrentWallet,
          keyAgentName,
          currentNetwork,
          removeKeyAgent,
          removeAccount,
          removeCredential
        } = get()
        const currentWallet = getCurrentWallet()
        removeAccount(currentNetwork as Networks, '')
        removeKeyAgent(keyAgentName)
        removeCredential(currentWallet.credential.credentialName)
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
