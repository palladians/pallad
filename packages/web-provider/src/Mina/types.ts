// import { MinaProvider } from './MinaProvider'
//
// export interface ProviderRpcError extends Error {
//   message: string
//   code: number
//   data?: unknown
// }
//
// export interface ProviderMessage {
//   type: string
//   data: unknown
// }
//
// export interface ProviderInfo {
//   chainId: string
// }
//
// export interface RequestArguments {
//   method: string
//   params?: unknown[] | object
// }
//
// export type ProviderChainId = ProviderInfo['chainId']
//
// export type ProviderAccounts = string[]
//
// export interface EIP1102Request extends RequestArguments {
//   method: 'mina_requestAccounts'
// }
// // Event types and interfaces
// export type ProviderEvent =
//   | 'connect'
//   | 'disconnect'
//   | 'message'
//   | 'chainChanged'
//   | 'accountsChanged'
//
// export interface ProviderEventArguments {
//   connect: ProviderInfo
//   disconnect: ProviderRpcError
//   message: ProviderMessage
//   chainChanged: ProviderChainId
//   accountsChanged: ProviderAccounts
// }
//
// // IMinaProviderEvents interface
// export interface IMinaProviderEvents {
//   on: <E extends ProviderEvent>(
//     event: E,
//     listener: (args: ProviderEventArguments[E]) => void
//   ) => MinaProvider
//
//   once: <E extends ProviderEvent>(
//     event: E,
//     listener: (args: ProviderEventArguments[E]) => void
//   ) => MinaProvider
//
//   off: <E extends ProviderEvent>(
//     event: E,
//     listener: (args: ProviderEventArguments[E]) => void
//   ) => MinaProvider
//
//   removeListener: <E extends ProviderEvent>(
//     event: E,
//     listener: (args: ProviderEventArguments[E]) => void
//   ) => MinaProvider
//
//   emit: <E extends ProviderEvent>(
//     event: E,
//     payload: ProviderEventArguments[E]
//   ) => boolean
// }
//
// export interface EIP1193Provider {
//   // connection event
//   on(event: 'connect', listener: (info: ProviderInfo) => void): MinaProvider
//   // disconnection event
//   on(
//     event: 'disconnect',
//     listener: (error: ProviderRpcError) => void
//   ): MinaProvider
//   // arbitrary messages
//   on(
//     event: 'message',
//     listener: (message: ProviderMessage) => void
//   ): MinaProvider
//   // chain changed event
//   on(
//     event: 'chainChanged',
//     listener: (chainId: ProviderChainId) => void
//   ): MinaProvider
//   // accounts changed event
//   on(
//     event: 'accountsChanged',
//     listener: (accounts: ProviderAccounts) => void
//   ): MinaProvider
//   // make an Ethereum RPC method call.
//   request(args: RequestArguments): Promise<unknown>
// }
//
// export interface IMinaProvider extends EIP1193Provider {
//   // legacy alias for EIP-1102
//   enable(): Promise<ProviderAccounts>
// }
