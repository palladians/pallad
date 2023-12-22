import { EventEmitter } from 'events'

import {
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
  REQUIRED_EVENTS,
  REQUIRED_METHODS
} from './constants/rpc'
import { IMinaProvider as IProvider, IMinaProviderEvents } from './types'
import { vaultService } from './vaultService'

export type RpcMethod =
  | 'mina_sendTransaction'
  | 'mina_accounts'
  | 'mina_requestAccounts'
  | 'mina_getBalance'
  | 'mina_sign'
  | 'mina_signTransaction'

export type RpcEvent =
  | 'accountsChanged'
  | 'chainChanged'
  | 'message'
  | 'disconnect'
  | 'connect'

export interface MinaRpcMap {
  [chainId: string]: string
}

export interface MinaEvent {
  event: { name: string; data: any }
  chainId: string
}

export interface MinaRpcConfig {
  chains: string[]
  optionalChains: string[]
  methods: string[]
  optionalMethods?: string[]
  /**
   * @description Events that the wallet MUST support or the connection will be rejected
   */
  events: string[]
  optionalEvents?: string[]
  rpcMap: MinaRpcMap
  projectId: string
}
export interface ConnectOps {
  chains?: number[]
  optionalChains?: number[]
  rpcMap?: MinaRpcMap
  pairingTopic?: string
}

export interface IMinaProvider extends IProvider {
  connect(opts?: ConnectOps | undefined): Promise<void>
}

export function getRpcUrl(
  chainId: string,
  rpc: MinaRpcConfig
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

export type NamespacesParams = {
  chains: MinaRpcConfig['chains']
  optionalChains: MinaRpcConfig['optionalChains']
  methods?: MinaRpcConfig['methods']
  optionalMethods?: MinaRpcConfig['methods']
  events?: MinaRpcConfig['events']
  rpcMap: MinaRpcConfig['rpcMap']
  optionalEvents?: MinaRpcConfig['events']
}

interface MinaProviderOptions {
  chains?: string[]
  optionalChains?: string[]
  rpcMap?: MinaRpcMap
  pairingTopic?: string
  projectId: string
  showUserPrompt?: (message: string) => Promise<boolean>
}

interface RequestArguments {
  method: RpcMethod
  params?: any[] | object
}

async function showUserPrompt(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    const userResponse = window.confirm(message)
    resolve(userResponse)
  })
}

export class MinaProvider implements IMinaProvider {
  public events = new EventEmitter()
  public accounts: string[] = []
  public chainId = 'Add Chain ID here'
  public signer: any // I think the signer is something other than the vault, but I'm not sure

  private userPrompt: (message: string) => Promise<boolean> // maybe this is the right place for this?

  protected rpc: MinaRpcConfig

  constructor(opts: MinaProviderOptions) {
    // Initialization logic
    this.rpc = {} as MinaRpcConfig

    // Use provided userPrompt function or default to the actual implementation
    this.userPrompt = opts.showUserPrompt || showUserPrompt
  }

  static async init(opts: MinaProviderOptions): Promise<MinaProvider> {
    const provider = new MinaProvider(opts)
    await provider.initialize(opts)
    return provider
  }
  // why is this async?
  private async initialize(opts: MinaProviderOptions) {
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

    // ... any other initialization logic
  }

  public async enable(): Promise<string[]> {
    // Implement the logic to prompt the user to connect to the wallet
    // For example, you could open a modal and wait for the user to click 'Connect'
    // Step 0: Prompt user for confirmation
    const userConfirmed = await this.userPrompt('Do you want to connect?')
    if (!userConfirmed) {
      // should this emit an error event?
      throw new Error('User denied connection.')
    }
    await this.connect()
    // Once the user has connected, emit an 'accountsChanged' event
    this.events.emit('accountsChanged', this.accounts)
    return this.accounts
  }

  public on: IMinaProviderEvents['on'] = (event, listener) => {
    this.events.on(event, listener)
    return this
  }

  public async connect(/*opts?: ConnectOps*/): Promise<void> {
    // Step 1: Check if already connected.
    if (this.signer.isConnected()) {
      throw new Error('Already connected.')
    }

    // Step 2: Start the connection process.
    // This might involve connecting to a Mina node, initializing a session, etc.
    await this.signer.connect()

    // Step 3: Fetch accounts and set them
    this.accounts = await this.signer.getAccounts()

    // Emit a 'connect' event once connected
    this.events.emit('connect', { chainId: 'Add Chain ID here' })
  }

  public async disconnect(): Promise<void> {
    // Check if it's connected in the first place
    if (!this.signer.isConnected()) {
      throw new Error('Not connected.')
    }

    // Disconnect the signer
    await this.signer.disconnect()

    // Reset accounts
    this.accounts = []

    // Emit a 'disconnect' event once disconnected
    this.events.emit('disconnect')
  }

  public async request<T = unknown>(args: RequestArguments): Promise<T> {
    // Prompt user for confirmation based on the method type
    const userConfirmed = await this.userPrompt(
      `Do you want to execute ${args.method}?`
    )
    if (!userConfirmed) {
      // should this emit an error event?
      throw new Error('User denied the request.')
    }
    if (args.method === 'mina_accounts') {
      // handle mina_accounts
      return vaultService.getAddresses() as unknown as T
    }
    // For unsupported methods, throw an error with a descriptive message -- must error with correct standard error
    throw new Error(`Method ${args.method} is not supported.`)
  }

  public exampleMethod(): (string | undefined)[] {
    // This is an example of how you could implement a method
    // that calls a method on the signer
    const addresses = vaultService.getAddresses()
    return addresses
  }

  protected getRpcConfig(ops: MinaProviderOptions): MinaRpcConfig {
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
