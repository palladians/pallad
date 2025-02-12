import {
  AccountsRequestParamsSchema,
  ChainInformationRequestParamsSchema,
  CreateNullifierRequestParamsSchema,
  GetBalanceRequestParamsSchema,
  GetStateRequestParamsSchema,
  NetworkIdRequestParamsSchema,
  // PresentationRequestParamsSchema, // TODO update these in mina-js and import again
  RequestAccountsRequestParamsSchema,
  SendTransactionRequestParamsSchema,
  SetStateRequestParamsSchema,
  SignFieldsRequestParamsSchema,
  SignRequestParamsSchema,
  SignTransactionRequestParamsSchema,
  // StorePrivateCredentialRequestParamsSchema,
  SwitchChainRequestParamsSchema,
} from "@mina-js/providers"
import {
  SignFieldsWithPassphraseRequestParams,
  createMinaProvider,
} from "@palladco/web-provider"
import { serializeError } from "serialize-error"
import { z } from "zod"
import type { Handler } from "."
import {
  PresentationRequestParamsSchema,
  StorePrivateCredentialRequestParamsSchema,
} from "./mina-attestations-schemas"

export const OriginSchema = z.string().url()

export const minaSetState: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SetStateRequestParamsSchema.parse({
      method: "mina_setState",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaAddChain = async () => {
  return { error: serializeError(new Error("4200 - Unsupported Method")) }
}

export const minaRequestNetwork: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = ChainInformationRequestParamsSchema.parse({
      method: "mina_chainInformation",
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSwitchChain: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SwitchChainRequestParamsSchema.parse({
      method: "mina_switchChain",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaGetState: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = GetStateRequestParamsSchema.parse({
      method: "mina_getState",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaNetworkId: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = NetworkIdRequestParamsSchema.parse({
      method: "mina_networkId",
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaAccounts: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = AccountsRequestParamsSchema.parse({
      method: "mina_accounts",
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaRequestAccounts: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = RequestAccountsRequestParamsSchema.parse({
      method: "mina_requestAccounts",
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSign: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SignRequestParamsSchema.parse({
      method: "mina_sign",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSignFields: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SignFieldsRequestParamsSchema.parse({
      method: "mina_signFields",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSignFieldsWithPassphrase: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SignFieldsWithPassphraseRequestParams.parse({
      method: "mina_signFieldsWithPassphrase",
      params: data.params,
      context: data.context,
    })
    const response = await provider.request(payload)
    return response
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSignTransaction: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SignTransactionRequestParamsSchema.parse({
      method: "mina_signTransaction",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaGetBalance: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = GetBalanceRequestParamsSchema.parse({
      method: "mina_getBalance",
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaCreateNullifier: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = CreateNullifierRequestParamsSchema.parse({
      method: "mina_createNullifier",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSendTransaction: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = SendTransactionRequestParamsSchema.parse({
      method: "mina_sendTransaction",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaStorePrivateCredential: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = StorePrivateCredentialRequestParamsSchema.parse({
      method: "mina_storePrivateCredential",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaRequestPresentation: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = PresentationRequestParamsSchema.parse({
      method: "mina_requestPresentation",
      params: data.params,
      context: data.context,
    })
    return await provider.request(payload)
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}
