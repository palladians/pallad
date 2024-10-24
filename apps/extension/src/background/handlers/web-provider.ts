import { serializeError } from "serialize-error"
import type { Handler } from "."
import {
  MinaProvider,
  Validation,
} from "../../../../../packages/web-provider/src"

export const minaSetState: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.setStateRequestSchema.parse(data)
    return await provider.request({
      method: "mina_setState",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaAddChain = async () => {
  return { error: serializeError(new Error("4200 - Unsupported Method")) }
}

export const minaRequestNetwork: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_requestNetwork",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSwitchChain = async () => {
  return { error: serializeError(new Error("4200 - Unsupported Method")) }
}

export const minaGetState: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.getStateRequestSchema.parse(data)
    return await provider.request({
      method: "mina_getState",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaChainId: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_chainId",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaAccounts: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_accounts",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaRequestAccounts: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_requestAccounts",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSign: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.signMessageRequestSchema.parse(data)
    return await provider.request({
      method: "mina_sign",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSignFields: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.signFieldsRequestSchema.parse(data)
    return await provider.request({
      method: "mina_signFields",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSignTransaction: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.signTransactionRequestSchema.parse(data)
    return await provider.request({
      method: "mina_signTransaction",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaGetBalance: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.requestSchema.parse(data)
    return await provider.request({
      method: "mina_getBalance",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaCreateNullifier: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.createNullifierRequestSchema.parse(data)
    return await provider.request({
      method: "mina_createNullifier",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const minaSendTransaction: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const params = Validation.sendTransactionRequestSchema.parse(data)
    return await provider.request({
      method: "mina_sendTransaction",
      params,
    })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}

export const palladIsConnected: Handler = async ({ data }) => {
  try {
    const provider = await MinaProvider.getInstance()
    const { origin } = Validation.requestSchema.parse(data)
    return await provider.isConnected({ origin })
  } catch (error: unknown) {
    return { error: serializeError(error) }
  }
}
