import { useStorage } from '@plasmohq/storage/hook'

import { useVaultStore } from '../store/vault'
import { localData } from './storage'
import { trpc } from './trpc'

export const useLocalWallet = () => {
  return useStorage({
    key: 'wallet',
    instance: localData
  })
}

export const useAccount = () => {
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  return trpc.accounts.get.useSWR({ address: currentWallet?.walletPublicKey! })
}
