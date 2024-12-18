import type {
  MinaProviderClient,
  ProviderRequestParams,
} from "@mina-js/providers"
import type {
  Nullifier,
  SignedFields,
  SignedMessage,
  SignedTransaction,
} from "@mina-js/utils"
import { utf8ToBytes } from "@noble/hashes/utils"
import type {
  ChainOperationArgs,
  ChainSignablePayload,
} from "@palladco/key-management"
import type { SearchQuery, StoredObject } from "@palladco/vault"
import mitt from "mitt"
import { P, match } from "ts-pattern"
import { showUserPrompt } from "../utils/prompts"
import { createVaultService } from "../vault-service"
import type { ConnectOps } from "../web-provider-types"
import { createCredentialHash, serializeField, serializeGroup } from "./utils"

export function getMinaChainId(chains: string[]) {
  return Number(chains[0]?.split(":")[1])
}

const createProviderRpcError = (code: number, message: string) => {
  const error = new Error(`${code} - ${message}`)
  error.name = "ProviderRpcError"
  return error
}

const verifyInitialized = async () => {
  const { PalladApp } = await chrome.storage.local.get("PalladApp")
  if (!PalladApp) return false
  return !PalladApp.includes("UNINITIALIZED")
}

export const createMinaProvider = async (): Promise<
  MinaProviderClient & { emit: (type: any, event: any) => void }
