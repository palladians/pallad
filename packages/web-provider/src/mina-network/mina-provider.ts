import { EventEmitter } from "node:events"
import type {
  ChainOperationArgs,
  ChainSignablePayload,
  MinaSignablePayload,
} from "@palladxyz/key-management"
import {
  type BorrowedTypes,
  type Mina,
  TransactionType,
} from "@palladxyz/mina-core"
import type { Validation } from "."
import { showUserPrompt } from "../utils/prompts"
import { type VaultService, vaultService } from "../vault-service"
import type {
  ChainProviderOptions,
  ChainRpcConfig,
  ConnectOps,
  ProviderConnectInfo,
  RequestArguments,
} from "../web-provider-types"
import {
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
  REQUIRED_EVENTS,
  REQUIRED_METHODS,
} from "./constants/rpc"
import type {
  IMinaProviderBase,
  IMinaProviderEvents,
  MinaRpcProviderMap,
} from "./types"
import { serializeField, serializeGroup, serializeTransaction } from "./utils"

export type RpcMethod =
  | "mina_sendTransaction"
  | "mina_accounts"
  | "mina_requestAccounts"
  | "mina_getBalance"
  | "mina_sign"
  | "mina_signTransaction"
  | "mina_createNullifier"
  | "mina_getState"
  | "mina_setState"

export interface IMinaProvider extends IMinaProviderBase {
  connect(opts?: ConnectOps | undefined): void
}

export function getRpcUrl(chainId: string, rpc: ChainRpcConfig) {
  let rpcUrl: string | undefined
  if (rpc.rpcMap) {
    rpcUrl = rpc.rpcMap[getMinaChainId([chainId])]
  }
  return rpcUrl
}

export function getMinaChainId(chains: string[]) {
  return Number(chains[0]?.split(":")[1])
}

export class MinaProvider implements IMinaProvider {
  public events = new EventEmitter()
  public accounts: string[] = []
  public chainId: string | undefined = undefined
  public rpcProviders: MinaRpcProviderMap = {}
  private vault: VaultService

  private userPrompt: typeof showUserPrompt

  protected rpc: ChainRpcConfig

  constructor(
    opts: ChainProviderOptions,
    private externalEmitter?: EventEmitter,
  ) {
    // Initialization logic
    this.rpc = {} as ChainRpcConfig
    this.vault = vaultService

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
    authorizedMethods: string[] = REQUIRED_METHODS,
    externalEmitter: EventEmitter = new EventEmitter(),
  ) {
    const provider = new MinaProvider(opts, externalEmitter)
    await provider.initialize(opts, authorizedMethods)
    return provider
  }

  private async initialize(
    opts: ChainProviderOptions,
    unauthorizedMethods: string[] = [],
  ) {
    this.rpc = {
      chains: opts.chains || [],
      optionalChains: opts.optionalChains || [],
      rpcMap: opts.rpcMap || {},
      projectId: opts.projectId,
      methods: REQUIRED_METHODS, // Use required methods from constants
      optionalMethods: OPTIONAL_METHODS, // Use optional methods from constants
      unauthorizedMethods: unauthorizedMethods,
      events: REQUIRED_EVENTS, // Use required events from constants
      optionalEvents: OPTIONAL_EVENTS, // Use optional events from constants
    }

    this.chainId = await this.vault.getChainId()
  }

  async unlockWallet() {
    const passphrase = await this.userPrompt("password", {
      title: "Unlock your wallet",
    })
    if (passphrase === null)
      throw this.createProviderRpcError(4100, "Unauthorized")
    await this.vault.unlockWallet(passphrase as string)
  }

  async checkAndUnlock() {
    const locked = await this.vault.isLocked()
    if (locked === true) {
      await this.unlockWallet()
    }
  }

