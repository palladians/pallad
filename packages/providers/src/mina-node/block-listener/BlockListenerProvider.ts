import type { AccountInfo, AccountInfoArgs } from "@palladxyz/mina-core"
import type { ExecutionResult } from "graphql"
import { GraphQLClient, gql } from "graphql-request"
import { SubscriptionClient } from "subscriptions-transport-ws"

import {
  type AccountData,
  AccountInfoGraphQLProvider,
} from "../account-info/AccountInfoProvider"
import { getAccountBalance } from "../account-info/queries"

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

    return this.subscriptionClient
      .request({
        query: subscription,
      })
      .subscribe({
        next: async (result: ExecutionResult) => {
          // Type guard
          if ("data" in result && "newBlock" in result.data) {
            const data: BlockData = result.data
            if (data.newBlock) {
              await this.getAccountInfo({ publicKey })
            } else {
              console.error("No new block data in result:", result)
            }
          } else {
            console.error("Unexpected result:", result)
          }
        },
      })
  }

  private async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    const query = gql`
      ${getAccountBalance}
    `
    try {
      const data = (await this.gqlClient.request(query, {
        publicKey: args.publicKey,
      })) as AccountData

      if (!data || !data.account) {
        throw new Error("Invalid account data response")
      }
      return data.account
    } catch (error: unknown) {
      console.error("Error in getAccountInfo:", error)
      // this can fail if the account doesn't exist yet on the chain & if the node is not available
      // perform health check to see if the node is available
      const healthCheckResponse = await this.accountInfoProvider.healthCheck()
      if (!healthCheckResponse.ok) {
        throw new Error("Node is not available")
      }
      // if the node is available, then the account doesn't exist yet
      // return an empty account
      return {
        balance: { total: 0 },
        nonce: 0,
        inferredNonce: 0,
        delegate: "",
        publicKey: args.publicKey,
      }
    }
  }
}
