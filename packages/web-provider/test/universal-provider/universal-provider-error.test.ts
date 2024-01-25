/*import {
  FromBip39MnemonicWordsProps,
  MinaPayload,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { KeyAgents, useVault } from '@palladxyz/vault'
import { act, renderHook } from '@testing-library/react'
import { vi } from 'vitest'

import { RequestArguments } from '../../src/mina/types'
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
          // Mock the addListener to simulate user rejection
          addListener: vi.fn((listener) => {
            const mockResponse = {
              windowId: 1234,
              userRejected: true // Simulating user rejection
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
  describe('Universal Provider -- MinaProvider Errors', () => {
    it('should throw ProviderRpcError with code 4001 on user rejection', async () => {
      // Simulate user rejection by mocking the user prompt to return a rejection
      provider.userPrompt = vi.fn().mockResolvedValue(null)

      // Attempt to execute a method that requires user confirmation
      const requestArgs: RequestArguments = { method: 'mina_accounts' }
      await expect(provider.request(requestArgs)).rejects.toEqual(
        expect.objectContaining({ code: 4001 })
      )
    })

    it('should throw ProviderRpcError with code 4001 when user rejects the connection', async () => {
      // Mock user rejection
      provider.userPrompt = vi.fn().mockResolvedValue(null)

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
*/
