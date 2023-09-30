import { GroupedCredentials, Network } from '@palladxyz/key-management'
import { MinaWalletImpl } from '@palladxyz/mina-wallet'

import { RequestArguments } from './types'

export interface IMinaWalletImpl {
  enable(): Promise<void>
  connect(): Promise<void>
  disconnect(): Promise<void>
  isConnected(): boolean
  getAccounts(): Promise<string[]>

  request(args: RequestArguments, chainId?: string): Promise<any>
}

export class MinaWalletWrapper implements IMinaWalletImpl {
  private wallet: MinaWalletImpl
  private connected = false

  constructor(wallet: MinaWalletImpl) {
    this.wallet = wallet
  }

  async enable(): Promise<void> {
    // Here, you'd add the logic to prompt the user to connect to the wallet
    // For example, you could open a modal and wait for the user to click 'Connect'

    // Once the user has connected, emit an 'accountsChanged' event
    this.connected = true
  }

  async connect(): Promise<void> {
    // Here, you'd add the logic to establish a connection or initialize the wallet.
    this.connected = true
  }

  async disconnect(): Promise<void> {
    // Here, you'd add the logic to terminate the connection or de-initialize the wallet.
    this.connected = false
  }

  isConnected(): boolean {
    return this.connected
  }

  async request(args: RequestArguments, chainId?: string): Promise<any> {
    // Here, you'd add the logic to handle requests from the dApp
    if (chainId) {
      console.log('chainId:', chainId)
    }
    switch (args.method) {
      case 'mina_requestAccounts':
        return this.getAccounts()
      default:
        throw new Error('Method not supported')
    }
  }

  async getAccounts(): Promise<string[]> {
    // If there's a specific way to fetch accounts in MinaWalletImpl, call that method:
    // return this.wallet.getAccountsOrSimilarMethod();
    // Otherwise, if there isn't a direct method, maybe you get credentials and derive accounts from them:
    const credentials = this.wallet.getCredentials({
      type: 'MinaAddress',
      chain: Network.Mina
    })
    return credentials.map(
      (credential) => (credential as GroupedCredentials)?.address || ''
    )
  }

  // You'd also implement or proxy all other methods from MinaWalletImpl here...
  // For example:
  // async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo | null> {
  //     return this.wallet.getAccountInfo(publicKey);
  // }

  // ... Repeat for all other methods
}
