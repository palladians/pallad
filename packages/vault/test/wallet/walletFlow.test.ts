import {
  constructTransaction,
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { Multichain } from '@palladxyz/multi-chain-core'
import { act, renderHook } from '@testing-library/react'
import Client from 'mina-signer'
import {
  Payment,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'

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
      },
      [Mina.Networks.TESTWORLD]: {
        nodeUrl: 'https://proxy.testworld.minaexplorer.com/',
        archiveUrl: 'https://testworld.graphql.minaexplorer.com'
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
        'Mina BERKELEY',
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
    // check that all data is in the store
    const provider = result.current.getProvider('Mina Devnet')
    const accountInfo = await provider.provider?.getAccountInfo({
      publicKey: credential?.address as string
    })
    console.log('account info result: ', accountInfo)
    expect(result.current.credentials['Test Credential']).toBeDefined()
    expect(
      result.current.getAccountInfo(Mina.Networks.BERKELEY, credential?.address)
    ).toBeDefined()
    expect(
      result.current.getTransactions(
        Mina.Networks.BERKELEY,
        credential?.address
      )
    ).toBeDefined()
    const groupedCredential = result.current.credentials['Test Credential']
    console.log('credential: ', groupedCredential)
    console.log(
      'account info: ',
      result.current.getAccountInfo(Mina.Networks.BERKELEY, credential?.address)
    )
    console.log(
      'transactions: ',
      result.current.getTransactions(
        Mina.Networks.BERKELEY,
        credential?.address
      )
    )
    // construct transaction, sign, and submit
    const amount = 1 * 1e9
    const inferredNonce = accountInfo?.inferredNonce ?? 0
    const transaction: Mina.TransactionBody = {
      to: groupedCredential!.credential!.address,
      from: groupedCredential!.credential!.address,
      fee: 1 * 1e9,
      amount: amount,
      nonce: Number(inferredNonce),
      memo: 'hello Bob',
      type: 'payment',
      validUntil: 4294967295
    }
    const constructedTx: Mina.ConstructedTransaction = constructTransaction(
      transaction,
      Mina.TransactionKind.PAYMENT
    )

    // get key agent
    const instance = keyAgent1?.keyAgent
    const signedTx = await instance!.sign(
      groupedCredential?.credential as GroupedCredentials,
      constructedTx,
      args
    )

    const minaClient = new Client({ network: args.networkType })
    const paymentIsVerified = minaClient.verifyPayment(
      signedTx as SignedLegacy<Payment>
    )
    console.log('paymentIsVerified: ', paymentIsVerified)
    expect(paymentIsVerified).toBeTruthy()
    const isVerified = minaClient.verifyTransaction(
      signedTx as Mina.SignedTransaction
    )
    expect(isVerified).toBeTruthy()
    console.log('isVerified: ', isVerified)
    console.log('signedTx: ', signedTx)

    // submit transaction
    const submitTxArgs = {
      signedTransaction: signedTx as unknown as SignedLegacy<Payment>, // or SignedLegacy<Common>
      kind: Mina.TransactionKind.PAYMENT,
      transactionDetails: {
        fee: transaction.fee,
        to: transaction.to,
        from: transaction.from,
        nonce: transaction.nonce,
        memo: transaction.memo,
        amount: transaction.amount,
        validUntil: transaction.validUntil
      }
    }
    // Note: If there is a pending transaction, this will fail -- good nonce management is needed
    const submitTxResult = await provider.provider?.submitTransaction(
      submitTxArgs
    )
    console.log('submitTxResult: ', submitTxResult)
  })
})
