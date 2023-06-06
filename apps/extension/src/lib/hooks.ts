import { localData } from '@/lib/storage.ts'
import { useStorage } from '@plasmohq/storage/hook'

export const useLocalWallet = () => {
  return useStorage({
    key: 'wallet',
    instance: localData
  })
}
