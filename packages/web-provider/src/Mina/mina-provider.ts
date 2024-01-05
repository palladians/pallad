import { MinaSignablePayload } from '@palladxyz/key-management'
import { EventEmitter } from 'events'

import {
  ChainProviderOptions,
  ChainRpcConfig,
  ConnectOps,
  ProviderConnectInfo,
  ProviderRpcError,
  RequestArguments
} from '../types'
import { showUserPrompt } from '../utils/prompts'
import { vaultService } from '../vault-service'
import {
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
  REQUIRED_EVENTS,
  REQUIRED_METHODS
} from './constants/rpc'
import {
  IMinaProviderBase,
  IMinaProviderEvents,
  MinaRpcProviderMap
} from './types'

export type RpcMethod =
  | 'mina_sendTransaction'
  | 'mina_accounts'
  | 'mina_requestAccounts'
  | 'mina_getBalance'
  | 'mina_sign'
  | 'mina_signTransaction'

export interface IMinaProvider extends IMinaProviderBase {
  connect(opts?: ConnectOps | undefined): Promise<void>
}

export function getRpcUrl(
  chainId: string,
  rpc: ChainRpcConfig
): string | undefined {
  let rpcUrl: string | undefined
  if (rpc.rpcMap) {
    rpcUrl = rpc.rpcMap[getMinaChainId([chainId])]
  }
  return rpcUrl
}

export function getMinaChainId(chains: string[]): number {
  return Number(chains[0]?.split(':')[1])
}

export class MinaProvider implements IMinaProvider {
  public events = new EventEmitter()
  public accounts: string[] = []
  public chainId: string | undefined = undefined
  public rpcProviders: MinaRpcProviderMap = {}
  public connected = false

  private userPrompt: typeof showUserPrompt

  protected rpc: ChainRpcConfig

  constructor(
    opts: ChainProviderOptions,
    private externalEmitter?: EventEmitter
  ) {
    // Initialization logic
    this.rpc = {} as ChainRpcConfig

    // Use provided userPrompt function or default to the actual implementation
    if (opts.showUserPrompt) {
      this.userPrompt = opts.showUserPrompt
    } else {
      // Default to the actual implementation
      this.userPrompt = showUserPrompt
    }
  }

