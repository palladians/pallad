import {
  FromBip39MnemonicWordsProps,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { KeyAgents, useVault } from '@palladxyz/vault'
import { act, renderHook } from '@testing-library/react'

import { MinaProvider } from '../../src/Mina'

const PREGENERATED_MNEMONIC = [
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

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('WalletTest', () => {
  let providerConfigurations: Partial<
    Record<Multichain.MultiChainNetworks, Multichain.MultichainProviderConfig>
  >
  let agentArgs: FromBip39MnemonicWordsProps
  const keyAgentName = 'test key agent'

  beforeEach(async () => {
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC
    }

    providerConfigurations = {
      [Mina.Networks.MAINNET]: {
        nodeUrl: 'https://proxy.mainnet.minaexplorer.com/',
        archiveUrl: 'https://mainnet.graphql.minaexplorer.com'
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
    }
  })

  it('should initialise the wallet and the provider should access the account info', async () => {
    const { result } = renderHook(() => useVault())
    // define networks
    await act(async () => {
      await result.current.ensureProvider(
        'Mina Devnet',
        providerConfigurations[Mina.Networks.BERKELEY]!,
        Mina.Networks.BERKELEY
      )
    })
    // add first key agent
    await act(async () => {
      // add first key agent
      await result.current.initialiseKeyAgent(
        keyAgentName,
        KeyAgents.InMemory,
        agentArgs
      )
    })
    const keyAgent1 = result.current.keyAgents[keyAgentName]
    expect(keyAgent1?.keyAgent).toBeDefined()
    // derive credentials for first key agent
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const payload = new MinaPayload()
    const credential = await keyAgent1?.keyAgent!.deriveCredentials(
      payload,
      args,
      getPassphrase,
      true // has to be true as we're not writing the credential to the key agent's serializable data
    )
    const credentialState = {
      credentialName: 'Test Credential',
      keyAgentName: keyAgentName,
      credential: credential
    }
    // add credential to credential store
    act(() => {
      result.current.setCredential(credentialState)
    })

    // get the credential from the store & fetch network data for it
    act(async () => {
      const storedCredential = result.current.getCredential('Test Credential')
      const provider = result.current.getProvider('Mina Devnet')
      const accountInfo = await provider.provider?.getAccountInfo({
        publicKey: storedCredential?.credential?.address as string
      })
      const transactionHistory = await provider.provider?.getTransactions({
        addresses: [storedCredential?.credential?.address as string]
      })
      result.current.ensureAccount(Mina.Networks.BERKELEY, credential?.address)
      result.current.setAccountInfo(
        Mina.Networks.BERKELEY,
        storedCredential?.credential?.address as string,
        accountInfo as Multichain.MultiChainAccountInfo
      )
      result.current.setTransactions(
        Mina.Networks.BERKELEY,
        storedCredential?.credential?.address as string,
        transactionHistory?.pageResults as Multichain.MultiChainTransactionBody[]
      )
    })

    // check that the account info is set
    const cred = result.current.credentials['Test Credential']
    // get list of all addresses in the credentials
    const addresses = Object.values(result.current.credentials).map(
      (cred) => cred?.credential?.address
    )
    expect(cred).toBeDefined()
    console.log('addresses', addresses)

    // initialize the MinaProvider
    const opts = {
      projectId: 'test',
      chains: ['Mina Devnet']
    }
    const provider = await MinaProvider.init(opts)

    expect(provider).toBeDefined()
    const accountAddresses = provider.exampleMethod()
    console.log('accountAddresses', accountAddresses)
    expect(accountAddresses).toEqual(addresses)
  })
})
