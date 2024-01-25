import { EventEmitter } from 'events'

import {
  ConnectOps,
  ProviderAccounts,
  ProviderEvent,
  ProviderEventArguments,
  RequestArguments
} from '../web-provider-types'
import { UniversalProvider } from './universal-provider'

export interface RpcProviderMap {
  [chainId: string]: IProvider | unknown // todo remove unknown
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

export interface IUniversalProviderEvents {
  on: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void
  ) => UniversalProvider

  once: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void
  ) => UniversalProvider

  off: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void
  ) => UniversalProvider

  removeListener: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void
  ) => UniversalProvider

  //emit: <E extends ProviderEvent>(
  //  event: E,
  //  payload: ProviderEventArguments[E]
  //) => boolean
}

export interface IEthereumProvider extends IUniversalProviderEvents {
  // legacy alias for EIP-1102
  enable(): Promise<ProviderAccounts>
}

export interface IUniversalProvider extends IEthereumProvider {
  //client?: typeof VaultService;
  // namespaces?: NamespaceConfig;
  rpcProviders: RpcProviderMap
  uri: string | undefined

  request: <T = unknown>(args: RequestArguments, chain?: string) => Promise<T>
  connect: (opts: ConnectOps) => Promise<void>
  disconnect: () => Promise<void>
  //cleanupPendingPairings: () => Promise<void>
  //abortPairingAttempt(): void
  setDefaultChain: (chainId: string, rpcUrl?: string | undefined) => void
}
