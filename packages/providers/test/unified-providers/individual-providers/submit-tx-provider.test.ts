import {
  ChainOperationArgs,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
  MinaPayload,
  MinaSpecificArgs,
  Network
} from '@palladxyz/key-management'
import { Mina, TokenIdMap } from '@palladxyz/mina-core'
import {
  Payment,
  SignedLegacy
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'

import {
  createAccountInfoProvider,
  createTxSubmitProvider,
  ProviderConfig
} from '../../../src'

const minaExplorerUrl =
  process.env['NODE_URL'] || 'https://proxy.berkeley.minaexplorer.com/'

const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

const params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(params.passphrase)

describe('Unified Submit Transaction Provider (Functional)', () => {
  let provider: ReturnType<typeof createTxSubmitProvider>
  let accountInfoProvider: ReturnType<typeof createAccountInfoProvider>
  let tokenMap: TokenIdMap
  let networkType: Mina.NetworkType
  let agent: InMemoryKeyAgent
  let mnemonic: string[]
  let configMinaExplorer: ProviderConfig
  //let configObscura: ProviderConfig // TODO: add Obscura tests

  beforeEach(() => {
    configMinaExplorer = {
      providerName: 'mina-explorer',
      networkName: 'berkeley',
      url: minaExplorerUrl,
      chainId: '...'
    }
    provider = createTxSubmitProvider(configMinaExplorer)
    accountInfoProvider = createAccountInfoProvider(configMinaExplorer)
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
    const payload = new MinaPayload()

    await agent.restoreKeyAgent(payload, args, getPassphrase)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })
  // TODO: use different mnemonic for this test -- else there are two duplicate transactions
  describe('submitTx', () => {
    it('should return the submitted transaction response', async () => {
      // fetch account info
      const accountInfo = await accountInfoProvider.getAccountInfo({
        publicKey,
        tokenMap
      })
      console.log('Account Info', accountInfo)
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
      console.log('Credential', credential)
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
    })
  })

  //TODO: Add Obscura tests
})