> => {
  const _emitter = mitt()
  const _vault = createVaultService()
  const unlockWallet = async () => {
    const { value: passphrase } = await showUserPrompt<string>({
      inputType: "password",
      metadata: {
        title: "Unlock your wallet",
        submitButtonLabel: "Unlock",
        rejectButtonLabel: "Cancel",
      },
    })

    if (passphrase === null) throw createProviderRpcError(4100, "Unauthorized")
    await _vault.unlockWallet(passphrase)
  }
  const connectOrigin = async (opts: ConnectOps) => {
    try {
      if (await _vault.getEnabled({ origin: opts.origin }))
        throw createProviderRpcError(4100, "Already enabled.")
      if (!opts.chains) {
        const defaultChainId = await _vault.getNetworkId()
        if (!defaultChainId) {
          throw createProviderRpcError(4100, "Chain ID is undefined.")
        }
      }
      await _vault.setEnabled({ origin: opts.origin })
    } catch (error) {
      console.error("Error during connection:", error)
    }
  }
  const checkAndUnlockWallet = async () => {
    const locked = await _vault.isLocked()
    if (locked === true) {
      await unlockWallet()
    }
  }
  const enableOrigin = async ({ origin }: { origin: string }) => {
    await checkAndUnlockWallet()
    const userConfirmed = await showUserPrompt<boolean>({
      inputType: "confirmation",
      metadata: {
        title: "Connection request.",
        payload: JSON.stringify({ origin }),
      },
      emitConnected: true,
    })
    if (!userConfirmed) {
      throw createProviderRpcError(4001, "User Rejected Request")
    }
    await connectOrigin({ origin })
    return _vault.getAccounts()
  }
  const signPayload = async <T>({
    signable,
    operationArgs,
    passphrase,
  }: {
    signable: ChainSignablePayload
    operationArgs: ChainOperationArgs
    passphrase: string
  }) => {
    try {
      return (await _vault.sign(signable, operationArgs, () =>
        utf8ToBytes(passphrase),
      )) as T
    } catch (error) {
      throw createProviderRpcError(4100, "Unauthorized: signPayload")
    }
  }
  return {
    on: _emitter.on,
    removeListener: _emitter.off,
    emit: _emitter.emit,
    request: async (args) => {
      const typedArgs: ProviderRequestParams = args
      const { context } = typedArgs
      const { origin } = context as Record<string, string>
      if (!origin) {
        throw createProviderRpcError(4100, "Unauthorized: origin")
      }
      if (await _vault.isBlocked({ origin })) {
        throw createProviderRpcError(4100, "Unauthorized: isBlocked")
      }
      const initialized = await verifyInitialized()
      if (!initialized) {
        throw createProviderRpcError(4100, "Unauthorized: initialized")
      }
      const locked = await _vault.isLocked()
      const enabled = await _vault.getEnabled({ origin })
      if ((locked || !enabled) && typedArgs.method === "mina_accounts") {
        return []
      }
      if (locked) await unlockWallet()
      if (!enabled) await enableOrigin({ origin })
      return match(typedArgs)
        .with(
          { method: P.union("mina_accounts", "mina_requestAccounts") },
          _vault.getAccounts,
        )
        .with({ method: "mina_getBalance" }, _vault.getBalance)
        .with({ method: "mina_networkId" }, _vault.getNetworkId)
        .with({ method: "mina_addChain" }, () =>
          createProviderRpcError(4200, "Unsupported Method"),
        )
        .with({ method: "mina_switchChain" }, async ({ params }) => {
          const [networkId] = params
          if (!networkId) {
            throw createProviderRpcError(4100, "Unauthorized.")
          }
          const networkIds = await _vault.getNetworkIds()
          if (!networkIds.includes(networkId)) {
            throw createProviderRpcError(4100, "Unauthorized.")
          }
          const { value: userConfirmed } = await showUserPrompt<boolean>({
            inputType: "confirmation",
            metadata: {
              title: "Switch to different chain.",
              payload: JSON.stringify({ networkId }),
            },
          })
          if (!userConfirmed) {
            throw createProviderRpcError(4001, "User Rejected Request")
          }
          await _vault.switchNetwork(networkId)
          return networkId
        })
        .with({ method: "mina_requestNetwork" }, async () => {
          const { value: userConfirmed } = await showUserPrompt<boolean>({
            inputType: "confirmation",
            metadata: {
              title: "Request to current Mina network information.",
            },
          })
          if (!userConfirmed) {
            throw createProviderRpcError(4001, "User Rejected Request")
          }
          const requestNetworkResponse = await _vault.requestNetwork()
          return requestNetworkResponse
        })
        .with(
          { method: P.union("mina_sign", "mina_signTransaction") },
          async (signatureRequest) => {
            const { value: passphrase } = await showUserPrompt<string>({
              inputType: "password",
              metadata: {
                title: "Signature request",
                payload: JSON.stringify(signatureRequest.params),
              },
            })
            if (passphrase === null)
              throw createProviderRpcError(4100, "Unauthorized.")
            const operationArgs: ChainOperationArgs = {
              operation: args.method,
              network: "Mina",
            }
            return match(signatureRequest)
              .with({ method: "mina_signTransaction" }, ({ params }) => {
                const payload = params?.[0]
                if (!payload) {
                  throw createProviderRpcError(4100, "Unauthorized.")
                }
                if ("transaction" in payload) {
                  return signPayload<SignedTransaction>({
                    signable: payload,
                    operationArgs,
                    passphrase,
                  })
                }
                return signPayload<SignedTransaction>({
                  signable: payload,
                  operationArgs,
                  passphrase,
                })
              })
              .with({ method: "mina_sign" }, ({ params }) => {
                const [message] = params as string[]
                return signPayload<SignedMessage>({
                  signable: { message: message as string },
                  operationArgs,
                  passphrase,
                })
              })
              .exhaustive()
          },
        )
        .with(
          { method: P.union("mina_createNullifier", "mina_signFields") },
          async (signatureRequest) => {
            const { value: passphrase } = await showUserPrompt<string>({
              inputType: "password",
              metadata: {
                title: "Signature request",
                payload: JSON.stringify(signatureRequest.params),
              },
            })
            if (passphrase === null)
              throw createProviderRpcError(4100, "Unauthorized.")
            const operationArgs: ChainOperationArgs = {
              operation: args.method,
              network: "Mina",
            }
            return match(signatureRequest)
              .with({ method: "mina_signFields" }, async ({ params }) => {
                const [fields] = params
                if (!fields || !fields.length) {
                  throw createProviderRpcError(4100, "Unauthorized.")
                }
                const signedResponse = await signPayload<SignedFields>({
                  signable: {
                    fields: fields.map((item: any) => BigInt(item)),
                  },
                  operationArgs,
                  passphrase,
                })
                const serializedResponseData = signedResponse.data.map(
                  (item) => {
                    if (typeof item === "bigint") {
                      return String(item)
                    }
                    return item
                  },
                )
                const seriliasedResponse = {
                  ...signedResponse,
                  data: serializedResponseData,
                }
                return seriliasedResponse
              })
              .with({ method: "mina_createNullifier" }, async ({ params }) => {
                const [message] = params
                if (!message || !message.length) {
                  throw createProviderRpcError(4100, "Unauthorized.")
                }
                const signedResponse = await signPayload<Nullifier>({
                  signable: {
                    message: message.map((item: any) => BigInt(item)),
                  },
                  operationArgs,
                  passphrase,
                })
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
                return serializedResponseData
              })
              .exhaustive()
          },
        )
        .with(
          { method: "mina_signFieldsWithPassphrase" },
          async ({ params }) => {
            const [fieldsAndPassphrase] = params
            if (
              !fieldsAndPassphrase ||
              !fieldsAndPassphrase.fields ||
              !fieldsAndPassphrase.fields.length ||
              !fieldsAndPassphrase.passphrase
            ) {
              throw createProviderRpcError(
                4100,
                `Unauthorized. fieldsAndPassphrase: ${JSON.stringify(fieldsAndPassphrase)}`,
              )
            }
            const { fields, passphrase } = fieldsAndPassphrase

            const operationArgs: ChainOperationArgs = {
              operation: args.method,
              network: "Mina",
            }

            const signedResponse = await signPayload<SignedFields>({
              signable: {
                fields: fields.map((item: any) => BigInt(item)),
              },
              operationArgs,
              passphrase,
            })

            const serializedResponseData = signedResponse.data.map((item) => {
              if (typeof item === "bigint") {
                return String(item)
              }
              return item
            })

            const seriliasedResponse = {
              ...signedResponse,
              data: serializedResponseData,
            }

            return seriliasedResponse
          },
        )
        .with({ method: "mina_getState" }, async ({ params }) => {
          const [query, props] = params
          const credentials = await _vault.getState(
            query as SearchQuery,
            props as string[],
          )
          const { value: confirmation } = await showUserPrompt<boolean>({
            inputType: "confirmation",
            metadata: {
              title: "Credential read request",
              payload: JSON.stringify({ ...params, credentials }),
            },
          })
          if (!confirmation) {
            throw createProviderRpcError(4001, "User Rejected Request")
          }
          return credentials
        })
        .with({ method: "mina_setState" }, async ({ params }) => {
          const [credential] = params
          if (!credential) throw createProviderRpcError(4000, "Invalid Request")
          const { value: confirmation } = await showUserPrompt<boolean>({
            inputType: "confirmation",
            metadata: {
              title: "Credential write request",
              payload: JSON.stringify(credential),
            },
          })
          if (!confirmation) {
            throw createProviderRpcError(4001, "User Rejected Request")
          }
          const { id } = credential as { id: string }
          await _vault.setState({ credentialId: id, credential })
          return { success: true }
        })
        .with({ method: "mina_storePrivateCredential" }, async ({ params }) => {
          const [credential] = params
          if (!credential) throw createProviderRpcError(4000, "Invalid Request")

          const stringifiedCredential = JSON.stringify(credential)

          let credentialToStore

          try {
            const credentialWitnessType = credential.witness.type
            if (credentialWitnessType === "unsigned") {
              const { value: userConfirmed } = await showUserPrompt<boolean>({
                inputType: "confirmation",
                metadata: {
                  title: "Store private credential request",
                  payload: stringifiedCredential,
                },
              })

              if (!userConfirmed) {
                throw createProviderRpcError(4001, "User Rejected Request")
              }

              credentialToStore = stringifiedCredential
            } else {
              // prompt user to approve incoming credential and validate if approved
              const { value: userConfirmed, result } =
                await showUserPrompt<boolean>({
                  inputType: "confirmation",
                  contract: "validate-credential",
                  metadata: {
                    title: "Store Private Credential",
                    payload: stringifiedCredential,
                  },
                })

              if (!userConfirmed) {
                throw createProviderRpcError(4001, "User Rejected Request")
              }

              if (result?.error) {
                throw createProviderRpcError(
                  4100,
                  `Credential validation failed: ${JSON.stringify(result.error)}`,
                )
              }

              if (!result?.result) {
                throw createProviderRpcError(4100, "Missing validation result")
              }

              credentialToStore = result.result
            }

            // Generate hash of the new credential
            const newCredentialHash = createCredentialHash(credential)

            // Get existing credentials and check for duplicates
            const existingCredentials = await _vault.getPrivateCredential()
            const isDuplicate = existingCredentials.some((existing) => {
              const existingHash = createCredentialHash(existing)
              return existingHash === newCredentialHash
            })

            if (isDuplicate) {
              throw createProviderRpcError(4100, "Credential already stored")
            }

            try {
              const parsedResult = JSON.parse(credentialToStore)
              await _vault.storePrivateCredential(parsedResult)
              return { success: parsedResult }
            } catch (error: any) {
              throw createProviderRpcError(
                4100,
                `Failed to store private credential: ${error}`,
              )
            }
          } catch (error: any) {
            throw createProviderRpcError(
              4100,
              error.message || "Failed to validate credential",
            )
          }
        })
        .with({ method: "mina_requestPresentation" }, async ({ params }) => {
          try {
            const [request] = params
            if (!request) throw createProviderRpcError(4000, "Invalid Request")

            const { presentationRequest, zkAppAccount } = request

            const verifierIdentity =
              presentationRequest.type === "zk-app" ? zkAppAccount : origin

            // Ask for approval to proceed with the presentation request
            const { value: userConfirmed } = await showUserPrompt<boolean>({
              inputType: "confirmation",
              metadata: {
                title: "Presentation request",
                payload: JSON.stringify({
                  origin,
                  presentationRequest,
                  verifierIdentity: verifierIdentity,
                }),
              },
            })

            if (!userConfirmed) {
              throw createProviderRpcError(4001, "User Rejected Request")
            }

            // Get stored credentials that could be used for the presentation
            const storedCredentials: StoredObject[] =
              await _vault.getPrivateCredential()

            // Show credential selection prompt
            const { value: selectedCredentials } = await showUserPrompt<string>(
              {
                inputType: "selection",
                metadata: {
                  title: "Select credentials for presentation",
                  payload: JSON.stringify({
                    presentationRequest,
                    storedCredentials,
                  }),
                  submitButtonLabel: "Continue",
                  rejectButtonLabel: "Cancel",
                },
              },
            )

            if (!selectedCredentials) {
              throw createProviderRpcError(
                4001,
                "User Rejected Credential Selection",
              )
            }

            const { value: passphrase, result } = await showUserPrompt<string>({
              inputType: "password",
              contract: "presentation",
              metadata: {
                title: "Create presentation",
                payload: JSON.stringify({
                  verifierIdentity,
                  presentationRequest,
                  selectedCredentials: JSON.parse(selectedCredentials),
                }),
              },
            })

            if (passphrase === null)
              throw createProviderRpcError(4100, "Unauthorized.")

            if (result?.error) {
              throw createProviderRpcError(
                4100,
                `Presentation creation failed: ${JSON.stringify(result.error)}`,
              )
            }

            if (!result?.result) {
              throw createProviderRpcError(4100, "Missing presentation result")
            }

            return result.result
          } catch (error: any) {
            throw createProviderRpcError(
              4100,
              error.message || "Failed to create presentation",
            )
          }
        })
        .with({ method: "mina_sendTransaction" }, async ({ params }) => {
          const [payload] = params
          if (!payload) throw createProviderRpcError(4000, "Invalid Request")
          const { value: passphrase } = await showUserPrompt<string>({
            inputType: "password",
            metadata: {
              title: "Send transaction request",
              payload: JSON.stringify(payload),
            },
          })
          if (passphrase === null)
            throw createProviderRpcError(4100, "Unauthorized.")
          try {
            return _vault.submitTransaction(payload)
          } catch (error: any) {
            throw createProviderRpcError(
              4100,
              "Unauthorized. Coudldn't broadscast transaction. Make sure nonce is correct.",
            )
          }
        })
        .exhaustive() as any
    },
  }
}
