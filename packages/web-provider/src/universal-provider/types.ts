import type { EventEmitter } from "node:events"

import type { RequestArguments } from "../web-provider-types"

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

  request: <T = unknown>(args: RequestArguments, chain?: any) => Promise<T>
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
