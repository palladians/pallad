import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'

export type AccountInfoConstructor = {
  url: string
}

export class AccountInfoProviderRPC implements AccountInfoProvider {
  url: string

  constructor(args: AccountInfoConstructor) {
    this.url = args.url
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const query = `{ syncStatus }`

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        return { ok: false, message: `HTTP error! status: ${response.status}` }
      }

      const data = await response.json()

      if (data.errors) {
        return {
          ok: false,
          message: `GraphQL error: ${data.errors
            .map((e) => e.message)
            .join(', ')}`
        }
      }

      return {
        ok: data.data && data.data.syncStatus === 'SYNCED',
        message: data.data
          ? `Sync status: ${data.data.syncStatus}`
          : 'No sync status data available'
      }
    } catch (error) {
      if (error instanceof Error) {
        return { ok: false, message: `Error: ${error.message}` }
      }
      return { ok: false, message: 'An unknown error occurred' }
    }
  }

  async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    const query = `
            query accountBalance($publicKey: PublicKey!) {
                account(publicKey: $publicKey) {
                    balance {
                        total
                    },
                    nonce,
                    inferredNonce,
                    delegate,
                    publicKey
                }
            }
        `
    const variables = {
      publicKey: args.publicKey
    }

    const response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(
        `GraphQL error: ${data.errors.map((e) => e.message).join(', ')}`
      )
    }

    const account = data.data.account
    if (account === null) {
      return {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: '',
        publicKey: args.publicKey
      }
    }

    return account
  }
}
