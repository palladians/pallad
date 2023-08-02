import useSWR from 'swr'

import { useWallet } from '../../wallet/hooks/useWallet'

export const useTransactions = () => {
  const { wallet } = useWallet()
  const address = wallet.getCurrentWallet()?.address
  return useSWR(address || null, async () => await wallet.getTransactions())
}
