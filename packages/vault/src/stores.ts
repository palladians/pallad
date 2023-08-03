import {
  ChainAddress,
  ChainSpecificArgs,
  ChainSpecificPayload,
  FromBip39MnemonicWordsProps,
  GroupedCredentials,
  InMemoryKeyAgent,
  MinaGroupedCredentials,
  Network
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

const dummyGroupedCredentials: GroupedCredentials = {
  '@context': ['https://w3id.org/wallet/v1'],
  id: '',
  type: 'MinaAddress',
  controller: '',
  name: '',
  description: '',
  chain: Network.Mina,
  addressIndex: 0,
  accountIndex: 0,
  address: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
}

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
  deriveAndSetCredentials: async () => dummyGroupedCredentials,
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
      deriveAndSetCredentials: async <T extends ChainSpecificPayload>(
        payload: T,
        args: ChainSpecificArgs,
        pure?: boolean
      ): Promise<MinaGroupedCredentials> => {
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

        return credentials
      },
      addCredentials: async <T extends ChainSpecificPayload>(
        payload: T,
        args: ChainSpecificArgs,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider,
        network: Mina.Networks,
        pure?: boolean
      ): Promise<void> => {
        // First derive credentials from the provided payload and arguments
        const credentials = await get().deriveAndSetCredentials(
          payload,
          args,
          pure
        )

        if (credentials.type === 'MinaAddress') {
          try {
            // Use syncAccountStore to fetch account info and transactions
            await get().syncAccountStore(
              credentials.address,
              provider,
              providerArchive,
              network
            )

            // Set the current wallet and current network
            set({ currentWallet: credentials })
            set({ currentNetwork: network })
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
        // First, set the current network
        set({ currentNetwork: network })
        console.log('logging provider: ', provider)
        console.log('logging providerArchive: ', providerArchive)

        // Fetch the current wallet
        /*const wallet = get().getCurrentWallet()

        if (wallet) {
          // Now, call syncAccountStore for the current wallet address
          await get().syncAccountStore(
            wallet.address,
            provider,
            providerArchive,
            network
          )
        } else {
          console.log('No current wallet available')
        }*/
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
        // may not need this method
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
        console.log('provider', provider)
        console.log('providerArchive', providerArchive)
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
