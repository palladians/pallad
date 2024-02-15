import EventEmitter from 'events'

import { MinaProvider } from '../mina-network'
import { showUserPrompt } from '../utils'
import {
  ChainProviderOptions,
  ConnectOps,
  ProviderRpcError,
  RequestArguments
} from '../web-provider-types'
import {
  IUniversalProvider,
  IUniversalProviderEvents,
  RpcProviderMap
} from './types'

/**
 * TODO: Should the UniversalProvider be the source of prompting the user or should the
 * chain provider be the source of prompting the user?
 */

export class UniversalProvider implements IUniversalProvider {
  rpcProviders: RpcProviderMap // should be rpcProviders: RpcProviderMap
  uri: string
  private defaultChain: string
  private connected: boolean
  private chainId: string
  private accounts: string[]
  private events: EventEmitter
  private userPrompt: typeof showUserPrompt

  constructor(opts: ChainProviderOptions, authorizedMethods?: string[]) {
    this.defaultChain = 'mina' // Set a default chain -- but we have different mina chains too (devnet, mainnet, berkeley).
    // Initialize MinaProvider and add to providers map
    // TODO: Improve how we initialize providers
    this.connected = false
    this.chainId = ''
    this.accounts = []
    this.events = new EventEmitter()
    this.uri = '' // TODO
    this.rpcProviders = {
      mina: MinaProvider.init(opts, authorizedMethods, this.events)
    }

    // Use provided userPrompt function or default to the actual implementation
    if (opts.showUserPrompt) {
      this.userPrompt = opts.showUserPrompt
    } else {
      // Default to the actual implementation
      this.userPrompt = showUserPrompt
    }
  }

  private createProviderRpcError(
    code: number,
    message: string
  ): ProviderRpcError {
    return {
      name: 'ProviderRpcError',
      message,
      code
      // Include any additional data if it is required
    }
  }

  // TODO: check why i made this async
  private async getProvider(chain: string): Promise<any> {
    const provider = this.rpcProviders[chain]
    if (!provider) {
      throw new Error(`No provider found for chain: ${chain}`)
    }
    return provider
  }

  public async request<T = unknown>(
    args: RequestArguments,
    chain?: string
  ): Promise<T> {
    const provider = await this.getProvider(chain || this.defaultChain)
    return await provider.request(args, chain)
  }

  setDefaultChain(chainId: string, rpcUrl?: string): void {
    this.defaultChain = chainId
    console.log('rpcUrl: ', rpcUrl)
    // Optionally, initialize and add a new provider for this chain
    // if it doesn't exist in the providers map
  }

  getDefaultChain(): string {
    return this.defaultChain
  }

  async requestAccounts(): Promise<string[]> {
    const provider = await this.getProvider(this.defaultChain)
    return provider.requestAccounts()
  }

  public async enable(opts?: ConnectOps): Promise<string[]> {
    // Implement the logic to prompt the user to connect to the wallet
    // For example, you could open a modal and wait for the user to click 'Connect'
    // Step 0: Prompt user for confirmation
    const userConfirmed = await this.userPrompt('Do you want to connect?')
    if (!userConfirmed) {
      // should this emit an error event?
      throw this.createProviderRpcError(4001, 'User Rejected Request')
    }
    // as a universal provider, when a user connects what does the developer want?
    await this.connect(opts)
    // TODO: perform 'mina_requestAccounts' method
    return await this.requestAccounts()
  }
  // these are the methods that are called by the dapp to interact/listen to the wallet
  public on: IUniversalProviderEvents['on'] = (event, listener) => {
    this.events.on(event, listener)
    return this
  }

  public once: IUniversalProviderEvents['once'] = (event, listener) => {
    this.events.once(event, listener)
    return this
  }

  public removeListener: IUniversalProviderEvents['removeListener'] = (
    event,
    listener
  ) => {
    this.events.removeListener(event, listener)
    return this
  }

  public off: IUniversalProviderEvents['off'] = (event, listener) => {
    this.events.off(event, listener)
    return this
  }
  // logic should be to call the chain provider's connect method
  public async connect(opts?: ConnectOps): Promise<void> {
    const provider = await this.getProvider(this.defaultChain)
    try {
      // Step 1: Check if already connected.
      if (provider.isConnected()) {
        throw new Error('Already connected.')
      }
      // Step 2: Call the chain provider's connect method
      await provider.connect(opts)
      // Step 3: Update the connected status
      this.connected = true
    } catch (error) {
      // Handle any errors that occurred during connection.
      console.error('Error during connection:', error)
      // Additional error handling as needed
    }
  }
  // logic should be to call the chain provider's isConnected method
  public async isConnected(): Promise<boolean> {
    const provider = await this.getProvider(this.defaultChain)
    return provider.isConnected()
  }

  public async disconnect(): Promise<void> {
    // Check if it's connected in the first place
    if (!this.isConnected()) {
      // Emit a 'disconnect' event with an error only if disconnected
      this.events.emit(
        'disconnect',
        this.createProviderRpcError(4900, 'Disconnected')
      )
    } else {
      // If it's connected, then handle the disconnection logic
      const provider = await this.getProvider(this.defaultChain)
      // Disconnect from the chain provider
      await provider.disconnect()

      // Update the connected status
      this.connected = false

      // Reset accounts
      this.accounts = []

      // Reset chainId
      this.chainId = undefined

      // Emit a 'disconnect' event without an error
      this.events.emit('disconnect')
    }
  }

  //cleanupPendingPairings
  // abortPairingAttempt, emit
}
