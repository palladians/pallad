import {
  ChainSpecificArgs,
  ChainSpecificPayload,
  //constructTransaction,
  FromBip39MnemonicWordsProps,
  //GroupedCredentials,
  //MinaDerivationArgs,
  MinaPayload,
  Network
} from '@palladxyz/key-management'
//import { Mina } from '@palladxyz/mina-core'
import { act, renderHook } from '@testing-library/react'
import { expect } from 'vitest'

//import Client from 'mina-signer'
//import { Payment, SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { CredentialName, KeyAgents } from '../../src'
import { useVault } from '../../src'
import { DEFAULT_NETWORK } from '../../src/network-info/default'

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
  let agentArgs: FromBip39MnemonicWordsProps
  let network: string
  let args: ChainSpecificArgs
  let payload: ChainSpecificPayload
  let credentialName: CredentialName
  let keyAgentName: string
  let expectedAddress: string
  let defaultNetwork: string

  beforeEach(async () => {
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC
    }
    network = DEFAULT_NETWORK
    args = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    payload = new MinaPayload()
    credentialName = 'Test Suite Credential'
    keyAgentName = 'Test Suite Key Agent'
    expectedAddress = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    defaultNetwork = DEFAULT_NETWORK
  })

  //afterEach(() => {
  //  const {
  //    result: { current }
  //  } = renderHook(() => useVault())
  //  act(() => current.clear())
  //})

  it('should add one key agent its first credential /0/0 and sync the network info', async () => {
    const { result } = renderHook(() => useVault())

    // add first key agent
    await act(async () => {
      // restore wallet
      await result.current.restoreWallet(
        payload,
        args,
        network,
        agentArgs,
        keyAgentName,
        KeyAgents.InMemory,
        credentialName
      )
      // add first key agent
      //await result.current.initialiseKeyAgent(
      //  keyAgentName,
      //  KeyAgents.InMemory,
      //  agentArgs
      //)
      // check that key agent is in the store
      const keyagent = result.current.getKeyAgent(keyAgentName)
      expect(keyagent?.keyAgentType).toEqual(KeyAgents.InMemory)

      // check if chainId has been set and not '...'
      const chainId = await result.current.getChainId()
      console.log('chainId: ', chainId)
      const networkInfos = await result.current.getNetworkInfo(defaultNetwork)
      console.log('networkInfos: ', networkInfos)
      const currentNetworkInfo = await result.current.getCurrentNetworkInfo()
      console.log('currentNetworkInfo: ', currentNetworkInfo)
      expect(chainId).not.toEqual('...')

      // check if first credential is in the store
      const minaCredentials = result.current.getCredentials(
        { type: 'MinaAddress' },
        []
      )
      expect(minaCredentials.length).toEqual(1)
      expect(minaCredentials[0].address).toEqual(expectedAddress)

      // check current network info is of the expected network
      const currentNetwork = result.current.getCurrentNetwork()
      console.log('currentNetwork: ', currentNetwork)
      expect(currentNetwork).toEqual(defaultNetwork)
      // check if accountInfo is in the store
      const accountInfo = result.current.getAccountsInfo(
        defaultNetwork,
        expectedAddress
      )
      console.log('accountInfo', accountInfo)
      expect(accountInfo).toBeDefined()
    })
    // add first credential
    /*const args: ChainSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: 'testnet'
    }
    const credential = await result.current.createCredential(
      keyAgentName,
      new MinaPayload(),
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
    // check that credential is in the store
    expect(result.current.credentials['Test Credential']).toEqual(credentialState)*/

    /*// get the credential from the store & fetch network data for it
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
    const submitTxResult =
      await provider.provider?.submitTransaction(submitTxArgs)
    console.log('submitTxResult: ', submitTxResult)*/
  })
})
