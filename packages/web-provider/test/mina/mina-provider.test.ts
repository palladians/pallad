import {
  ChainSpecificArgs,
  ChainSpecificPayload,
  constructTransaction,
  FromBip39MnemonicWordsProps,
  MinaPayload,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import {
  CredentialName,
  DEFAULT_NETWORK,
  KeyAgents,
  useVault
} from '@palladxyz/vault'
import { act, renderHook } from '@testing-library/react'
import Client from 'mina-signer'
import { vi } from 'vitest'

import { MinaProvider } from '../../src/mina/mina-provider'
import { RequestArguments } from '../../src/web-provider-types/data-model'

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
  let networkType: string
  let provider: MinaProvider
  let agentArgs: FromBip39MnemonicWordsProps
  let network: string
  let args: ChainSpecificArgs
  let payload: ChainSpecificPayload
  let credentialName: CredentialName
  let keyAgentName: string
  //let expectedAddress: string
  //let defaultNetwork: string

  beforeAll(async () => {
    console.log('Current working directory:', process.cwd())
    networkType = 'testnet'
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC
    }
    network = DEFAULT_NETWORK
    args = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: networkType as Mina.NetworkType
    }
    payload = new MinaPayload()
    credentialName = 'Test Suite Credential'
    keyAgentName = 'Test Suite Key Agent'
    //expectedAddress = 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
    //defaultNetwork = DEFAULT_NETWORK

    // initialise the vault
    const { result } = renderHook(() => useVault())
    // restore wallet
    await act(async () => {
      await result.current.restoreWallet(
        payload,
        args,
        network,
        agentArgs,
        keyAgentName,
        KeyAgents.InMemory,
        credentialName
      )
    })

    // initialize the MinaProvider
    const opts = {
      projectId: 'test',
      chains: [DEFAULT_NETWORK]
    }
    provider = await MinaProvider.init(opts, [])
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

    it('should get the chainId with `mina_chainId` method', async () => {
      const requestArgs: RequestArguments = {
        method: 'mina_chainId'
      }

      expect(provider).toBeDefined()

      const chainId = await provider.request(requestArgs)
      console.log('chainId in test: ', chainId)
      expect(chainId).toEqual(
        '3c41383994b87449625df91769dff7b507825c064287d30fada9286f3f1cb15e'
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

    // TODO: fix this test -- this is likely failing because the chainId is not known
    it.skip('should switch the network successfully when requesting the balance of another chain id', async () => {
      // Listen to the chains changed event
      const connectListener = vi.fn()
      provider.on('chainChanged', connectListener)

      const switchNetworkRequestArgs: RequestArguments = {
        method: 'mina_getBalance'
      }
      const newChainId =
        'b6ee40d336f4cc3f33c1cc04dee7618eb8e556664c2b2d82ad4676b512a82418' // Devnet chainId
      const result = await provider.request(
        switchNetworkRequestArgs,
        newChainId
      )
      expect(result).toBeDefined()

      // Assert that the connect event was emitted
      expect(connectListener).toHaveBeenCalledWith(newChainId)
    })
  })
  describe('MinaProvider Errors', () => {
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
