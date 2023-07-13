import {
  GroupedCredentials,
  SerializableKeyAgentData
} from '@palladxyz/key-management'
import { AccountInfo, Mina } from '@palladxyz/mina-core'

export type Store = {
  accountInfo: AccountInfo
  transactions: Mina.TransactionBody[]
  setAccountInfo: (newAccountInfo: AccountInfo) => void
  setTransactions: (newTransactions: Mina.TransactionBody[]) => void
}

export type KeyAgentStore = {
  walletName: string
  serializableKeyAgentData: SerializableKeyAgentData
  setSerializableKeyAgentData: (
    newSerializableKeyAgentData: SerializableKeyAgentData
  ) => void
  restoreWallet: (walletName: string) => Promise<void>
  addCredentials: (walletName: string) => Promise<GroupedCredentials | null>
}
