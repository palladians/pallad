// import { GroupedCredentials, Network } from '@palladxyz/key-management'
// import { MinaWalletImpl } from '@palladxyz/mina-wallet'
//
// import { RequestArguments } from './types'
//
// export interface IMinaWalletImpl {
//   enable(): Promise<void>
//   connect(): Promise<void>
//   disconnect(): Promise<void>
//   isConnected(): boolean
//   getAccounts(): Promise<string[]>
//
//   request(args: RequestArguments, chainId?: string): Promise<any>
// }
//
// export class MinaWalletWrapper implements IMinaWalletImpl {
//   private wallet: MinaWalletImpl
//   private connected = false
//
//   constructor(wallet: MinaWalletImpl) {
//     this.wallet = wallet
//   }
//
//   async enable(): Promise<void> {
//     // Here, you'd add the logic to prompt the user to connect to the wallet
//     // For example, you could open a modal and wait for the user to click 'Connect'
//
//     // Once the user has connected, emit an 'accountsChanged' event
//     this.connected = true
//   }
//
//   async connect(): Promise<void> {
//     // Here, you'd add the logic to establish a connection or initialize the wallet.
//     this.connected = true
//   }
//
//   async disconnect(): Promise<void> {
//     // Here, you'd add the logic to terminate the connection or de-initialize the wallet.
//     this.connected = false
//   }
//
//   isConnected(): boolean {
//     return this.connected
//   }
//
//   async request(args: RequestArguments, chainId?: string): Promise<any> {
//     // Here, you'd add the logic to handle requests from the dApp
//     if (chainId) {
//       console.log('chainId:', chainId)
//     }
//     switch (args.method) {
//       case 'mina_requestAccounts':
//         return this.getAccounts()
//       case 'mina_getBalance':
//         return this.getBalance(args.params)
//       case 'mina_sendTransaction':
//         return this.sendTransaction(args.params)
//       case 'mina_signTransaction':
//         return this.signTransaction(args.params)
//       case 'mina_signFields':
//         return this.signFields(args.params)
//       case 'mina_signMessage':
//         return this.signMessage(args.params)
//       default:
//         throw new Error('Method not supported')
//     }
//   }
//
//   async getAccounts(): Promise<string[]> {
//     // this search function should take into account what should
//     // be returned from the query: all of the credential vs just specific parts
//     const credentials = this.wallet.getCredentials({
//       chain: Network.Mina
//     })
//
//     return credentials
//       .filter((credential): credential is GroupedCredentials => {
//         return (credential as GroupedCredentials).address !== undefined
//       })
//       .map((credential) => credential.address)
//   }
//
//   async getBalance(params: any): Promise<any> {
//     // You can fetch balance using params and return
//     // For demonstration, let's assume params has an account address
//     // TODO: need to convert the params into arguments to query for
//     // specific account's info
//     console.log('params:', params)
//     const accountInfo = await this.wallet.getAccountInfo()
//     if (accountInfo === null) {
//       throw new Error('Account info is null in getBalance web-provider')
//     }
//     return accountInfo.balance.total
//   }
//
//   async sendTransaction(params: any): Promise<any> {
//     // Implement the logic to send a transaction
//     // TODO: need to convert the params into SubmitTxArgs
//     return await this.wallet.submitTx(params)
//   }
//
//   async signTransaction(params: any): Promise<any> {
//     // Implement the logic to sign a transaction
//     // TODO: need to convert the params into ChainSignablePayload
//     return await this.wallet.sign(params)
//   }
//
//   async signFields(params: any): Promise<any> {
//     // Implement the logic to sign fields
//     return await this.wallet.sign(params)
//   }
//
//   async signMessage(params: any): Promise<any> {
//     // Implement the logic to sign a message
//     return await this.wallet.sign(params)
//   }
//
//   // You'd also implement or proxy all other methods from MinaWalletImpl here...
//   // For example:
//   // async getAccountInfo(publicKey: Mina.PublicKey): Promise<AccountInfo | null> {
//   //     return this.wallet.getAccountInfo(publicKey);
//   // }
//
//   // ... Repeat for all other methods
// }
