import type { MinaSignablePayload } from "@palladxyz/key-management"
import type { ProviderConfig } from "@palladxyz/providers"

import type {
  ProviderAccounts,
  ProviderChainId,
  ProviderConnectInfo,
  ProviderEvent,
  ProviderEventArguments,
  ProviderMessage,
  ProviderRpcError,
  RequestArguments,
} from "../web-provider-types"
import type { MinaProvider } from "./mina-provider"

export type RequestSignableData = {
  data: MinaSignablePayload
}

export interface OffchainSessionAllowedMethods {
  contractAddress: string
  method: string
}

export type RequestOffchainSession = {
  data: {
    sessionKey: string
    expirationTime: string
    allowedMethods: OffchainSessionAllowedMethods[]
    sessionMerkleRoot: MinaSignablePayload
  }
}

export type RequestSignableTransaction = {
  data: { transaction: MinaSignablePayload }
}

export type RequestDataFields = {
  data: {
    fields: number[] | bigint[]
  }
}

export type RequestDataNullifier = {
  data: {
    message: number[] | bigint[]
  }
}

export type RequestAddChain = {
  data: ProviderConfig
}

export type RequestSwitchChain = {
  data: { chainId: string }
}

export type RequestingStateData = {
  data: RequestArguments
}

export interface MinaRpcProviderMap {
  [chainId: string]: IMinaProviderBase
}

export interface EIP1102Request extends RequestArguments {
  method: "mina_requestAccounts"
}

// IMinaProviderEvents interface
export interface IMinaProviderEvents {
  on: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void,
  ) => MinaProvider

  once: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void,
  ) => MinaProvider

  off: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void,
  ) => MinaProvider

  removeListener: <E extends ProviderEvent>(
    event: E,
    listener: (args: ProviderEventArguments[E]) => void,
  ) => MinaProvider

  //emit: <E extends ProviderEvent>(
  //  event: E,
  //  payload: ProviderEventArguments[E]
  //) => boolean
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
  // legacy alias for EIP-1102
  enable({ origin }: { origin: string }): Promise<ProviderAccounts>
}
