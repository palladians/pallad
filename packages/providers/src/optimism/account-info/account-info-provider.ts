import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider
} from '@palladxyz/mina-core'
import {
  Address,
  Chain,
  createPublicClient,
  formatEther,
  GetBalanceParameters,
  GetTransactionCountParameters,
  webSocket
} from 'viem'
import { optimismSepolia } from 'viem/chains'

import { healthCheckOptimism } from '../utils'

export const createAccountInfoProvider = (url: string): AccountInfoProvider => {
  const getAccountInfo = async (
    args: AccountInfoArgs
  ): Promise<Record<string, AccountInfo>> => {
    const client = createPublicClient({
      chain: optimismSepolia as Chain,
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

    console.log('The balance in ETH is', balanceETH)

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
