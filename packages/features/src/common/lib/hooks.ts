import useSWR from 'swr'

import { useVaultStore } from '../store/vault'
import { fetcher } from './api'

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL
const getAccountUrl = new URL(`${VITE_APP_API_URL}/trpc.getAccount`)

export const useAccount = () => {
  const walletPublicKey = useVaultStore(
    (state) => state.getCurrentWallet()?.walletPublicKey
  )
  getAccountUrl.searchParams.set(
    'input',
    JSON.stringify({ address: walletPublicKey })
  )
  return useSWR(walletPublicKey ? getAccountUrl : null, fetcher)
}
