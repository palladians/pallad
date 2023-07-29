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
  accountStores: {},
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
      restoreWallet: async <T extends ChainSpecificPayload>(
        payload: T,
        args: ChainSpecificArgs,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider,
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
          false
        )

        return keyAgent
      },
      addCredentials: async <T extends ChainSpecificPayload>(
        payload: T,
        args: ChainSpecificArgs,
        provider: MinaProvider,
        providerArchive: MinaArchiveProvider,
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

              const updatedAccountStores: Record<ChainAddress, AccountStore> = {
                ...get().accountStores,
                [credentials.address as ChainAddress]: newAccountStore // 'credentials.address' should be of type ChainAddress
              }

              set({ accountStores: updatedAccountStores })
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
      getAccountStore: (address: ChainAddress): AccountStore | null => {
        const accountStores = get().accountStores
        return accountStores[address] || null
      },
      setAccountStore: (
        address: ChainAddress,
        accountStore: Partial<AccountStore>
      ) => {
        if (!accountStore || typeof accountStore !== 'object') {
          throw new Error('Invalid accountStore argument')
        }

        const currentAccountStore =
          get().accountStores[address] || createEmptyAccountStore()
        const updatedAccountStore = { ...currentAccountStore, ...accountStore }
        const updatedAccountStores = {
          ...get().accountStores,
          [address]: updatedAccountStore
        }
        set({ accountStores: updatedAccountStores })
      }
    }),
    {
      name: 'PalladVault',
      storage: createJSONStorage(getSecurePersistence)
    }
  )
)