  static async init(
    opts: ChainProviderOptions,
    externalEmitter?: EventEmitter
  ): Promise<MinaProvider> {
    const provider = new MinaProvider(opts, externalEmitter)
    await provider.initialize(opts)
    return provider
  }
  // why is this async?
  private async initialize(opts: ChainProviderOptions) {
    // Here, you'd set up any initial state or connections you need.
    // For example, you could set up the rpcConfig:

    this.rpc = {
      chains: opts.chains || [],
      optionalChains: opts.optionalChains || [],
      rpcMap: opts.rpcMap || {},
      projectId: opts.projectId,
      methods: REQUIRED_METHODS, // Use required methods from constants
      optionalMethods: OPTIONAL_METHODS, // Use optional methods from constants
      events: REQUIRED_EVENTS, // Use required events from constants
      optionalEvents: OPTIONAL_EVENTS // Use optional events from constants
    }

    // get the wallet's current chain id
    const chainId = await vaultService.getChainId()
    this.chainId = chainId
    // set the rpc provider
    // TODO:
    //this.rpcProviders = vaultService.getChainIds() ?? {}
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
  // TODO: add ConnectOps as an optional parameter
  public async enable(): Promise<string[]> {
    // Implement the logic to prompt the user to connect to the wallet
    // For example, you could open a modal and wait for the user to click 'Connect'
    // Step 0: Prompt user for confirmation
    const userConfirmed = await this.userPrompt('Do you want to connect?')
    if (!userConfirmed) {
      // should this emit an error event?
      throw this.createProviderRpcError(4001, 'User Rejected Request')
    }
    await this.connect()
    // TODO: perform 'mina_requestAccounts' method
    return this.accounts
  }
  // these are the methods that are called by the dapp to interact/listen to the wallet
  public on: IMinaProviderEvents['on'] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.on(event, listener)
    } else {
      this.events.on(event, listener)
    }
    return this
  }

  public once: IMinaProviderEvents['once'] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.once(event, listener)
    } else {
      this.events.once(event, listener)
    }
    return this
  }

  public removeListener: IMinaProviderEvents['removeListener'] = (
    event,
    listener
  ) => {
    if (this.externalEmitter) {
      this.externalEmitter.removeListener(event, listener)
    } else {
      this.events.removeListener(event, listener)
    }
    return this
  }

  public off: IMinaProviderEvents['off'] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.off(event, listener)
    } else {
      this.events.off(event, listener)
    }
    return this
  }

  public async connect(opts?: ConnectOps): Promise<void> {
    try {
      // Step 1: Check if already connected.
      if (this.connected) {
        throw new Error('Already connected.')
      }
      // Step 2: Attempt to connect to a chain.
      if (!opts) {
        // Try to connect to the default chain -- this is actually the current chain the wallet is connected to not the default chain
        const defaultChainId = await vaultService.getChainId()
        if (!defaultChainId) {
          throw new Error('Unable to connect: Default chain ID is undefined.')
        }
        this.chainId = defaultChainId
      } else if (opts.chains && opts.chains.length > 0) {
        this.chainId = String(opts.chains[0])
      } else {
        throw this.createProviderRpcError(4901, 'Chain Disconnected')
      }
      // Step 3: Fetch accounts and set them.
      this.accounts = await vaultService.getAccounts()
      // Step 4: Set the connected flag.
      this.connected = true
      // Step 5: Emit a 'connect' event.
      const connectInfo: ProviderConnectInfo = { chainId: this.chainId }
      //this.events.emit('connect', connectInfo)
      if (this.externalEmitter) {
        this.externalEmitter.emit('connect', connectInfo)
      } else {
        this.events.emit('connect', connectInfo)
      }
    } catch (error) {
      // Handle any errors that occurred during connection.
      console.error('Error during connection:', error)
      // Additional error handling as needed
    }
  }

  public requestAccounts(): string[] {
    return this.accounts
  }

  public isConnected(): boolean {
    return this.connected
  }

  public async disconnect(): Promise<void> {
    // Check if it's connected in the first place
    if (!this.isConnected()) {
      // Emit a 'disconnect' event with an error only if disconnected
      if (this.externalEmitter) {
        this.externalEmitter.emit(
          'disconnect',
          this.createProviderRpcError(4900, 'Disconnected')
        )
      } else {
        this.events.emit(
          'disconnect',
          this.createProviderRpcError(4900, 'Disconnected')
        )
      }
    } else {
      // If it's connected, then handle the disconnection logic
      // For example, disconnect from the Mina client or other cleanup
      // ...

      // Update the connected status
      this.connected = false

      // Reset accounts
      this.accounts = []

      // Reset chainId
      this.chainId = undefined

      // Emit a 'disconnect' event without an error
      if (this.externalEmitter) {
        this.externalEmitter.emit('disconnect')
      } else {
        this.events.emit('disconnect')
      }
    }
  }

  public async request<T = unknown>(
    args: RequestArguments,
    chain?: string | undefined
  ): Promise<T> {
    // In a method that requires a specific chain connection
    // TODO: handle when chain is not provided -- handle other methods with optional args
    if (this.chainId !== chain && chain !== undefined) {
      // TODO: prompt the user they're on the wrong chain and ask if they want to switch
      // maybe this error should be handled in the universal-provider?
      // check if the chain is supported by Pallad
      const chains = (await vaultService.getChainIds()) ?? []
      const validChain = chains?.includes(chain)
      if (!validChain) {
        throw this.createProviderRpcError(4901, 'Chain Disconnected')
      }
      const changeChain = await this.userPrompt(
        `You are on the wrong chain. Do you want to switch to ${chain}?`
      )
      if (changeChain) {
        // TODO: switch to the correct chain
        vaultService.switchNetwork(chain)
        this.chainId = chain
        this.onChainChanged(chain!)
      } else {
        // if they don't, throw an error
        throw this.createProviderRpcError(4901, 'Chain Disconnected')
      }
    }
    // Prompt user for confirmation based on the method type
    // what scenarios would we need to prompt the user?
    const userConfirmed = await this.userPrompt(
      `Do you want to execute ${args.method}?`
    )
    if (!userConfirmed) {
      throw this.createProviderRpcError(4001, 'User Rejected Request')
    }

    switch (args.method) {
      case 'mina_accounts': {
        return vaultService.getAccounts() as unknown as T
      }

      case 'mina_sign':
      case 'mina_signFields':
      case 'mina_signTransaction': {
        const passphrase = await this.userPrompt(
          'Enter your passphrase:',
          'password'
        )
        if (passphrase === null) {
          throw new Error('User denied the request for passphrase.')
        }
        // TODO: handle incorrect passphrase
        return vaultService.sign(args.params as MinaSignablePayload, async () =>
          Buffer.from(passphrase)
        ) as unknown as T
      }

      case 'mina_getBalance':
      case 'mina_chainId': {
        if (!userConfirmed) {
          throw this.createProviderRpcError(4001, 'User Rejected Request')
        }
        return args.method === 'mina_getBalance'
          ? (vaultService.getBalance() as unknown as T)
          : (this.chainId as unknown as T)
      }

      default:
        throw this.createProviderRpcError(4200, 'Unsupported Method')
    }
  }

  private onChainChanged(chainId: string): void {
    // updated the chainId
    this.chainId = chainId
    if (this.externalEmitter) {
      this.externalEmitter.emit('chainChanged', chainId)
    } else {
      this.events.emit('chainChanged', chainId)
    }
  }
  // The set of accounts only changes when the user
  // 1. adds a new account
  // 2. removes an account
  // We can listen to the vaultService for changes to the accounts
  /*private onAccountsChanged(): void {
    // listen to the vaultService for changes to the accounts
    // e.g. vaultService.events.on('accountsChanged', this.updateAccounts)
    const accounts = vaultService.getAccounts()
    this.accounts = accounts
    if (this.externalEmitter) {
      this.externalEmitter.emit('accountsChanged', accounts)
    } else {
      this.events.emit('accountsChanged', accounts)
    }
  }*/

  protected getRpcConfig(ops: ChainProviderOptions): ChainRpcConfig {
    return {
      chains: ops.chains || [],
      optionalChains: ops.optionalChains || [],
      rpcMap: ops.rpcMap || {},
      projectId: ops.projectId,
      methods: REQUIRED_METHODS, // Use required methods from constants
      optionalMethods: OPTIONAL_METHODS, // Use optional methods from constants
      events: REQUIRED_EVENTS, // Use required events from constants
      optionalEvents: OPTIONAL_EVENTS // Use optional events from constants
    }
  }

  protected getRpcUrl(chainId: string /*, projectId?: string*/): string {
    const providedRpc = this.rpc.rpcMap?.[chainId]
    return providedRpc!
  }
}
