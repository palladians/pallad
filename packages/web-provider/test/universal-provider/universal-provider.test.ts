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

import { RequestArguments } from '../../src'
import { UniversalProvider } from '../../src/universal-provider'

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
const passphrase_params = {
  passphrase: 'passphrase'
}
const getPassphrase = async () => Buffer.from(passphrase_params.passphrase)

describe.skip('Wallet Provider Test', () => {
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
    provider = new UniversalProvider(opts)
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
              userInput: Buffer.from(passphrase_params.passphrase) // This is the simulated passphrase input
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
  describe('Universal Provider -- Mina Instance', () => {
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
          'fd7d111973bf5a9e3e87384f560fdead2f272589ca00b6d9e357fca9839631da'
      })
      expect(provider.isConnected()).toBeTruthy()
    })

    it('should get the chainId with `mina_chainId` method', async () => {
      const requestArgs: RequestArguments = {
        method: 'mina_chainId'
      }

      expect(provider).toBeDefined()

      const chainId = await provider.request(requestArgs)
      console.log('chainId in test: ', chainId)
      expect(chainId).toEqual(
        'fd7d111973bf5a9e3e87384f560fdead2f272589ca00b6d9e357fca9839631da'
      )
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
  describe('Universal Provider -- MinaProvider Errors', () => {
    it('should throw ProviderRpcError with code 4200 when the method is not supported', async () => {
      // Attempt to execute a method that is not supported
      const requestArgs: RequestArguments = { method: 'mina_notSupported' }

      await expect(provider.request(requestArgs)).rejects.toEqual(
        expect.objectContaining({
          code: 4200,
          message: 'Unsupported Method',
          name: 'ProviderRpcError'
        })
      )
    })
  })
})
