import { MinaWalletImpl } from '@palladxyz/mina-wallet'
import { EventEmitter } from 'events'

import { MinaWalletWrapper } from './MinaWalletWrapper'
import { IMinaProvider as IProvider, IMinaProviderEvents } from './types'

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
}

interface RequestArguments {
  method: RpcMethod
  params?: any[] | object
}

export class MinaProvider implements IMinaProvider {
  public events = new EventEmitter()
  public accounts: string[] = []
  public chainId = 'Add Chain ID here'
  public signer: MinaWalletWrapper // I think the signer is something other than the wallet, like a wrapper around the wallet, but I'm not sure

  protected rpc: MinaRpcConfig

  constructor(wallet: MinaWalletImpl) {
    // Initialization logic
    this.signer = new MinaWalletWrapper(wallet)
    this.rpc = {} as MinaRpcConfig
  }

  static async init(
    opts: MinaProviderOptions,
    wallet: MinaWalletImpl
  ): Promise<MinaProvider> {
    const provider = new MinaProvider(wallet)
    await provider.initialize(opts)
    return provider
  }

  private async initialize(opts: MinaProviderOptions) {
    // Here, you'd set up any initial state or connections you need.
    // For example, you could set up the rpcConfig:

    this.rpc = {
      chains: opts.chains || [],
      optionalChains: opts.optionalChains || [],
      rpcMap: opts.rpcMap || {},
      projectId: opts.projectId,
      methods: [], // Define your default methods here
      events: [] // Define your default events here
      // ... set up other properties as needed
    }

    // ... any other initialization logic
  }

  public async enable(): Promise<string[]> {
    // Implement the logic to prompt the user to connect to the wallet
    // For example, you could open a modal and wait for the user to click 'Connect'
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
    return await this.signer.request(args, this.chainId)
  }

  protected getRpcConfig(ops: MinaProviderOptions): MinaRpcConfig {
    return {
      chains: ops.chains || [],
      optionalChains: ops.optionalChains || [],
      rpcMap: ops.rpcMap || {},
      projectId: ops.projectId,
      methods: [], // Define your default methods here
      events: [] // Define your default events here
      // ... set up other properties as needed
    }
  }

  protected getRpcUrl(chainId: string /*, projectId?: string*/): string {
    const providedRpc = this.rpc.rpcMap?.[chainId]
    return providedRpc!
  }
}
