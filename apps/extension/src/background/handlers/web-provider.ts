import {
  AccountsRequestParamsSchema,
  ChainIdRequestParamsSchema,
  ChainInformationRequestParamsSchema,
  CreateNullifierRequestParamsSchema,
  GetBalanceRequestParamsSchema,
  GetStateRequestParamsSchema,
  RequestAccountsRequestParamsSchema,
  SendTransactionRequestParamsSchema,
  SetStateRequestParamsSchema,
  SignFieldsRequestParamsSchema,
  SignRequestParamsSchema,
  SignTransactionRequestParamsSchema,
} from "@mina-js/providers"
import { serializeError } from "serialize-error"
import { z } from "zod"
import type { Handler } from "."
import { createMinaProvider } from "../../../../../packages/web-provider/src"

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

export const minaSwitchChain = async () => {
  return { error: serializeError(new Error("4200 - Unsupported Method")) }
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

export const minaChainId: Handler = async ({ data }) => {
  try {
    const provider = await createMinaProvider()
    const payload = ChainIdRequestParamsSchema.parse({
      method: "mina_chainId",
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
