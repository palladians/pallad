import {
  ChainOperationArgs,
  MinaSignablePayload
} from '@palladxyz/key-management'
import { BorrowedTypes, Mina } from '@palladxyz/mina-core'
import { SearchQuery } from '@palladxyz/vault'
import { EventEmitter } from 'events'

import { hasObjectProps, hasQueryAndProps } from '../utils'
import { showUserPrompt } from '../utils/prompts'
import { vaultService } from '../vault-service'
import {
  ChainProviderOptions,
  ChainRpcConfig,
  ConnectOps,
  ProviderConnectInfo,
  RequestArguments
} from '../web-provider-types'
import {
  OPTIONAL_EVENTS,
  OPTIONAL_METHODS,
  REQUIRED_EVENTS,
  REQUIRED_METHODS
} from './constants/rpc'
import {
  IMinaProviderBase,
  IMinaProviderEvents,
  MinaRpcProviderMap,
  requestData,
  requestingStateData,
  requestSignableData
} from './types'

export type RpcMethod =
  | 'mina_sendTransaction'
  | 'mina_accounts'
  | 'mina_requestAccounts'
  | 'mina_getBalance'
  | 'mina_sign'
  | 'mina_signTransaction'
  | 'mina_createNullifier'
  | 'mina_getState'
  | 'mina_setState'

export interface IMinaProvider extends IMinaProviderBase {
  connect(opts?: ConnectOps | undefined): Promise<void>
}

export function getRpcUrl(chainId: string, rpc: ChainRpcConfig) {
  let rpcUrl: string | undefined
  if (rpc.rpcMap) {
    rpcUrl = rpc.rpcMap[getMinaChainId([chainId])]
  }
  return rpcUrl
}

export function getMinaChainId(chains: string[]) {
  return Number(chains[0]?.split(':')[1])
}

export class MinaProvider implements IMinaProvider {
  public events = new EventEmitter()
  public accounts: string[] = []
  public chainId: string | undefined = undefined
  public rpcProviders: MinaRpcProviderMap = {}

  private userPrompt: typeof showUserPrompt

  protected rpc: ChainRpcConfig

  constructor(
    opts: ChainProviderOptions,
    private externalEmitter?: EventEmitter
  ) {
    // Initialization logic
    this.rpc = {} as ChainRpcConfig

    // Use provided userPrompt function or default to the actual implementation
    if (opts.showUserPrompt) {
      this.userPrompt = opts.showUserPrompt
    } else {
      // Default to the actual implementation
      this.userPrompt = showUserPrompt
    }
  }

