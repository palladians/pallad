import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import {
  AccountStore,
  CredentialStore,
  KeyAgentStore
} from '@palladxyz/vaultv2'
import { keyAgentName } from '@palladxyz/vaultv2'

//import { expect, test } from 'vitest'
import {
  MinaWalletDependencies,
  MinaWalletImpl,
  MinaWalletProps
} from '../src/Wallet'

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let walletProperties: MinaWalletProps
  let network: Mina.Networks
  let keyAgentName: keyAgentName

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
    walletDependencies = {
      accountStore: new AccountStore(),
      keyAgentStore: new KeyAgentStore(),
      credentialStore: new CredentialStore()
    }
    walletProperties = {
      // this is the first network that the wallet will be initialized with
      network: Mina.Networks.BERKELEY,
      name: 'Test Wallet',
      providers: {
        [Mina.Networks.MAINNET]: {
          provider: 'https://proxy.minaexplorer.com/',
          archive: 'https://graphql.minaexplorer.com'
        },
        [Mina.Networks.DEVNET]: {
          provider: 'https://proxy.devnet.minaexplorer.com/',
          archive: 'https://devnet.graphql.minaexplorer.com'
        },
        [Mina.Networks.BERKELEY]: {
          provider: 'https://proxy.berkeley.minaexplorer.com/',
          archive: 'https://berkeley.graphql.minaexplorer.com'
        }
      }
    }

    wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    network = walletProperties.network
    keyAgentName = 'test agent'
  })
  test('switches network berkeley -> devnet', async () => {
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
    await wallet.restoreWallet(
      payload,
      restoreArgs,
      network,
      {
        mnemonicWords: mnemonic,
        getPassphrase: getPassword
      },
      keyAgentName
    )

    // log out the current network
    const currentNetwork = wallet.getCurrentNetwork()
    expect(currentNetwork).toEqual(network)
    // log out the current account info
    const currentAccountInfo = await wallet.getAccountInfo()
    // TODO: add wallet sync when restoring
    expect(currentAccountInfo).toHaveProperty('balance')

    /**
     * Switch the network from berkeley to devnet
     */
    const networkDevnet = Mina.Networks.DEVNET
    // Variable to track if the event was emitted
    let eventEmitted = false

    // Attach the listener
    wallet.onNetworkChanged((network) => {
      if (network === networkDevnet) {
        eventEmitted = true
      }
    })

    await wallet.switchNetwork(networkDevnet)
    // Assert that the event was emitted
    expect(eventEmitted).toBe(true)
    // log out the current network
    const currentNetworkSwitch = wallet.getCurrentNetwork()
    console.log('Switched Current Network:', currentNetworkSwitch)
    expect(currentNetworkSwitch).toEqual(networkDevnet)
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
