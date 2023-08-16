import { MinaNetwork } from '@palladxyz/key-management'
import useSWR from 'swr'

import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'

export const useAccount = () => {
  const { wallet } = useWallet()
  const address = wallet.getCurrentWallet()?.address
  const network = useAppStore((state) => state.network)
  const swr = useSWR(
    address ? [address, 'account', MinaNetwork[network]] : null,
    async () => await wallet.getAccountInfo()
  )
  const rawMinaBalance = swr.isLoading ? 0 : swr.data?.balance?.total || 0
  const minaBalance =
    rawMinaBalance && BigInt(rawMinaBalance) / BigInt(1_000_000_000)
  return { ...swr, minaBalance }
}
