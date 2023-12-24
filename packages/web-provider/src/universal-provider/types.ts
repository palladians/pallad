import { EventEmitter } from 'events'

import {
  ConnectOps,
  ProviderAccounts,
  ProviderChainId,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
  RequestArguments
} from '../types'

export interface RpcProviderMap {
  [chainId: string]: IProvider
}

// a map of chainId to rpc provider -- like providerManager but for web-providers
//export interface RpcProvidersMap {
//  [provider: string]: JsonRpcProvider;
//}

export interface IProvider {
  //readonly namespace: SessionNamespace;
  //readonly httpProviders: RpcProvidersMap;
  //readonly client: typeof VaultService;

  request: <T = unknown>(args: RequestArguments) => Promise<T>
  setDefaultChain: (chainId: string, rpcUrl?: string | undefined) => void
  getDefaultChain: () => string
  requestAccounts: () => string[]
}

export abstract class IEvents {
  public abstract events: EventEmitter

  // events
  public abstract on(event: string, listener: any): void
  public abstract once(event: string, listener: any): void
  public abstract off(event: string, listener: any): void
  public abstract removeListener(event: string, listener: any): void
}

export interface EIP1193Provider extends IEvents {
  // connection event
  on(event: 'connect', listener: (info: ProviderConnectInfo) => void): void
  // disconnection event
  on(event: 'disconnect', listener: (error: ProviderRpcError) => void): void
  // arbitrary messages
  on(event: 'message', listener: (message: ProviderMessage) => void): void
  // chain changed event
  on(event: 'chainChanged', listener: (chainId: ProviderChainId) => void): void
  // accounts changed event
  on(
    event: 'accountsChanged',
    listener: (accounts: ProviderAccounts) => void
  ): void
  // make an Ethereum RPC method call.
  request(args: RequestArguments): Promise<unknown>
}

export interface IEthereumProvider extends EIP1193Provider {
  // legacy alias for EIP-1102
  enable(): Promise<ProviderAccounts>
}

export interface IUniversalProvider extends IEthereumProvider {
  //client?: typeof VaultService;
  // namespaces?: NamespaceConfig;
  rpcProviders: RpcProviderMap
  uri: string | undefined

  request: <T = unknown>(args: RequestArguments, chain?: string) => Promise<T>
  connect: (opts: ConnectOps) => Promise<boolean | undefined>
  disconnect: () => Promise<void>
  cleanupPendingPairings: () => Promise<void>
  abortPairingAttempt(): void
  setDefaultChain: (chainId: string, rpcUrl?: string | undefined) => void
}
