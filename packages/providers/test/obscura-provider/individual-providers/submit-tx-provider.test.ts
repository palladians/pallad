import {
  ChainOperationArgs,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina, TokenIdMap } from '@palladxyz/mina-core'
import {
  Payment,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import { Obscura } from '../../../src'

const nodeUrl =
  process.env['OBSCURA_URL'] ||
  'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'

const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

const params = {
  passphrase: 'passphrase'
}
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))

describe('Mina Explorer Submit Transaction Provider (Functional)', () => {
  let provider: ReturnType<typeof Obscura.createTxSubmitProvider>
  let accountInfoProvider: ReturnType<typeof Obscura.createAccountInfoProvider>
  let tokenMap: TokenIdMap
  let networkType: Mina.NetworkType
  let agent: InMemoryKeyAgent
  let mnemonic: string[]

  beforeEach(() => {
    provider = Obscura.createTxSubmitProvider(nodeUrl)
    accountInfoProvider = Obscura.createAccountInfoProvider(nodeUrl)
    tokenMap = {
      MINA: '1'
    }
  })

  beforeAll(async () => {
    mnemonic = [
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
    networkType = 'testnet'
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic,
      mnemonic2ndFactorPassphrase: ''
    }
    agent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: networkType
    }

    await agent.restoreKeyAgent(args, getPassphrase)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe.skip('submitTx', () => {
    it('should return the submitted transaction response', async () => {
      // fetch account info
      const accountInfo = await accountInfoProvider.getAccountInfo({
        publicKey,
        tokenMap
      })

      // construct transaction, sign, and submit
      const amount = 1 * 1e9
      const inferredNonce = accountInfo['MINA']?.inferredNonce ?? 0
      const transaction: Mina.TransactionBody = {
        to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        from: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        fee: 1 * 1e9,
        amount: amount,
        nonce: Number(inferredNonce),
        memo: 'test suite',
        type: 'payment',
        validUntil: 4294967295
      }
      const constructedTx: Mina.ConstructedTransaction = constructTransaction(
        transaction,
        Mina.TransactionKind.PAYMENT
      )
      const credential = agent.serializableData.credentialSubject.contents[0]
      const args: ChainOperationArgs = {
        operation: 'mina_signTransaction',
        network: 'Mina',
        networkType: networkType
      }

      const signedTx = await agent.sign(credential, constructedTx, args)
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
      // This test now depends on the actual response from the server
      const response = await provider.submitTx(submitTxArgs)
      console.log(
        'Mina Explorer Submit Transaction Provider Response',
        response
      )
      //expect(response).toHaveProperty('MINA')
    })
  })

  //TODO: Other tests...
})
