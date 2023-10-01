import {
  GetPassphrase,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import {
  MinaWalletDependencies,
  MinaWalletImpl,
  MinaWalletProps,
  NetworkManager,
  ProviderManager,
  ProvidersConfig
} from '@palladxyz/mina-wallet'
import { Multichain } from '@palladxyz/multi-chain-core'
import {
  AccountStore,
  CredentialStore,
  keyAgentName,
  KeyAgentStore
} from '@palladxyz/vault'

import { MinaProvider } from '../../src/Mina'

const nodeUrl = 'https://proxy.devnet.minaexplorer.com/'
const archiveUrl = 'https://devnet.graphql.minaexplorer.com'

describe('MinaWalletImpl', () => {
  let wallet: MinaWalletImpl
  let walletDependencies: MinaWalletDependencies
  let walletProperties: MinaWalletProps
  let network: Multichain.MultiChainNetworks
  let keyAgentName: keyAgentName
  let networkConfigurations: ProvidersConfig

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
    networkConfigurations = {
      [Mina.Networks.MAINNET]: {
        nodeUrl: nodeUrl,
        archiveUrl: archiveUrl
      },
      [Mina.Networks.DEVNET]: {
        nodeUrl: 'https://proxy.devnet.minaexplorer.com/',
        archiveUrl: 'https://devnet.graphql.minaexplorer.com'
      },
      [Mina.Networks.BERKELEY]: {
        nodeUrl: 'https://proxy.berkeley.minaexplorer.com/',
        archiveUrl: 'https://berkeley.graphql.minaexplorer.com'
      }
    }
    walletDependencies = {
      // stores
      accountStore: new AccountStore(),
      keyAgentStore: new KeyAgentStore(),
      credentialStore: new CredentialStore(),
      // managers
      networkManager: new NetworkManager<Multichain.MultiChainNetworks>(
        networkConfigurations,
        Mina.Networks.BERKELEY
      ),
      providerManager: new ProviderManager<Multichain.MultiChainNetworks>(
        networkConfigurations
      )
    }
    walletProperties = {
      network: Mina.Networks.BERKELEY,
      name: 'Test Wallet'
    }

    wallet = new MinaWalletImpl(walletProperties, walletDependencies)
    network = walletProperties.network
    keyAgentName = 'test agent'
  })
  test('Restores a wallet', async () => {
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

    // check there exists the first account and address in the keyAgent not in the .serializableKeyAgentData knownCredentials
    const derivedCredential = wallet.getCurrentWallet()
    expect(derivedCredential).toBeDefined()

    // create MinaProvider
    const provider = await MinaProvider.init(
      {
        chains: [Mina.Networks.BERKELEY],
        optionalChains: [],
        rpcMap: {}, // TODO
        projectId: 'pallad'
      },
      wallet
    )

    // connect to MinaProvider
    const connected = await provider.enable()
    console.log('connected:', connected)
    expect(connected).toBeDefined()
  })
})
