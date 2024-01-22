import {
  constructTransaction,
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  GroupedCredentials,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { AccountInfo, Mina, Networks } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createMinaProvider } from '@palladxyz/providers'
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
import { GlobalVaultState, GlobalVaultStore } from './vaultState'

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
  walletNetwork: Mina.Networks.BERKELEY,
  knownAccounts: [],
  chainIds: []
}

export const useVault = create<
  AccountStore &
    CredentialStore &
    KeyAgentStore &
    ObjectStore &
    NetworkInfoStore &
    GlobalVaultStore
>()(
  persist(
    (set, get, store) => ({
      ...accountSlice(set, get, store),
      ...credentialSlice(set, get, store),
      ...keyAgentSlice(set, get, store),
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
      // TODO: simplify this method
      // the credential doesn't need to be returned, nor does the transactions, nor the singleKeyAgentState
      getCurrentWallet() {
        const {
          getKeyAgent,
          keyAgentName,
          getCredential,
          credentialName,
          getAccountInfo,
          getCurrentNetworkInfo
        } = get()
        const singleKeyAgentState = getKeyAgent(keyAgentName)
        const credential = getCredential(credentialName)
        const publicKey = credential.credential?.address ?? ''
        const providerConfig = getCurrentNetworkInfo()
        const accountInfo = getAccountInfo(
          providerConfig.networkName,
          publicKey
        )

        return {
          singleKeyAgentState,
          credential,
          accountInfo: accountInfo.accountInfo,
          transactions: accountInfo.transactions
        }
      },
      _syncAccountInfo: async (providerConfig, publicKey) => {
        // TODO: improve accountInfo store as there are now a record of custom token tickers -> account infos
        //_syncAccountInfo: async (providerConfig, publicKey) => {
        const { setAccountInfo } = get() // TODO: add getTokenIdMap
        const provider = createMinaProvider(providerConfig)
        const accountInfo = await provider.getAccountInfo({
          publicKey: publicKey,
          tokenMap: { MINA: '1' }
        })
        setAccountInfo(
          providerConfig.networkName,
          publicKey,
          accountInfo as Record<string, AccountInfo>
        ) // TODO: remove cast
      },
      _syncTransactions: async (providerConfig, publicKey) => {
        // TODO: remove providerManager
        //_syncTransactions: async (providerConfig, publicKey) => {
        const { setTransactions } = get()
        const provider = createMinaProvider(providerConfig)
        const transactions = await provider.getTransactions({
          addresses: [publicKey]
        })
        const transactionsRecord = {
          MINA: transactions as Mina.TransactionBody[]
        } // TODO: replace with util using tokeId map to map transactions to tokens
        setTransactions(
          providerConfig.networkName,
          publicKey,
          transactionsRecord
        ) // note: there is no pagination now
      },
      _syncWallet: async () => {
        // TODO: add a get current account public key method on wallet store
        // _syncWallet: async () => {
        const {
          getCurrentNetworkInfo,
          getCurrentWallet,
          _syncAccountInfo,
          _syncTransactions
        } = get()
        const publicKey = getCurrentWallet()?.credential?.credential?.address // todo: DRY this up
        if (!publicKey)
          throw new AddressError(
            'Wallet address is undefined in _syncWallet method'
          )
        const providerConfig = getCurrentNetworkInfo()
        await _syncAccountInfo(providerConfig, publicKey)
        await _syncTransactions(providerConfig, publicKey)
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
          setCurrentNetworkInfo,
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
        setCurrentNetworkInfo(networkName)
        await _syncWallet()
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
          return getAccountInfo(providerConfig.networkName, publickey).accountInfo['MINA]
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
          return getTransactions(providerConfig.networkName, publickey).transactions['MINA]
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
        return getTransactions(currentNetwork, walletAddress, 'MINA') || null
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
        const { getCurrentNetworkInfo, getCurrentWallet, _syncTransactions } =
          get()
        const providerConfig = getCurrentNetworkInfo()
        const provider = createMinaProvider(providerConfig)
        const publicKey = getCurrentWallet().credential.credential?.address
        if (!publicKey)
          throw new AddressError(
            'Wallet address is undefined in submitTx method'
          )
        const txResult = await provider.submitTransaction(submitTxArgs)
        await _syncTransactions(providerConfig, publicKey)
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
          ensureAccount,
          setKnownAccounts
        } = get()
        const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        // TODO: this should be a key agent method? can we simplify this?
        await initialiseKeyAgent(keyAgentName, keyAgentType, agentArgs)
        const keyAgent = restoreKeyAgent(keyAgentName, getPassphrase)
        // TODO: we can derive credential direct from the key Agent Store
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
        //const providerConfig = getCurrentNetworkInfo()
        // const provider = createMinaProvider(providerConfig)
        // const chainId = await provider.getChainId()
        // setChainIds(chainId)
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
        removeAccount(currentNetwork as Networks, '')
        removeKeyAgent(keyAgentName)
        removeCredential(currentWallet.credential.credentialName)
      },
      // web provider APIs
      getAccounts: async () => {
        return get().knownAccounts
      },
      getBalance: async () => {
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
          publicKey
        )
        return accountInfo.accountInfo['MINA']?.balance.total
      },
      getChainId: async () => {
        // fetch chainId from a DaemonStatus provider
        return 'chainId'
      },
      getChainIds: async () => {
        return ['chainId1', 'chainId2']
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
