import { GraphQLClient } from 'graphql-request'

import { customFetch } from './custom-fetch'
import { defaultJsonSerializer } from './json-serializer'

type ErrorPolicy = 'ignore' | 'all' // Define more types if needed
type FetchFunctionType = typeof fetch // Assuming you are using the standard Fetch API

export const createGraphQLRequest = (
  url: string,
  errorPolicy: ErrorPolicy = 'ignore',
  fetchFunction: FetchFunctionType | undefined = undefined
) => {
  const graphqlClient = new GraphQLClient(url, {
    errorPolicy,
    jsonSerializer: defaultJsonSerializer,
    fetch: fetchFunction || customFetch
  })

  const request = async <T = any>(
    query: string,
    variables: Record<string, any> = {}
  ): Promise<{ ok: boolean; data?: T; message?: string }> => {
    try {
      const response = await graphqlClient.request<T>(query, variables)
      return { ok: true, data: response }
    } catch (error) {
      console.error('Error during GraphQL request:', error)
      if (error instanceof Error) {
        return { ok: false, message: error.message }
      }
      return { ok: false, message: 'An unknown error occurred' }
    }
  }

  return request
}