  private createProviderRpcError(code: number, message: string) {
    const error = new Error(`${code} - ${message}`)
    error.name = "ProviderRpcError"
    return error
  }
  // TODO: add ConnectOps as an optional parameter
  public async enable({ origin }: { origin: string }) {
    // check if wallet is locked first
    await this.checkAndUnlock()
    const userConfirmed = await this.userPrompt("confirmation", {
      title: "Connection request.",
      payload: JSON.stringify({ origin }),
    })
    if (!userConfirmed) {
      // should this emit an error event?
      throw this.createProviderRpcError(4001, "User Rejected Request")
    }
    await this.connect({ origin })
    // TODO: perform 'mina_requestAccounts' method
    return await this.vault.getAccounts()
  }
  // these are the methods that are called by the dapp to interact/listen to the wallet
  public on: IMinaProviderEvents["on"] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.on(event, listener)
    } else {
      this.events.on(event, listener)
    }
    return this
  }

  public once: IMinaProviderEvents["once"] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.once(event, listener)
    } else {
      this.events.once(event, listener)
    }
    return this
  }

  public removeListener: IMinaProviderEvents["removeListener"] = (
    event,
    listener,
  ) => {
    if (this.externalEmitter) {
      this.externalEmitter.removeListener(event, listener)
    } else {
      this.events.removeListener(event, listener)
    }
    return this
  }

  public off: IMinaProviderEvents["off"] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.off(event, listener)
    } else {
      this.events.off(event, listener)
    }
    return this
  }

  public async connect(opts: ConnectOps) {
    try {
      // Step 1: Check if already connected.
      if (await this.vault.getEnabled({ origin: opts.origin }))
        throw this.createProviderRpcError(4100, "Already enabled.")
      // Step 2: Attempt to connect to a chain.
      if (!opts.chains) {
        // Try to connect to the default chain -- this is actually the current chain the wallet is connected to not the default chain
        const defaultChainId = await this.vault.getChainId()
        if (!defaultChainId) {
          throw this.createProviderRpcError(4100, "Chain ID is undefined.")
        }
        this.chainId = defaultChainId
      } else if (opts.chains && opts.chains.length > 0) {
        this.chainId = String(opts.chains[0])
      } else {
        throw this.createProviderRpcError(4901, "Chain Disconnected")
      }
      // Step 4: Set the connected flag.
      //this.connected = true // this is redundant because we're setting the connected flag in the next step
      await this.vault.setEnabled({ origin: opts.origin })
      // Step 5: Emit a 'connect' event.
      const connectInfo: ProviderConnectInfo = { chainId: this.chainId ?? "" }
      //this.events.emit('connect', connectInfo)
      if (this.externalEmitter) {
        this.externalEmitter.emit("connect", connectInfo)
      } else {
        this.events.emit("connect", connectInfo)
      }
    } catch (error) {
      // Handle any errors that occurred during connection.
      console.error("Error during connection:", error)
      // Additional error handling as needed
    }
  }

  public requestAccounts() {
    return this.accounts
  }

  public async isConnected({ origin }: { origin: string }) {
    return await this.vault.getEnabled({ origin })
  }

  public disconnect({ origin }: { origin: string }) {
    // Check if it's connected in the first place
    if (!this.isConnected({ origin })) {
      // Emit a 'disconnect' event with an error only if disconnected
      if (this.externalEmitter) {
        this.externalEmitter.emit(
          "disconnect",
          this.createProviderRpcError(4900, "Disconnected"),
        )
      } else {
        this.events.emit(
          "disconnect",
          this.createProviderRpcError(4900, "Disconnected"),
        )
      }
    } else {
      // If it's connected, then handle the disconnection logic
      // For example, disconnect from the Mina client or other cleanup
      // ...

      // Update the connected status
      // this.connected = false

      // Reset accounts
      this.accounts = []

      // Reset chainId
      this.chainId = undefined

      // Emit a 'disconnect' event without an error
      if (this.externalEmitter) {
        this.externalEmitter.emit("disconnect")
      } else {
        this.events.emit("disconnect")
      }
    }
  }

  private async sign({
    signable,
    operationArgs,
    passphrase,
  }: {
    signable: ChainSignablePayload
    operationArgs: ChainOperationArgs
    passphrase: string
  }) {
    try {
      return await this.vault.sign(
        signable,
        operationArgs,
        () =>
          new Promise<Uint8Array>((resolve) =>
            // TODO: make sure we handle scenarios where the password is provided and not just boolean 'confirmed'
            resolve(Buffer.from(passphrase as string)),
          ),
      )
    } catch {
      throw this.createProviderRpcError(4100, "Unauthorized")
    }
  }

  public async request<T = unknown>(args: RequestArguments): Promise<T> {
    // Step 1: Check if request instantiator is in blocked list.
    const { params } = args
    const requestOrigin = params.origin
    if (!requestOrigin) {
      throw this.createProviderRpcError(
        4100,
        "Unauthorized - Request lacks origin.",
      )
    }
    if (await this.vault.isBlocked({ origin: requestOrigin })) {
      throw this.createProviderRpcError(
        4100,
        "Unauthorized - The requested method and/or account has not been authorized for the requests origin by the user.",
      )
    }
    // check if wallet is locked first
    await this.checkAndUnlock()
    if (
      // when the provider is initialized, the rpc methods are set to the required methods
      // this can be the set of authorized methods the user has given permission for the zkApp to use
      this.rpc.unauthorizedMethods?.includes(args.method)
    ) {
      throw this.createProviderRpcError(
        4100,
        "Unauthorized - The requested method and/or account has not been authorized by the user.",
      )
    }
    const enabled = await this.vault.getEnabled({ origin: requestOrigin })
    if (!enabled) await this.enable({ origin: requestOrigin })

    switch (args.method) {
      case "mina_accounts":
        return (await this.vault.getAccounts()) as unknown as T
      case "mina_addChain": {
        throw this.createProviderRpcError(4200, "Unsupported Method")
      }
      case "mina_switchChain": {
        throw this.createProviderRpcError(4200, "Unsupported Method")
      }
      case "mina_requestNetwork": {
        {
          const userConfirmed = await this.userPrompt("confirmation", {
            title: "Request to current Mina network information.",
            payload: JSON.stringify(params),
          })
          if (!userConfirmed) {
            throw this.createProviderRpcError(4001, "User Rejected Request")
          }
          const requestNetworkResponse = await this.vault.requestNetwork()
          return requestNetworkResponse as unknown as T
        }
      }
      case "mina_sign":
      case "mina_createNullifier":
      case "mina_signFields":
      case "mina_signTransaction": {
        const passphrase = <string>await this.userPrompt("password", {
          title: "Signature request",
          payload: JSON.stringify(params),
        })
        if (passphrase === null)
          throw this.createProviderRpcError(4100, "Unauthorized.")
        const operationArgs: ChainOperationArgs = {
          operation: args.method,
          network: "Mina",
        }

        if (args.method === "mina_signFields") {
          const requestData = params as Validation.SignFieldsData
          const signable = {
            fields: requestData.fields.map((item: any) => {
              // Convert to BigInt only if the item is a number
              if (typeof item === "number") {
                return BigInt(item)
              }
              // If it's not a number, return the item as is
              return item
            }),
          } as MinaSignablePayload
          const signedResponse = (await this.sign({
            signable,
            operationArgs,
            passphrase,
          })) as Mina.SignedFields
          // serialise the response if mina_signFields
          const serializedResponseData = signedResponse.data.map((item) => {
            // Convert to BigInt only if the item is a number
            if (typeof item === "bigint") {
              return String(item)
            }
            // If it's not a number, return the item as is
            return item
          })
          const seriliasedResponse = {
            ...signedResponse,
            data: serializedResponseData,
          }
          return seriliasedResponse as unknown as T
        }
        if (args.method === "mina_createNullifier") {
          const requestData = params as Validation.CreateNullifierData
          const signable = {
            message: requestData.message.map((item) => {
              // Convert to BigInt only if the item is a number
              if (typeof item === "number") {
                return BigInt(item)
              }
              // If it's not a number, return the item as is
              return item
            }),
          } as MinaSignablePayload
          const signedResponse = (await this.sign({
            signable,
            operationArgs,
            passphrase,
          })) as BorrowedTypes.Nullifier
          // serialise the response if mina_createNullifier
          const serializedResponseData = {
            publicKey: serializeGroup(signedResponse.publicKey),
            public: {
              nullifier: serializeGroup(signedResponse.public.nullifier),
              s: serializeField(signedResponse.public.s),
            },
            private: {
              c: serializeField(signedResponse.private.c),
              g_r: serializeGroup(signedResponse.private.g_r),
              h_m_pk_r: serializeGroup(signedResponse.private.h_m_pk_r),
            },
          }

          return serializedResponseData as unknown as T
        }
        if (args.method === "mina_signTransaction") {
          const requestData = params as Validation.SignTransactionData
          const signable = serializeTransaction({
            ...requestData.transaction,
            memo: requestData.transaction.memo ?? "",
            validUntil: requestData.transaction.validUntil ?? 4294967295,
            amount: requestData.transaction.amount ?? 0,
            type: TransactionType.PAYMENT,
          }) as MinaSignablePayload
          return (await this.sign({
            signable,
            operationArgs,
            passphrase,
          })) as unknown as T
        }
        const requestData = params as Validation.SignMessageData
        return (await this.sign({
          signable: requestData,
          operationArgs,
          passphrase,
        })) as unknown as T
      }
      case "mina_getBalance":
        return (await this.vault.getBalance()) as unknown as T

      case "mina_getState": {
        const { query, props } = params as Validation.GetStateData
        const credentials = await this.vault.getState(query as any, props)
        const confirmation = await this.userPrompt("confirmation", {
          title: "Credential read request",
          payload: JSON.stringify({ ...params, credentials }),
        })
        if (!confirmation) {
          throw this.createProviderRpcError(4001, "User Rejected Request")
        }
        return credentials as unknown as T
      }

      case "mina_setState": {
        const confirmation = await this.userPrompt("confirmation", {
          title: "Credential write request",
          payload: JSON.stringify(params),
        })
        if (!confirmation) {
          throw this.createProviderRpcError(4001, "User Rejected Request")
        }
        const requestData = params as Validation.SetStateData
        await this.vault.setState(requestData as any)
        return { success: true } as unknown as T
      }

      case "mina_chainId": {
        return (await this.vault.getChainId()) as unknown as T
      }

      case "mina_sendTransaction": {
        const requestData = params as Validation.SendTransactionData
        const passphrase = await this.userPrompt("password", {
          title: "Send transaction request",
          payload: JSON.stringify(params),
        })
        if (passphrase === null)
          throw this.createProviderRpcError(4100, "Unauthorized.")
        return this.vault.submitTransaction(requestData) as unknown as T
      }

      default:
        throw this.createProviderRpcError(4200, "Unsupported Method")
    }
  }

  protected getRpcConfig(ops: ChainProviderOptions) {
    return {
      chains: ops.chains || [],
      optionalChains: ops.optionalChains || [],
      rpcMap: ops.rpcMap || {},
      projectId: ops.projectId,
      methods: REQUIRED_METHODS, // Use required methods from constants
      optionalMethods: OPTIONAL_METHODS, // Use optional methods from constants
      unauthorizedMethods: this.rpc.unauthorizedMethods!,
      events: REQUIRED_EVENTS, // Use required events from constants
      optionalEvents: OPTIONAL_EVENTS, // Use optional events from constants
    }
  }

  protected getRpcUrl(chainId: string /*, projectId?: string*/) {
    const providedRpc = this.rpc.rpcMap?.[chainId]
    return providedRpc
  }
}
