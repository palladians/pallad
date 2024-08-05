import type {
  ProviderAccounts,
  ProviderChainId,
  ProviderConnectInfo,
  ProviderMessage,
  ProviderRpcError,
  RequestArguments,
} from "../web-provider-types"
import type { MinaProvider } from "./mina-provider"

export interface MinaRpcProviderMap {
  [chainId: string]: IMinaProviderBase
}

// originally the EIP1193Provider interface
export interface IMinaProviderBase {
  // connection event
  on(
    event: "connect",
    listener: (info: ProviderConnectInfo) => void,
  ): MinaProvider
  // disconnection event
  on(
    event: "disconnect",
    listener: (error: ProviderRpcError) => void,
  ): MinaProvider
  // arbitrary messages
  on(
    event: "message",
    listener: (message: ProviderMessage) => void,
  ): MinaProvider
  // chain changed event
  on(
    event: "chainChanged",
    listener: (chainId: ProviderChainId) => void,
  ): MinaProvider
  // accounts changed event
  on(
    event: "accountsChanged",
    listener: (accounts: ProviderAccounts) => void,
  ): MinaProvider
  // make an Ethereum RPC method call.
  request(args: RequestArguments): Promise<unknown>
}
