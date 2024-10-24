import { utf8ToBytes } from "@noble/hashes/utils"
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
import EventEmitter from "eventemitter3"
import type { Validation } from "."
import { showUserPrompt } from "../utils/prompts"
import { type VaultService, vaultService } from "../vault-service"
import type { ConnectOps, RequestArguments } from "../web-provider-types"
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

export function getMinaChainId(chains: string[]) {
  return Number(chains[0]?.split(":")[1])
}

export class MinaProvider extends EventEmitter {
  private static instance: MinaProvider
  public accounts: string[] = []
  public chainId: string | undefined = undefined
  private _vault: VaultService

  private userPrompt: typeof showUserPrompt

  constructor() {
    super()
    this._vault = vaultService
    this.userPrompt = showUserPrompt
  }

  static async init() {
    const provider = new MinaProvider()
    await provider.initialize()
    return provider
  }

  public static async getInstance() {
    if (!MinaProvider.instance) {
      MinaProvider.instance = await MinaProvider.init()
    }
    return MinaProvider.instance
  }

  private async initialize() {
    this.chainId = await this._vault.getChainId()
  }

  async unlockWallet() {
    const passphrase = await this.userPrompt({
      inputType: "password",
      metadata: {
        title: "Unlock your wallet",
        submitButtonLabel: "Unlock",
        rejectButtonLabel: "Cancel",
      },
    })
    if (passphrase === null)
      throw this.createProviderRpcError(4100, "Unauthorized")
    await this._vault.unlockWallet(passphrase as string)
  }

  async verifyInitialized() {
    const { PalladApp } = await chrome.storage.local.get("PalladApp")
    if (!PalladApp) return false
    return !PalladApp.includes("UNINITIALIZED")
  }

  async checkAndUnlock() {
    const locked = await this._vault.isLocked()
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
    const userConfirmed = await this.userPrompt({
      inputType: "confirmation",
      metadata: {
        title: "Connection request.",
        payload: JSON.stringify({ origin }),
      },
      emitConnected: true,
    })
    if (!userConfirmed) {
      // should this emit an error event?
      throw this.createProviderRpcError(4001, "User Rejected Request")
    }
    await this.connect({ origin })
    // TODO: perform 'mina_requestAccounts' method
    return await this._vault.getAccounts()
  }
  public async connect(opts: ConnectOps) {
    try {
      // Step 1: Check if already connected.
      if (await this._vault.getEnabled({ origin: opts.origin }))
        throw this.createProviderRpcError(4100, "Already enabled.")
      // Step 2: Attempt to connect to a chain.
      if (!opts.chains) {
        // Try to connect to the default chain -- this is actually the current chain the wallet is connected to not the default chain
        const defaultChainId = await this._vault.getChainId()
        if (!defaultChainId) {
          throw this.createProviderRpcError(4100, "Chain ID is undefined.")
        }
        this.chainId = defaultChainId
      } else if (opts.chains && opts.chains.length > 0) {
        this.chainId = String(opts.chains[0])
      } else {
        throw this.createProviderRpcError(4901, "Chain Disconnected")
      }
      await this._vault.setEnabled({ origin: opts.origin })
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
    return await this._vault.getEnabled({ origin })
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
      return await this._vault.sign(signable, operationArgs, () =>
        utf8ToBytes(passphrase),
      )
    } catch (error) {
      throw this.createProviderRpcError(4100, "Unauthorized")
    }
  }
  public async request<T = unknown>(args: RequestArguments): Promise<T> {
    // Step 1: Check if request instantiator is in blocked list.
    const { params } = args
    const requestOrigin = params.origin
    if (!requestOrigin) {
      throw this.createProviderRpcError(4100, "Unauthorized")
    }
    if (await this._vault.isBlocked({ origin: requestOrigin })) {
      throw this.createProviderRpcError(4100, "Unauthorized")
    }
    const initialized = await this.verifyInitialized()
    if (!initialized) {
      throw this.createProviderRpcError(4100, "Unauthorized")
    }

    const locked = await this._vault.isLocked()
    const enabled = await this._vault.getEnabled({ origin: requestOrigin })
    if ((locked || !enabled) && args.method === "mina_accounts") {
      return [] as T
    }

    if (locked) await this.unlockWallet()
    if (!enabled) await this.enable({ origin: requestOrigin })

    switch (args.method) {
      case "mina_accounts":
      case "mina_requestAccounts":
        return (await this._vault.getAccounts()) as unknown as T
      case "mina_addChain": {
        throw this.createProviderRpcError(4200, "Unsupported Method")
      }
      case "mina_switchChain": {
        throw this.createProviderRpcError(4200, "Unsupported Method")
      }
      case "mina_requestNetwork": {
        {
          const userConfirmed = await this.userPrompt({
            inputType: "confirmation",
            metadata: {
              title: "Request to current Mina network information.",
              payload: JSON.stringify(params),
            },
          })
          if (!userConfirmed) {
            throw this.createProviderRpcError(4001, "User Rejected Request")
          }
          const requestNetworkResponse = await this._vault.requestNetwork()
          return requestNetworkResponse as unknown as T
        }
      }
      case "mina_sign":
      case "mina_createNullifier":
      case "mina_signFields":
      case "mina_signTransaction": {
        const passphrase = <string>await this.userPrompt({
          inputType: "password",
          metadata: {
            title: "Signature request",
            payload: JSON.stringify(params),
          },
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
        return (await this._vault.getBalance()) as unknown as T

      case "mina_getState": {
        const { query, props } = params as Validation.GetStateData
        const credentials = await this._vault.getState(query as any, props)
        const confirmation = await this.userPrompt({
          inputType: "confirmation",
          metadata: {
            title: "Credential read request",
            payload: JSON.stringify({ ...params, credentials }),
          },
        })
        if (!confirmation) {
          throw this.createProviderRpcError(4001, "User Rejected Request")
        }
        return credentials as unknown as T
      }

      case "mina_setState": {
        const confirmation = await this.userPrompt({
          inputType: "confirmation",
          metadata: {
            title: "Credential write request",
            payload: JSON.stringify(params),
          },
        })
        if (!confirmation) {
          throw this.createProviderRpcError(4001, "User Rejected Request")
        }
        const requestData = params as Validation.SetStateData
        await this._vault.setState(requestData as any)
        return { success: true } as unknown as T
      }

      case "mina_chainId": {
        return (await this._vault.getChainId()) as unknown as T
      }

      case "mina_sendTransaction": {
        const requestData = params as Validation.SendTransactionData
        const passphrase = await this.userPrompt({
          inputType: "password",
          metadata: {
            title: "Send transaction request",
            payload: JSON.stringify(params),
          },
        })
        if (passphrase === null)
          throw this.createProviderRpcError(4100, "Unauthorized.")
        try {
          return (await this._vault.submitTransaction(
            requestData,
          )) as unknown as T
        } catch (error: any) {
          throw this.createProviderRpcError(
            4100,
            "Unauthorized. Coudldn't broadscast transaction. Make sure nonce is correct.",
          )
        }
      }

      default:
        throw this.createProviderRpcError(4200, "Unsupported Method")
    }
  }
}
