import {
  ChainSignablePayload,
  ChainSpecificArgs,
  ChainSpecificPayload,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  generateMnemonicWords,
  GroupedCredentials,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import {
  CredentialName,
  KeyAgentName,
  KeyAgents,
  SearchQuery,
  SingleCredentialState,
  StoredCredential,
  useVault
} from '@palladxyz/vault'
import { useState } from 'react'

import { AddressError, NetworkError, WalletError } from '../Errors'
import { NetworkManager } from '../Network'
import { ProviderManager } from '../Provider'
import { getRandomAnimalName } from './'

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
  }
} as const

type UseWalletProps = {
  network: Multichain.MultiChainNetworks
  name: string
}

// TODO: Remove this crap

export const useWallet = ({ network, name }: UseWalletProps) => {
  const [walletNetwork] = useState<Multichain.MultiChainNetworks>(network)
  const [walletName] = useState<string>(name)
  const networkManager = new NetworkManager<Multichain.MultiChainNetworks>(
    NETWORK_CONFIG,
    network
  )
  const providerManager = new ProviderManager<Multichain.MultiChainNetworks>(
    NETWORK_CONFIG
  )
  const getCurrentWallet = useVault((state) => state.getCurrentWallet)
  const setCurrentWallet = useVault((state) => state.setCurrentWallet)
  const keyAgents = useVault((state) => state.keyAgents)
  const initialiseKeyAgent = useVault((state) => state.initialiseKeyAgent)
  const searchCredentials = useVault((state) => state.searchCredentials)
  const setCredential = useVault((state) => state.setCredential)
  const getAccountInfo = useVault((state) => state.getAccountInfo)
  const getTransactions = useVault((state) => state.getTransactions)
  const setTransactions = useVault((state) => state.setTransactions)
  const setAccountInfo = useVault((state) => state.setAccountInfo)

  const credentialAddress = getCurrentWallet()?.credential?.credential?.address

  const currentKeyAgent = getCurrentWallet().keyAgent

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

  const _syncAccountInfo = async (
    network: Multichain.MultiChainNetworks,
    derivedCredential: GroupedCredentials
  ) => {
    if (!derivedCredential) {
      throw new WalletError(
        'Derived credential is undefined in syncAccountInfo method'
      )
    }
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
    setAccountInfo(network, derivedCredential.address, accountInfo)
  }

  const _syncTransactions = async (
    network: Multichain.MultiChainNetworks,
    derivedCredential: GroupedCredentials
  ) => {
    if (!derivedCredential) throw new Error('Derived credential is undefined')
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
    setTransactions(
      network,
      derivedCredential.address,
      transactions.pageResults
    )
  }

  const _syncWallet = async (
    network: Multichain.MultiChainNetworks,
    derivedCredential: StoredCredential
  ) => {
    if (!derivedCredential) {
      throw new WalletError(
        'Derived credential is undefined in syncWallet method'
      )
    }
    if (providerManager.getProvider(network) === null) {
      throw new NetworkError('Mina provider is undefined in syncWallet method')
    }
    await _syncAccountInfo(network, derivedCredential as GroupedCredentials)
    await _syncTransactions(network, derivedCredential as GroupedCredentials)
  }

  const onNetworkChanged = (
    listener: (network: Multichain.MultiChainNetworks) => void
  ) => {
    networkManager.onNetworkChanged(listener)
  }

  const getCurrentNetwork = () => {
    return networkManager.getCurrentNetwork()
  }

  const getKeyAgent = (name: KeyAgentName) => {
    return keyAgents[name] || null
  }

  const switchNetwork = async (network: Multichain.MultiChainNetworks) => {
    const provider = networkManager.getActiveProvider()
    if (!provider)
      throw new NetworkError(
        'Mina provider is undefined in switchNetwork method'
      )
    networkManager.switchNetwork(network)
    const currentWallet = getCurrentWallet()
    if (!currentWallet)
      throw new Error('Current wallet is null, empty or undefined')
    await _syncWallet(network, currentWallet.credential.credential)
  }

  const getCredentials = (query: SearchQuery, props: string[] = []) => {
    return searchCredentials(query, props)
  }

  const getWalletAccountInfo = async () => {
    const currentWallet = getCurrentWallet()
    _validateCurrentWallet(currentWallet.credential)
    const currentNetwork = getCurrentNetwork()
    _validateCurrentNetwork(currentNetwork)
    const walletCredential = currentWallet?.credential
      .credential as GroupedCredentials
    return (
      getAccountInfo(currentNetwork, walletCredential?.address as string)
        ?.accountInfo || null
    )
  }

  const getWalletTransactions = async () => {
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
    const currentNetwork = getCurrentNetwork()
    if (!currentNetwork)
      throw new NetworkError(
        'Current network is null, empty or undefined in getTransactions method'
      )
    return getTransactions(currentNetwork, walletAddress) || null
  }

  const sign = async (signable: ChainSignablePayload) => {
    const currentWallet = getCurrentWallet()
    // use current wallet to sign
    if (!currentWallet?.credential) {
      throw new WalletError(
        'Current wallet is null, empty or undefined in sign method'
      )
    }
    // if (currentKeyAgentName === null) {
    //   throw new WalletError('Key agent name is undefined in sign method')
    // }
    const keyAgent = currentWallet.keyAgent
    if (keyAgent === null) {
      throw new WalletError('Key agent is undefined in sign method')
    }
    const credential = currentWallet.credential.credential as GroupedCredentials
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const signed = await keyAgent?.sign(credential, signable, args)
    return signed
  }

  // TODO: Make this chain agnostic
  const constructTx = async (
    transaction: Mina.TransactionBody,
    kind: Mina.TransactionKind
  ) => {
    return constructTransaction(transaction, kind)
  }

  // This is Mina Specific
  // TODO: Make this chain agnostic
  const submitTx = async (submitTxArgs: SubmitTxArgs) => {
    const currentWallet = getCurrentWallet()
    const network = getCurrentNetwork()
    const txResult = await providerManager
      .getProvider(network)
      ?.submitTransaction(submitTxArgs)
    await _syncTransactions(
      network,
      currentWallet?.credential.credential as GroupedCredentials
    )
    return txResult
  }

  const createWallet = async (strength = 128) => {
    const mnemonic = generateMnemonicWords(strength)
    return { mnemonic }
  }

  const restoreWallet = async <T extends ChainSpecificPayload>(
    payload: T,
    args: ChainSpecificArgs,
    network: Multichain.MultiChainNetworks,
    { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps,
    keyAgentName: KeyAgentName,
    keyAgentType: KeyAgents = KeyAgents.InMemory,
    credentialName: CredentialName = getRandomAnimalName()
  ) => {
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonicWords,
      mnemonic2ndFactorPassphrase: ''
    }
    await initialiseKeyAgent(keyAgentName, keyAgentType, agentArgs)
    const keyAgent = getKeyAgent(keyAgentName)
    console.log(
      '>>>KA',
      keyAgents,
      keyAgent,
      keyAgentName,
      keyAgentType,
      agentArgs
    )
    const derivedCredential = await keyAgent?.keyAgent?.deriveCredentials(
      payload,
      args,
      getPassphrase,
      false
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
    await _syncWallet(network, derivedCredential)
  }

  return {
    walletNetwork,
    walletName,
    restoreWallet,
    createWallet,
    switchNetwork,
    onNetworkChanged,
    getCredentials,
    getWalletAccountInfo,
    getWalletTransactions,
    constructTx,
    submitTx,
    sign,
    currentWallet: getCurrentWallet(),
    credentialAddress,
    currentKeyAgent
  }
}
