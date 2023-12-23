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

describe('Wallet Provider Test', () => {
  let agentArgs: FromBip39MnemonicWordsProps
  let networkType: string
  let provider

  beforeAll(async () => {
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC
    }
    networkType = 'testnet'

    // initialise the vault
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
    provider = await MinaProvider.init(opts)
  })

  beforeEach(() => {
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
  describe('MinaProvider', () => {
    it('should emit connect event on successful connection when using `enable` method', async () => {
      // Listen to the connect event
      const connectListener = vi.fn()
      provider.on('connect', connectListener)

      // Trigger connection
      const result = await provider.enable()
      expect(result).toEqual([
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      ])

      // Assert that the connect event was emitted
      expect(connectListener).toHaveBeenCalledWith({
        chainId:
          '3c41383994b87449625df91769dff7b507825c064287d30fada9286f3f1cb15e'
      })
      expect(provider.isConnected()).toBeTruthy()
    })

    it('should access the account info from provider with `mina_accounts` method', async () => {
      const requestArgs: RequestArguments = {
        method: 'mina_accounts'
      }

      expect(provider).toBeDefined()

      const accountAddresses = await provider.request(requestArgs)
      expect(accountAddresses).toEqual([
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      ])
    })

    it('should sign a message and verify the signature with `mina_sign` method', async () => {
      const message: Mina.MessageBody = {
        message: 'Hello, Bob!'
      }
      const signRequestArgs: RequestArguments = {
        method: 'mina_sign',
        params: message
      }

      const signature = await provider.request(signRequestArgs)
      const minaClient = new Client({
        network: networkType as Mina.NetworkType
      })
      const isVerified = await minaClient.verifyMessage(
        signature as Mina.SignedMessage
      )
      expect(isVerified).toBeTruthy()
    })

    it('should sign fields and verify the signature', async () => {
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
      const signFieldsRequestArgs: RequestArguments = {
        method: 'mina_signFields',
        params: fields
      }

      const signature = await provider.request(signFieldsRequestArgs)
      const minaClient = new Client({
        network: networkType as Mina.NetworkType
      })
      const isVerified = await minaClient.verifyFields(
        signature as Mina.SignedFields
      )
      expect(isVerified).toBeTruthy()
    })

    it('should sign a constructed transaction and verify it', async () => {
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
      const signTxRequestArgs: RequestArguments = {
        method: 'mina_signTransaction',
        params: constructedTx
      }

      const signature = await provider.request(signTxRequestArgs)
      const minaClient = new Client({
        network: networkType as Mina.NetworkType
      })
      const isVerified = await minaClient.verifyTransaction(
        signature as Mina.SignedTransaction
      )
      expect(isVerified).toBeTruthy()
    })

    it('should retrieve the balance successfully', async () => {
      const getBalanceRequestArgs: RequestArguments = {
        method: 'mina_getBalance'
      }

      const balance = await provider.request(getBalanceRequestArgs)
      expect(balance).toBeGreaterThan(0)
    })
  })
  describe('MinaProvider Errors', () => {
    it('should throw ProviderRpcError with code 4001 on user rejection', async () => {
      // Simulate user rejection by mocking the user prompt to return a rejection
      provider.userPrompt = vi.fn().mockResolvedValue(null)

      // Attempt to execute a method that requires user confirmation
      const requestArgs: RequestArguments = { method: 'mina_accounts' }

      await expect(provider.request(requestArgs)).rejects.toEqual(
        expect.objectContaining({ code: 4001 })
      ) // , message: 'User Rejected Request'
    })

    it('should throw ProviderRpcError with code 4001 when user rejects the connection', async () => {
      // Mock user rejection
      provider.userPrompt = vi.fn().mockResolvedValue(false)

      // Attempt to enable and expect an error
      await expect(provider.enable()).rejects.toEqual(
        expect.objectContaining({
          code: 4001,
          message: 'User Rejected Request'
        })
      )
    })

    it('should emit disconnect event with ProviderRpcError code 4900 when not connected', async () => {
      // Set provider as not connected
      provider.connected = false

      // Listen to the disconnect event
      const disconnectListener = vi.fn()
      provider.on('disconnect', disconnectListener)

      // Call the disconnect method
      await provider.disconnect()

      // Assert that the disconnect event was emitted with the correct error
      expect(disconnectListener).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 4900,
          message: 'Disconnected'
        })
      )
    })
  })
})
