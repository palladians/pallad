import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'
import { gql, GraphQLClient } from 'graphql-request'
import JSONbig from 'json-bigint'

import { getAccountBalance, healthCheckQuery } from './queries'

export interface AccountData {
  account: AccountInfo
}

const customFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const response = await fetch(input, init)
  const text = await response.text()
  const parsed = JSONbig.parse(text)
  return new Response(JSON.stringify(parsed), {
    status: response.status,
    statusText: response.statusText,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...response.headers
    })
  })
}

export class AccountInfoGraphQLProvider implements AccountInfoProvider {
  private minaGql: string | null

  constructor(minaGql: string) {
    this.minaGql = minaGql
  }

  public async destroy(): Promise<void> {
    console.log('Destroying AccountInfoGraphQLProvider...')
    this.minaGql = null
  }

  async changeNetwork(minaGql: string): Promise<void> {
    this.minaGql = minaGql
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    console.log('Initiating health check...')
    const query = gql`
      ${healthCheckQuery}
    `

    try {
      console.log(`Sending GraphQL request to: ${this.minaGql}`)
      const jsonSerializer = JSONbig({ useNativeBigInt: true })
      const client = new GraphQLClient(this.minaGql as string, {
        errorPolicy: 'ignore',
        jsonSerializer,
        fetch: customFetch
      })
      const rawResponse: any = await client.request(query)

      // Check for syncStatus directly in the response
      const syncStatus = rawResponse.syncStatus || rawResponse.data?.syncStatus

      if (!syncStatus) {
        console.log('Sync status not found in response')
        return { ok: false, message: 'Sync status not found' }
      }

      console.log(`Extracted syncStatus: ${syncStatus}`)
      if (syncStatus === 'SYNCED') {
        console.log('Health check passed with SYNCED status.')
        return { ok: true }
      } else {
        console.log(`Health check failed. Sync status: ${syncStatus}`)
        return {
          ok: false,
          message: `Health check failed. Sync status: ${syncStatus}`
        }
      }
    } catch (error) {
      console.error('Error during GraphQL request:', error)
      return { ok: false, message: 'GraphQL request failed' }
    }
  }

  async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    console.log('Initiating getAccountInfo with args:', args)
    const query = gql`
      ${getAccountBalance}
    `

    try {
      console.log('Sending request for account info...')
      // redundant creation of client, but this is a temporary solution
      const jsonSerializer = JSONbig({ useNativeBigInt: true })
      const client = new GraphQLClient(this.minaGql as string, {
        errorPolicy: 'ignore',
        jsonSerializer
      })
      const data = await client.rawRequest<AccountData>(query, {
        publicKey: args.publicKey
      })

      if (!data || !data.data.account) {
        console.log('Account data not found, performing health check...')
        const healthCheckResponse = await this.healthCheck()
        if (!healthCheckResponse.ok) {
          throw new Error('Node is not available')
        }
        console.log('Account does not exist yet, returning empty account.')
        return {
          balance: { total: 0 },
          nonce: 0,
          inferredNonce: 0,
          delegate: '',
          publicKey: args.publicKey
        }
      }

      console.log('Received response for account info:', data)
      return data.data.account
    } catch (error) {
      console.error('Error in getAccountInfo:', error)
      throw new Error('Error fetching account info')
    }
  }
}
