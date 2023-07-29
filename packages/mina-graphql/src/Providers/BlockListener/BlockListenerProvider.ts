import {
  GraphQLClient,
  request,
  gql
} from 'graphql-request'
import { ExecutionResult } from 'graphql'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { AccountInfoArgs, AccountInfo } from '@palladxyz/mina-core'
import { getAccountBalance } from '../AccountInfo/queries'
import { AccountInfoGraphQLProvider, AccountData } from '../AccountInfo/AccountInfoProvider'

interface BlockData {
  newBlock?: {
    creator?: string
    stateHash?: string
    protocolState?: {
      consensusState?: {
        blockHeight?: number
      }
      previousStateHash?: string
    }
  }
}

export class BlockListenerProvider {
  private accountInfoProvider: AccountInfoGraphQLProvider
  private subscriptionClient: SubscriptionClient
  private gqlClient: GraphQLClient

  constructor(minaGql: string, wsEndpoint: string) {
    this.accountInfoProvider = new AccountInfoGraphQLProvider(minaGql)
    this.subscriptionClient = new SubscriptionClient(wsEndpoint, {
      reconnect: true,
    })
    this.gqlClient = new GraphQLClient(minaGql)
  }

  listenToNewBlocks(publicKey: string) {
    const subscription = gql`
      subscription {
        newBlock(publicKey: "${publicKey}") {
          creator
          stateHash
          protocolState {
            consensusState {
              blockHeight
            }
            previousStateHash
          }
        }
      }
    `
  
    return this.subscriptionClient.request({
      query: subscription,
    }).subscribe({
      next: async (result: ExecutionResult) => {
        // Type guard
        if ('data' in result && 'newBlock' in result.data) {
          const data: BlockData = result.data
          if (data.newBlock) {
            console.log('Received block data:', data)
            const accountInfo = await this.getAccountInfo({ publicKey })
            console.log('Received updated account info:', accountInfo)
          } else {
            console.error('No new block data in result:', result)
          }
        } else {
          console.error('Unexpected result:', result)
        }
      }
    })
  }

  private async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    console.log('Initiating getAccountInfo with args:', args)
    const query = gql`
      ${getAccountBalance}
    `
    try {
      console.log('Sending request for account info...')
      const data = await this.gqlClient.request(query, {
        publicKey: args.publicKey
      }) as AccountData
      console.log('Received response for account info:', data)

      if (!data || !data.account) {
        throw new Error('Invalid account data response')
      }
      return data.account
    } catch (error: unknown) {
      console.error('Error in getAccountInfo:', error)
      // this can fail if the account doesn't exist yet on the chain & if the node is not available
      // perform health check to see if the node is available
      const healthCheckResponse = await this.accountInfoProvider.healthCheck()
      if (!healthCheckResponse.ok) {
        throw new Error('Node is not available')
      }
      // if the node is available, then the account doesn't exist yet
      // return an empty account
      console.log('Error in getAccountInfo, account does not exist yet!')
      return {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: '',
        publicKey: args.publicKey
      }
    }
  }
}
