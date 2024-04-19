import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider
} from '@palladxyz/pallad-core'
import {
  Address,
  Chain,
  createPublicClient,
  formatEther,
  GetBalanceParameters,
  GetTransactionCountParameters,
  webSocket
} from 'viem'

import { healthCheckOptimism } from '../utils'

export const createAccountInfoProvider = (url: string): AccountInfoProvider => {
  const getAccountInfo = async (
    args: AccountInfoArgs
  ): Promise<Record<string, AccountInfo>> => {
    /*if (args.chainInfo === undefined) {
      throw new Error(
        'chainInfo must be defined in `@palladxyz/pallad-core` Optimism createAccountInfoProvider'
      )
    }*/
    const client = createPublicClient({
      chain: args.chainInfo as Chain,
      transport: webSocket(url)
    })

    const balanceVariables: GetBalanceParameters = {
      address: args.publicKey as Address
    }
    const balanceETH = await client.getBalance(balanceVariables)
    const formattedBalance = await formatEther(balanceETH)
    const nonceVariables: GetTransactionCountParameters = {
      address: args.publicKey as Address
    }
    const nonce = await client.getTransactionCount(nonceVariables)

    const accountsInfo: Record<string, AccountInfo> = {}

    if (balanceETH === null) {
      accountsInfo['ETH'] = {
        balance: { total: 0 },
        inferredNonce: 0,
        nonce: 0,
        delegate: '',
        publicKey: args.publicKey
      }
    } else {
      accountsInfo['ETH'] = {
        balance: { total: Number(formattedBalance) },
        inferredNonce: nonce,
        nonce: nonce,
        delegate: '',
        publicKey: args.publicKey
      }
    }
    return accountsInfo
  }

  return {
    healthCheck: () => healthCheckOptimism(url),
    getAccountInfo
  }
}
