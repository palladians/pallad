import { useVaultStore } from '../store/vault'
import { trpc } from './trpc'

export const useAccount = () => {
  const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  return trpc.accounts.get.useSWR({ address: currentWallet?.walletPublicKey! })
}
