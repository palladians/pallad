import {
  ChainAddress,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent,
  MinaGroupedCredentials
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'
import { MinaArchiveProvider, MinaProvider } from '@palladxyz/mina-graphql'
import { getSecurePersistence } from '@palladxyz/persistence'
import { createJSONStorage, persist } from 'zustand/middleware'
import { createStore } from 'zustand/vanilla'

import { AccountStore, VaultStore } from './vault'

const createEmptyAccountStore = (): AccountStore => ({
  accountInfo: {} as AccountInfo,
  transactions: {} as Mina.TransactionBody[],
  setAccountInfo: () => void 0,
  setTransactions: () => void 0,
  getAccountInfo: () => ({} as AccountInfo),
  getTransactions: () => ({} as Mina.TransactionBody[])
})

// define the initial state
const initialState: VaultStore = {
  keyAgent: null,
  currentWallet: null,
  accountStores: {
    [Mina.Networks.MAINNET]: {},
    [Mina.Networks.DEVNET]: {},
    [Mina.Networks.BERKELEY]: {}
  },
  syncAccountStore: async () => void 0,
  currentNetwork: null,
  getCurrentNetwork: () => null,
  setCurrentNetwork: () => void 0,
  restoreWallet: async () => null,
  addCredentials: async () => void 0,
  setCurrentWallet: async () => void 0,
  getCurrentWallet: () => null,
  getCredentials: () => [],
  getAccountStore: () => null,
  setAccountStore: () => void 0
}

// Zustand store using immer for immutable updates and persist middleware
export const keyAgentStore = createStore<VaultStore>()(
  persist(
    (set, get) => ({
      keyAgent: initialState.keyAgent,
      currentWallet: initialState.currentWallet,
      accountStores: initialState.accountStores,
      currentNetwork: initialState.currentNetwork,
      restoreWallet: async <T extends ChainSpecificPayload>(
        payload: T,
        args: ChainSpecificArgs,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider,
        network: Mina.Networks,
        { mnemonicWords, getPassphrase }: FromBip39MnemonicWordsProps
      ) => {
        const agentArgs: FromBip39MnemonicWordsProps = {
          getPassphrase: getPassphrase,
          mnemonicWords: mnemonicWords,
          mnemonic2ndFactorPassphrase: ''
        }
        const keyAgent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)

        // set both the keyAgent and the serializableKeyAgentData
        set({ keyAgent })

        // derive the credentials for the first account and address & mutate the serializableKeyAgentData state
        await get().addCredentials(
          payload,
          args,
          provider,
          providerArchive,
          network,
          false
        )

        return keyAgent
      },
      addCredentials: async <T extends ChainSpecificPayload>(
        payload: T,
        args: ChainSpecificArgs,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider,
        network: Mina.Networks,
        pure?: boolean
      ): Promise<void> => {
        const keyAgent = get().keyAgent ? get().keyAgent : null

        if (!keyAgent) {
          throw new Error('keyAgent is null')
        }

        const credentials = (await keyAgent.deriveCredentials(
          payload,
          args,
          pure
        )) as MinaGroupedCredentials
        set({ keyAgent })

        if (credentials.type === 'MinaAddress') {
          try {
            const accountInfoPromise = provider.getAccountInfo({
              publicKey: credentials.address
            })
            const transactionsPromise = providerArchive.getTransactions({
              addresses: [credentials.address],
              pagination: { startAt: 0, limit: 10 }
            })

            const result = await Promise.all([
              accountInfoPromise,
              transactionsPromise
            ]).catch((error) => {
              console.error(
                'Error fetching account info or transactions:',
                error
              )
            })
            console.log('network: ', network, 'query result: ', result)
            if (result) {
              const [accountInfo, paginatedTransactions] = result
              const transactions = paginatedTransactions.pageResults //`pageResults` because we are using the MinaArchiveProvider and it has its own pagination type
              // Create a new AccountStore
              const newAccountStore: AccountStore = {
                ...createEmptyAccountStore(),
                accountInfo,
                transactions,
                setAccountInfo: (info: AccountInfo) => {
                  newAccountStore.accountInfo = info
                },
                setTransactions: (txs: Mina.TransactionBody[]) => {
                  newAccountStore.transactions = txs
                },
                getAccountInfo: () => newAccountStore.accountInfo,
                getTransactions: () => newAccountStore.transactions
              }

              const updatedAccountStores = get().accountStores[network] || {}
              updatedAccountStores[credentials.address as ChainAddress] =
                newAccountStore

              set({
                accountStores: {
                  ...get().accountStores,
                  [network]: updatedAccountStores
                }
              })
              set({ currentWallet: credentials })
              set({ currentNetwork: network })
            } else {
              console.log('Failed to fetch account info or transactions')
            }
          } catch (error) {
            console.log('Error fetching account info or transactions:', error)
          }
        } else {
          console.log('not a wallet!')
        }
      },
      setCurrentWallet: (address: ChainAddress) => {
        const keyAgent = get().keyAgent ? get().keyAgent : null
        if (keyAgent) {
          const { contents } = keyAgent.serializableData.credentialSubject
          const currentWalletCredentials = contents.find(
            (credential) => credential.address === address
          )
          if (currentWalletCredentials) {
            set({ currentWallet: currentWalletCredentials })
          } else {
            console.log('currentWalletCredentials is null')
          }
        } else {
          console.log('keyAgent is null')
        }
      },
      getCurrentWallet: (): GroupedCredentials | null => {
        const currentWallet = get().currentWallet
        return currentWallet
      },
      getCredentials: (): GroupedCredentials[] | null => {
        const keyAgent = get().keyAgent ? get().keyAgent : null
        if (keyAgent) {
          const { contents } = keyAgent.serializableData.credentialSubject
          return contents
        }
        return null
      },
      setCurrentNetwork: async (
        network: Mina.Networks,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider
      ) => {
        set({ currentNetwork: network })
        // Here you would want to sync the account information for each wallet/address that exists
        const credentials = get().getCredentials()
        if (credentials) {
          for (const credential of credentials) {
            if (credential.type === 'MinaAddress') {
              await get().syncAccountStore(
                credential.address,
                provider,
                providerArchive,
                network
              )
            }
          }
        } else {
          console.log('No credentials available')
        }
      },
      getCurrentNetwork: (): Mina.Networks | null => {
        const currentNetwork = get().currentNetwork
        return currentNetwork
      },
      getAccountStore: (
        network: Mina.Networks,
        address: ChainAddress
      ): AccountStore | null => {
        const networkAccountStores = get().accountStores[network] || {}
        return networkAccountStores[address] || null
      },
      setAccountStore: (
        network: Mina.Networks,
        address: ChainAddress,
        accountStore: Partial<AccountStore>
      ) => {
        if (!accountStore || typeof accountStore !== 'object') {
          throw new Error('Invalid accountStore argument')
        }

        const networkAccountStores = get().accountStores[network] || {}
        const currentAccountStore =
          networkAccountStores[address] || createEmptyAccountStore()

        const updatedAccountStore = { ...currentAccountStore, ...accountStore }
        networkAccountStores[address] = updatedAccountStore

        set({
          accountStores: {
            ...get().accountStores,
            [network]: networkAccountStores
          }
        })
      },
      syncAccountStore: async (
        address: ChainAddress,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider,
        network: Mina.Networks
      ) => {
        try {
          const accountInfoPromise = provider.getAccountInfo({
            publicKey: address
          })
          const transactionsPromise = providerArchive.getTransactions({
            addresses: [address],
            pagination: { startAt: 0, limit: 10 }
          })

          const result = await Promise.all([
            accountInfoPromise,
            transactionsPromise
          ]).catch((error) => {
            console.error('Error fetching account info or transactions:', error)
          })
          if (result) {
            const [accountInfo, paginatedTransactions] = result
            const transactions = paginatedTransactions.pageResults //`pageResults` because we are using the MinaArchiveProvider and it has its own pagination type
            // Create a new AccountStore
            const newAccountStore: AccountStore = {
              ...createEmptyAccountStore(),
              accountInfo,
              transactions,
              setAccountInfo: (info: AccountInfo) => {
                newAccountStore.accountInfo = info
              },
              setTransactions: (txs: Mina.TransactionBody[]) => {
                newAccountStore.transactions = txs
              },
              getAccountInfo: () => newAccountStore.accountInfo,
              getTransactions: () => newAccountStore.transactions
            }

            const updatedAccountStores = get().accountStores[network] || {}
            updatedAccountStores[address as ChainAddress] = newAccountStore

            set({
              accountStores: {
                ...get().accountStores,
                [network]: updatedAccountStores
              }
            })
          } else {
            console.log('Failed to fetch account info or transactions')
          }
        } catch (error) {
          console.log('Error fetching account info or transactions:', error)
        }
      }
    }),
    {
      name: 'PalladVault',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)
