import useSWR from 'swr'

import { useVaultStore } from '../store/vault'
import { Account, Transaction, TrpcResponse } from '../types'
import { fetcher } from './api'

const VITE_APP_API_URL = import.meta.env.VITE_APP_API_URL

const Urls = {
  GET_ACCOUNT_URL: new URL(`${VITE_APP_API_URL}/trpc.getAccount`),
  GET_TRANSACTIONS_URL: new URL(`${VITE_APP_API_URL}/trpc.getTransactions`)
}

export const useAccount = () => {
  const url = Urls.GET_ACCOUNT_URL
  const walletPublicKey = useVaultStore(
    (state) => state.getCurrentWallet()?.walletPublicKey
  )
  url.searchParams.set('input', JSON.stringify({ address: walletPublicKey }))
  return useSWR<TrpcResponse<Account>>(walletPublicKey ? url : null, fetcher)
}

export const useTransactions = () => {
  const url = Urls.GET_TRANSACTIONS_URL
  const walletPublicKey = useVaultStore(
    (state) => state.getCurrentWallet()?.walletPublicKey
  )
  url.searchParams.set('input', JSON.stringify({ address: walletPublicKey }))
  return useSWR<TrpcResponse<Transaction[]>>(
    walletPublicKey ? url : null,
    fetcher
  )
}
