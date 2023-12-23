import useSWR from 'swr'

import { fetcher } from '../lib/fetch'

export const useBlockchainSummary = () => {
  return useSWR<Record<string, string>>('summary', () =>
    fetcher('https://api.minaexplorer.com/summary')
  )
}
