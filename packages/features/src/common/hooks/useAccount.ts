import useSWR from 'swr'

import { useWallet } from '../../wallet/hooks/useWallet'

export const useAccount = () => {
  const { wallet } = useWallet()
  const address = wallet.getCurrentWallet()?.address
  const swr = useSWR(address || null, async () => await wallet.getAccountInfo())
  const rawMinaBalance = swr.isLoading ? '0' : swr.data?.balance?.total
  const minaBalance =
    rawMinaBalance && BigInt(rawMinaBalance) / BigInt(1_000_000_000)
  return { ...swr, minaBalance }
}
