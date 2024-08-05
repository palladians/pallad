import type { Validation } from "../mina-network"
import type { showUserPrompt } from "../utils"

export type NamespacesParams = {
  chains: ChainRpcConfig["chains"]
  optionalChains: ChainRpcConfig["optionalChains"]
  methods?: ChainRpcConfig["methods"]
  optionalMethods?: ChainRpcConfig["methods"]
  events?: ChainRpcConfig["events"]
  rpcMap: ChainRpcConfig["rpcMap"]
  optionalEvents?: ChainRpcConfig["events"]
}

export interface ChainProviderOptions {
  chains?: string[]
  optionalChains?: string[]
  rpcMap?: ChainRpcMap
  pairingTopic?: string
  projectId: string
  showUserPrompt?: typeof showUserPrompt
}

export type RpcEvent =
  | "accountsChanged"
  | "chainChanged"
  | "message"
  | "disconnect"
  | "connect"

export interface ChainRpcMap {
  [chainId: string]: string
}

export interface ChainEvent {
  event: { name: string; data: any }
  chainId: string
}

export interface ChainRpcConfig {
  chains: string[]
  optionalChains: string[]
  methods: string[]
  optionalMethods?: string[]
  /**
   * @description Events that the wallet MUST support or the connection will be rejected
   */
  events: string[]
  optionalEvents?: string[]
  rpcMap: ChainRpcMap
  projectId: string
}
export interface ConnectOps {
  origin: string
  chains?: number[]
  optionalChains?: number[]
  rpcMap?: ChainRpcMap
  pairingTopic?: string
}

export interface ProviderRpcError extends Error {
  message: string
  code: number
  data?: unknown
}

export interface ProviderMessage {
  type: string
  data: unknown
}

export interface ProviderConnectInfo {
  readonly chainId: string
}

export interface RequestArguments {
  method: string
  params:
    | Validation.RequestData
    | Validation.SignFieldsData
    | Validation.SignMessageData
    | Validation.CreateNullifierData
    | Validation.SignTransactionData
    | Validation.SendTransactionData
    | Validation.SetStateData
    | Validation.GetStateData
}

export interface Params {
  data?: {
    origin?: string
  }
}

export type ProviderChainId = ProviderConnectInfo["chainId"]

export interface ProviderInfo {
  chainId: string
}

export type ProviderAccounts = string[]

// Event types and interfaces
export type ProviderEvent =
  | "connect"
  | "disconnect"
  | "message"
  | "chainChanged"
  | "accountsChanged"

export interface ProviderEventArguments {
  connect: ProviderConnectInfo
  disconnect: ProviderRpcError
  message: ProviderMessage
  chainChanged: ProviderChainId
  accountsChanged: ProviderAccounts
}
