import {
  FromBip39MnemonicWordsProps,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { act, renderHook } from '@testing-library/react'

import { KeyAgents } from '../../src'
import { useVault } from '../../src'

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
      }
    }
  })

  //afterEach(() => {
  //  const {
  //    result: { current }
  //  } = renderHook(() => useVault())
  //  act(() => current.clear())
  //})

  it('should add one key agent its first credential /0/0 and sync the network info', async () => {
    const { result } = renderHook(() => useVault())
    // define networks
    await act(async () => {
      await result.current.ensureProvider(
        'Mina Devnet',
        providerConfigurations[Mina.Networks.DEVNET]!,
        Mina.Networks.DEVNET
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
      getPassphrase
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
      result.current.setAccountInfo(
        Mina.Networks.DEVNET,
        storedCredential?.credential?.address as string,
        accountInfo as Multichain.MultiChainAccountInfo
      )
      result.current.setTransactions(
        Mina.Networks.DEVNET,
        storedCredential?.credential?.address as string,
        transactionHistory?.pageResults as Multichain.MultiChainTransactionBody[]
      )
    })
    // check that all data is in the store
    const provider = result.current.getProvider('Mina Devnet')
    const accountInfo = await provider.provider?.getAccountInfo({
      publicKey: credential?.address as string
    })
    console.log('account info result: ', accountInfo)
    expect(result.current.credentials['Test Credential']).toBeDefined()
    expect(
      result.current.getAccountInfo(Mina.Networks.DEVNET, credential?.address)
    ).toBeDefined()
    expect(
      result.current.getTransactions(Mina.Networks.DEVNET, credential?.address)
    ).toBeDefined()
    console.log('credential: ', result.current.credentials['Test Credential'])
    console.log(
      'account info: ',
      result.current.getAccountInfo(Mina.Networks.DEVNET, credential?.address)
    )
    console.log(
      'transactions: ',
      result.current.getTransactions(Mina.Networks.DEVNET, credential?.address)
    )
  })
})