  static async init(
    opts: ChainProviderOptions,
    authorizedMethods: string[] = REQUIRED_METHODS,
    externalEmitter?: EventEmitter
  ) {
    const provider = new MinaProvider(opts, externalEmitter)
    await provider.initialize(opts, authorizedMethods)
    return provider
  }
  // why is this async?
  private async initialize(
    opts: ChainProviderOptions,
    unauthorizedMethods: string[] = []
  ) {
    // Here, you'd set up any initial state or connections you need.
    // For example, you could set up the rpcConfig:

    this.rpc = {
      chains: opts.chains || [],
      optionalChains: opts.optionalChains || [],
      rpcMap: opts.rpcMap || {},
      projectId: opts.projectId,
      methods: REQUIRED_METHODS, // Use required methods from constants
      optionalMethods: OPTIONAL_METHODS, // Use optional methods from constants
      unauthorizedMethods: unauthorizedMethods,
      events: REQUIRED_EVENTS, // Use required events from constants
      optionalEvents: OPTIONAL_EVENTS // Use optional events from constants
    }

    // get the wallet's current chain id
    const chainId = await vaultService.getChainId()
    this.chainId = chainId
    // set the rpc provider
    // TODO:
    //this.rpcProviders = vaultService.getChainIds() ?? {}
  }
  private createProviderRpcError(code: number, message: string) {
    return {
      name: 'ProviderRpcError',
      message,
      code
      // Include any additional data if it is required
    }
  }
  // TODO: add ConnectOps as an optional parameter
  public async enable({ origin }: { origin: string }) {
    // Implement the logic to prompt the user to connect to the wallet
    // For example, you could open a modal and wait for the user to click 'Connect'
    // Step 0: Prompt user for confirmation
    const userConfirmed = await this.userPrompt(
      'Do you want to connect?',
      'confirmation'
    ) // Note: all user prompts should define the inputType like this 'confirmation'
    console.log('userConfirmed:', userConfirmed)
    if (!userConfirmed) {
      // should this emit an error event?
      throw this.createProviderRpcError(4001, 'User Rejected Request')
    }
    await this.connect({ origin })
    // TODO: perform 'mina_requestAccounts' method
    return vaultService.getAccounts()
  }
  // these are the methods that are called by the dapp to interact/listen to the wallet
  public on: IMinaProviderEvents['on'] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.on(event, listener)
    } else {
      this.events.on(event, listener)
    }
    return this
  }

  public once: IMinaProviderEvents['once'] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.once(event, listener)
    } else {
      this.events.once(event, listener)
    }
    return this
  }

  public removeListener: IMinaProviderEvents['removeListener'] = (
    event,
    listener
  ) => {
    if (this.externalEmitter) {
      this.externalEmitter.removeListener(event, listener)
    } else {
      this.events.removeListener(event, listener)
    }
    return this
  }

  public off: IMinaProviderEvents['off'] = (event, listener) => {
    if (this.externalEmitter) {
      this.externalEmitter.off(event, listener)
    } else {
      this.events.off(event, listener)
    }
    return this
  }

  public async connect(opts: ConnectOps) {
    try {
      // Step 1: Check if already connected.
      if (vaultService.getEnabled({ origin: opts.origin })) {
        throw new Error('Already connected.')
      }
      // Step 2: Attempt to connect to a chain.
      if (!opts.chains) {
        // Try to connect to the default chain -- this is actually the current chain the wallet is connected to not the default chain
        const defaultChainId = await vaultService.getChainId()
        if (!defaultChainId) {
          throw new Error('Unable to connect: Default chain ID is undefined.')
        }
        this.chainId = defaultChainId
      } else if (opts.chains && opts.chains.length > 0) {
        this.chainId = String(opts.chains[0])
      } else {
        throw this.createProviderRpcError(4901, 'Chain Disconnected')
      }
      // Step 4: Set the connected flag.
      //this.connected = true // this is redundant because we're setting the connected flag in the next step
      vaultService.setEnabled({ origin: opts.origin })
      // Step 5: Emit a 'connect' event.
      const connectInfo: ProviderConnectInfo = { chainId: this.chainId }
      //this.events.emit('connect', connectInfo)
      if (this.externalEmitter) {
        this.externalEmitter.emit('connect', connectInfo)
      } else {
        this.events.emit('connect', connectInfo)
      }
    } catch (error) {
      // Handle any errors that occurred during connection.
      console.error('Error during connection:', error)
      // Additional error handling as needed
    }
  }

  public requestAccounts() {
    return this.accounts
  }

  public isConnected({ origin }: { origin: string }) {
    return vaultService.getEnabled({ origin })
  }

  public disconnect({ origin }: { origin: string }) {
    // Check if it's connected in the first place
    if (!this.isConnected({ origin })) {
      // Emit a 'disconnect' event with an error only if disconnected
      if (this.externalEmitter) {
        this.externalEmitter.emit(
          'disconnect',
          this.createProviderRpcError(4900, 'Disconnected')
        )
      } else {
        this.events.emit(
          'disconnect',
          this.createProviderRpcError(4900, 'Disconnected')
        )
      }
    } else {
      // If it's connected, then handle the disconnection logic
      // For example, disconnect from the Mina client or other cleanup
      // ...

      // Update the connected status
      // this.connected = false

      // Reset accounts
      this.accounts = []

      // Reset chainId
      this.chainId = undefined

      // Emit a 'disconnect' event without an error
      if (this.externalEmitter) {
        this.externalEmitter.emit('disconnect')
      } else {
        this.events.emit('disconnect')
      }
    }
  }

  public async request<T = unknown>(
    args: RequestArguments,
    chain?: string | undefined
  ): Promise<T> {
    if (
      // when the provider is initialized, the rpc methods are set to the required methods
      // this can be the set of authorized methods the user has given permission for the zkApp to use
      this.rpc.unauthorizedMethods!.includes(args.method)
    ) {
      throw this.createProviderRpcError(
        4100,
        'Unauthorized - The requested method and/or account has not been authorized by the user.'
      )
    }
    // In a method that requires a specific chain connection
    // TODO: handle when chain is not provided -- handle other methods with optional args
    if (this.chainId !== chain && chain !== undefined) {
      // TODO: prompt the user they're on the wrong chain and ask if they want to switch
      // maybe this error should be handled in the universal-provider?
      // check if the chain is supported by Pallad
      const chains = vaultService.getChainIds() ?? []
      const validChain = chains?.includes(chain)
      if (!validChain) {
        throw this.createProviderRpcError(4901, 'Chain Disconnected')
      }
      const changeChain = await this.userPrompt(
        `You are on the wrong chain. Do you want to switch to ${chain}?`,
        'confirmation'
      )
      if (changeChain) {
        // TODO: switch to the correct chain
        vaultService.switchNetwork(chain)
        this.chainId = chain
        this.onChainChanged(chain!)
      } else {
        // if they don't, throw an error
        throw this.createProviderRpcError(4901, 'Chain Disconnected')
      }
    }
    // TODO: Add prompt confirmation for signing and broadcasting
    // // Prompt user for confirmation based on the method type
    // // what scenarios would we need to prompt the user?
    // const userConfirmed = await this.userPrompt(
    //   `Do you want to execute ${args.method}?`,
    //   'confirmation'
    // )
    // if (!userConfirmed) {
    //   throw this.createProviderRpcError(4001, 'User Rejected Request')
    // }

    switch (args.method) {
      case 'mina_accounts':
        return vaultService.getAccounts() as unknown as T
      case 'mina_sign':
      case 'mina_createNullifier':
      case 'mina_signFields':
      case 'mina_signTransaction': {
        const passphrase = await this.userPrompt(
          'Enter your passphrase:',
          'password'
        )
        if (passphrase === null) {
          throw new Error('User denied the request for passphrase.')
        }
        // TODO: handle incorrect passphrase
        /*
          looks like the signable is actually of type:
          {
            data: { message: 'hi'},
            id: 'mina_sign',
            ....
          }
        */
        const operationArgs: ChainOperationArgs = {
          operation: args.method,
          network: 'Mina',
          networkType: 'testnet'
        }

        if (args.method === 'mina_signFields') {
          const requestData = args.params as requestData
          const signable = {
            fields: requestData.data.map((item) => {
              // Convert to BigInt only if the item is a number
              if (typeof item === 'number') {
                return BigInt(item)
              }
              // If it's not a number, return the item as is
              return item
            })
          } as MinaSignablePayload
          const signedResponse = (await vaultService.sign(
            signable,
            operationArgs,
            () =>
              new Promise<Uint8Array>((resolve) =>
                // TODO: make sure we handle scenarios where the password is provided and not just boolean 'confirmed'
                resolve(Buffer.from(passphrase as string))
              )
          )) as Mina.SignedFields
          // serialise the response if mina_signFields
          const serializedResponseData = signedResponse.data.map((item) => {
            // Convert to BigInt only if the item is a number
            if (typeof item === 'bigint') {
              return String(item)
            }
            // If it's not a number, return the item as is
            return item
          })
          const seriliasedResponse = {
            ...signedResponse,
            data: serializedResponseData
          }
          return seriliasedResponse as unknown as T
        } else if (args.method === 'mina_createNullifier') {
          const requestData = args.params as requestData
          const signable = {
            message: requestData.data.map((item) => {
              // Convert to BigInt only if the item is a number
              if (typeof item === 'number') {
                return BigInt(item)
              }
              // If it's not a number, return the item as is
              return item
            })
          } as MinaSignablePayload
          const signedResponse = (await vaultService.sign(
            signable,
            operationArgs,
            () =>
              new Promise<Uint8Array>((resolve) =>
                resolve(Buffer.from(passphrase as string))
              )
          )) as BorrowedTypes.Nullifier
          console.log('signedResponse:', signedResponse)
          // serialise the response if mina_createNullifier
          const serializeField = (field: BorrowedTypes.Field) => {
            if (typeof field === 'bigint' || typeof field === 'number') {
              return field.toString()
            }
            return field
          }

          const serializeGroup = (group: BorrowedTypes.Group) => ({
            x: serializeField(group.x),
            y: serializeField(group.y)
          })

          const serializedResponseData = {
            publicKey: serializeGroup(signedResponse.publicKey),
            public: {
              nullifier: serializeGroup(signedResponse.public.nullifier),
              s: serializeField(signedResponse.public.s)
            },
            private: {
              c: serializeField(signedResponse.private.c),
              g_r: serializeGroup(signedResponse.private.g_r),
              h_m_pk_r: serializeGroup(signedResponse.private.h_m_pk_r)
            }
          }
          console.log('serializedResponseData:', serializedResponseData)

          return serializedResponseData as unknown as T
        } else {
          const requestData = args.params as requestSignableData
          const signable = requestData.data as MinaSignablePayload
          return (await vaultService.sign(
            signable,
            operationArgs,
            () =>
              new Promise<Uint8Array>((resolve) =>
                // TODO: make sure we handle scenarios where the password is provided and not just boolean 'confirmed'
                resolve(Buffer.from(passphrase as string))
              )
          )) as unknown as T
        }
      }
      case 'mina_getBalance':
        return vaultService.getBalance() as unknown as T

      case 'mina_getState': {
        const passphrase = await this.userPrompt(
          'Enter your passphrase:',
          'password'
        )
        if (passphrase === null) {
          throw new Error('User denied the request for passphrase.')
        }
        // TODO: handle incorrect passphrase
        const requestData = args.params as requestingStateData
        if (
          !requestData.data ||
          !hasQueryAndProps(requestData.data)
        ) {
          // Handle the case where the necessary properties do not exist
          console.log('the args are:', requestData)
          return {} as unknown as T
        }
        const { query, props } = requestData.data as unknown as {
          query: SearchQuery
          props: string[]
        }
        return vaultService.getState(query, props) as unknown as T
      }

      case 'mina_setState': {
        const passphrase = await this.userPrompt(
          'Enter your passphrase:',
          'password'
        )
        if (passphrase === null) {
          throw new Error('User denied the request for passphrase.')
        }
        const requestData = args.params as requestingStateData
        if (
          !requestData.data ||
          !hasObjectProps(requestData.data)
        ) {
          console.log('the args are:', requestData)
          // Handle the case where the necessary properties do not exist
          return false as unknown as T
        }

        //major change

        return vaultService.setState(requestData.data) as unknown as T
      }

      case 'mina_chainId': {
        return this.chainId as unknown as T
      }

      default:
        throw this.createProviderRpcError(4200, 'Unsupported Method')
    }
  }

  private onChainChanged(chainId: string) {
    // updated the chainId
    this.chainId = chainId
    if (this.externalEmitter) {
      this.externalEmitter.emit('chainChanged', chainId)
    } else {
      this.events.emit('chainChanged', chainId)
    }
  }
  // The set of accounts only changes when the user
  // 1. adds a new account
  // 2. removes an account
  // We can listen to the vaultService for changes to the accounts
  // private onAccountsChanged(): void {
  //   // listen to the vaultService for changes to the accounts
  //   // e.g. vaultService.events.on('accountsChanged', this.updateAccounts)
  //   const accounts = vaultService.getAccounts()
  //   this.accounts = accounts
  //   if (this.externalEmitter) {
  //     this.externalEmitter.emit('accountsChanged', accounts)
  //   } else {
  //     this.events.emit('accountsChanged', accounts)
  //   }
  // }

  protected getRpcConfig(ops: ChainProviderOptions) {
    return {
      chains: ops.chains || [],
      optionalChains: ops.optionalChains || [],
      rpcMap: ops.rpcMap || {},
      projectId: ops.projectId,
      methods: REQUIRED_METHODS, // Use required methods from constants
      optionalMethods: OPTIONAL_METHODS, // Use optional methods from constants
      unauthorizedMethods: this.rpc.unauthorizedMethods!,
      events: REQUIRED_EVENTS, // Use required events from constants
      optionalEvents: OPTIONAL_EVENTS // Use optional events from constants
    }
  }

  protected getRpcUrl(chainId: string /*, projectId?: string*/) {
    const providedRpc = this.rpc.rpcMap?.[chainId]
    return providedRpc!
  }
}
