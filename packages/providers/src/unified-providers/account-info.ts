/*import {
  AccountInfo,
  AccountInfoArgs,
  AccountInfoProvider,
  HealthCheckResponse
} from '@palladxyz/mina-core'

import { AccountInfoGraphQLProvider } from '../mina-explorer/account-info/AccountInfoProvider'
import { AccountInfoProviderRPC } from '../obscura-provider/account-info/account-info-provider'

export type UnifiedAccountInfoProviderConfig = {
  providerName: 'mina-explorer' | 'obscura'
  networkName: string // Name of the chain
  url: string
  chainId: string
}

export class UnifiedAccountInfoProvider implements AccountInfoProvider {
  private provider: AccountInfoProvider

  constructor(config: UnifiedAccountInfoProviderConfig) {
    if (config.providerName === 'mina-explorer') {
      this.provider = new AccountInfoGraphQLProvider(config.url)
    } else if (config.providerName === 'obscura') {
      this.provider = new AccountInfoProviderRPC({ url: config.url })
    } else {
      throw new Error('Invalid provider name')
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    return this.provider.healthCheck()
  }

  async getAccountInfo(args: AccountInfoArgs): Promise<AccountInfo> {
    return this.provider.getAccountInfo(args)
  }
}*/
