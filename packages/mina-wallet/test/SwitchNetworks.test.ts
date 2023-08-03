import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
//import { Mina, SubmitTxArgs } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'
import { keyAgentStore } from '@palladxyz/vault'
import { expect, test } from 'vitest' // eslint-disable-line import/no-extraneous-dependencies

import { MinaWalletDependencies, MinaWalletImpl } from '../src/Wallet'
const nodeUrl = 'https://proxy.minaexplorer.com/'
const archiveUrl = 'https://graphql.minaexplorer.com'
describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let provider: MinaProvider
  let providerArchive: MinaArchiveProvider
  let network: Mina.Networks

  const getPassword: GetPassphrase = async () => Buffer.from('passphrase')
  const mnemonic = [
    'habit',
    'hope',
    'tip',
    'crystal',
    'because',
    'grunt',
    'nation',
    'idea',
    'electric',
    'witness',
    'alert',
    'like'
  ]

  beforeEach(() => {
    provider = new MinaProvider(nodeUrl)
    providerArchive = new MinaArchiveProvider(archiveUrl)

    walletDependencies = {
      keyAgent: keyAgentStore.getState().keyAgent,
      minaProvider: provider,
      minaArchiveProvider: providerArchive,
      network: Network.Mina
    }
    wallet = new MinaWalletImpl({ name: 'Test Wallet' }, walletDependencies)
    network = Mina.Networks.MAINNET
  })
  test('switches network mainnet -> devnet', async () => {
    /**
     * Restore the wallet
     */
    const restoreArgs: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    await wallet.restoreWallet(payload, restoreArgs, network, {
      mnemonicWords: mnemonic,
      getPassphrase: getPassword
    })
    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const storeKeyAgentCredentials =
      keyAgentStore.getState().keyAgent?.serializableData.credentialSubject
        .contents
    expect(storeKeyAgentCredentials).toHaveLength(1)

    // log out the current network
    const currentNetwork = wallet.getCurrentNetwork()
    expect(currentNetwork).toEqual(network)
    // log out the current account info
    const currentAccountInfo = await wallet.getAccountInfo()
    expect(currentAccountInfo).toHaveProperty('balance')

    /**
     * Switch the network from devnet to mainnet
     */
    const nodeUrlMainnet = 'https://proxy.devnet.minaexplorer.com/'
    const archiveUrlMainnet = 'https://devnet.graphql.minaexplorer.com'
    const networkMainnet = Mina.Networks.MAINNET
    await wallet.switchNetwork(
      networkMainnet,
      nodeUrlMainnet,
      archiveUrlMainnet
    )
    // log out the current network
    const currentNetworkSwitch = wallet.getCurrentNetwork()
    console.log('Switched Current Network:', currentNetworkSwitch)
    expect(currentNetworkSwitch).toEqual(networkMainnet)
    // log out the current account info
    const currentAccountInfoSwitch = await wallet.getAccountInfo()
    console.log('Switched Current Account Info:', currentAccountInfoSwitch)
    expect(currentAccountInfoSwitch).toHaveProperty('balance')

    // expect currentAccountInfoSwitch balance.total to be different from currentAccountInfo balance.total
    expect(currentAccountInfoSwitch?.balance.total).not.toEqual(
      currentAccountInfo?.balance.total
    )
  })
})
