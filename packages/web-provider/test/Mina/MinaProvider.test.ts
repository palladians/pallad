import {
  constructTransaction,
  FromBip39MnemonicWordsProps,
  MinaPayload,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { KeyAgents, useVault } from '@palladxyz/vault'
import { act, renderHook } from '@testing-library/react'
import Client from 'mina-signer'
import { vi } from 'vitest'

import { MinaProvider } from '../../src/Mina'
import { RequestArguments } from '../../src/Mina/types'

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
  let networkType: string

  beforeEach(async () => {
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC
    }
    networkType = 'testnet'

    // Mock the global chrome object
    global.chrome = {
      windows: {
        create: vi.fn((options, callback) => {
          // Simulate the creation of a window and immediately invoke the callback
          // with a mock window ID.
          callback({ id: 1234 })
        }) as unknown as typeof chrome.windows.create
      },
      runtime: {
        sendMessage: vi.fn() as unknown as typeof chrome.runtime.sendMessage,
        onMessage: {
          // Mock the addListener to simulate receiving a message with the passphrase
          addListener: vi.fn((listener) => {
            const mockResponse = {
              windowId: 1234,
              userInput: Buffer.from(params.passphrase) // This is the simulated passphrase input
            }
            listener(mockResponse)
          }),
          removeListener: vi.fn()
        } as unknown as typeof chrome.runtime.onMessage
      }
    } as unknown as typeof chrome
  })

  afterEach(() => {
    // Reset the mocks after each test
    vi.resetAllMocks()
  })

  it('should initialise the wallet and the provider should access the account info', async () => {
    const { result } = renderHook(() => useVault())
    // restore wallet
    await act(async () => {
      await result.current.restoreWallet(
        new MinaPayload(),
        {
          network: Network.Mina,
          accountIndex: 0,
          addressIndex: 0,
          networkType: networkType
        },
        Mina.Networks.BERKELEY,
        agentArgs,
        'keyAgent test name',
        KeyAgents.InMemory,
        'credential test name'
      )
    })

    // initialize the MinaProvider
    const opts = {
      projectId: 'test',
      chains: ['Mina Devnet']
    }
    const provider = await MinaProvider.init(opts)

    // Define the request arguments for the 'mina_accounts' method
    const requestArgs: RequestArguments = {
      method: 'mina_accounts'
    }

    // Ensure the provider is defined
    expect(provider).toBeDefined()

    // Call the request function with the appropriate arguments
    provider
      .request(requestArgs)
      .then((accountAddresses) => {
        console.log('accountAddresses', accountAddresses)

        // Compare the received addresses with the expected ones
        expect(accountAddresses).toEqual([
          'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
        ])
      })
      .catch((error) => {
        // Handle any errors here
        console.error('Error fetching account addresses:', error)
      })

    // Sign a message
    // Define the message to be signed
    const message: Mina.MessageBody = {
      message: 'Hello, Bob!'
    }

    // Define the request arguments for the 'mina_sign' method
    const signRequestArgs: RequestArguments = {
      method: 'mina_sign',
      params: message // if this is an array, the signer will throw an error -- TODO: check if this behaviour is correct
    }

    // Call the request function to sign the message
    try {
      const signature = await provider.request(signRequestArgs)
      const minaClient = new Client({
        network: networkType as Mina.NetworkType
      })
      const isVerified = await minaClient.verifyMessage(
        signature as Mina.SignedMessage
      )
      expect(isVerified).toBeTruthy()
    } catch (error) {
      console.error(
        'Error signing message:',
        error instanceof Error ? error.message : error
      )
    }

    // Sign fields
    // Define the fields to be signed
    const fields: Mina.SignableFields = {
      fields: [
        BigInt(10),
        BigInt(20),
        BigInt(30),
        BigInt(340817401),
        BigInt(2091283),
        BigInt(1),
        BigInt(0)
      ]
    }

    // Define the request arguments for the 'mina_signFields' method
    const signFieldsRequestArgs: RequestArguments = {
      method: 'mina_signFields',
      params: fields
    }

    // Call the request function to sign the fields
    try {
      const signature = await provider.request(signFieldsRequestArgs)
      const minaClient = new Client({
        network: networkType as Mina.NetworkType
      })
      const isVerified = await minaClient.verifyFields(
        signature as Mina.SignedFields
      )
      expect(isVerified).toBeTruthy()
    } catch (error) {
      console.error(
        'Error signing fields:',
        error instanceof Error ? error.message : error
      )
    }

    // Sign a constructed transaction
    // Define the transaction to be signed
    const transaction: Mina.TransactionBody = {
      to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      from: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
      fee: 1,
      amount: 100,
      nonce: 0,
      memo: 'hello Bob',
      validUntil: 321,
      type: 'payment'
    }
    const constructedTx: Mina.ConstructedTransaction = constructTransaction(
      transaction,
      Mina.TransactionKind.PAYMENT
    )

    // Define the request arguments for the 'mina_signTransaction' method
    const signTxRequestArgs: RequestArguments = {
      method: 'mina_signTransaction',
      params: constructedTx
    }

    // Call the request function to sign the transaction
    try {
      const signature = await provider.request(signTxRequestArgs)
      const minaClient = new Client({
        network: networkType as Mina.NetworkType
      })
      const isVerified = await minaClient.verifyTransaction(
        signature as Mina.SignedTransaction
      )
      expect(isVerified).toBeTruthy()
    } catch (error) {
      console.error(
        'Error signing transaction:',
        error instanceof Error ? error.message : error
      )
    }

    // get balance
    // Define the request arguments for the 'mina_getBalance' method
    const getBalanceRequestArgs: RequestArguments = {
      method: 'mina_getBalance'
    }

    // Call the request function to get the balance
    try {
      const balance = await provider.request(getBalanceRequestArgs)
      expect(balance).toBeGreaterThan(0)
    } catch (error) {
      console.error(
        'Error getting balance:',
        error instanceof Error ? error.message : error
      )
    }
  })
})
