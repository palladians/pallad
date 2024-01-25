import { fetchPals } from '../utils/fetch-utils'
import { healthCheck, HealthCheckResponse } from '../utils/health-check-utils'

export type getAddressFromHandleArgs = {
  handle: string
}

export type getAddressFromHandleResponse = {
  address: string
}

export type getSearchAddressFromPartialResponse = {
  addresses: string[]
}

export interface PalsHandleProvider {
  healthCheck: () => Promise<HealthCheckResponse>
  getAddressFromHandle: (
    args: getAddressFromHandleArgs
  ) => Promise<getAddressFromHandleResponse>
  getSearchedHandles: (
    args: getAddressFromHandleArgs
  ) => Promise<getSearchAddressFromPartialResponse>
}

export const createPalsHandleProvider = (url: string): PalsHandleProvider => {
  const getAddressFromHandle = async (
    args: getAddressFromHandleArgs
  ): Promise<getAddressFromHandleResponse> => {
    const result = await fetchPals(url + `/address/${args.handle}`)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const responseData = result.data
    const responseObject: getAddressFromHandleResponse = {
      address: responseData.address
    }

    return responseObject
  }

  const getSearchedHandles = async (
    args: getAddressFromHandleArgs
  ): Promise<getSearchAddressFromPartialResponse> => {
    const queryParams = { moniker: args.handle }
    const result = await fetchPals(url + `/search`, queryParams)

    if (!result.ok) {
      throw new Error(result.message)
    }

    const responseData = result.data
    const responseObject: getSearchAddressFromPartialResponse = {
      addresses: responseData
    }

    return responseObject
  }

  return {
    healthCheck: () => healthCheck(url),
    getSearchedHandles,
    getAddressFromHandle
  }
}
