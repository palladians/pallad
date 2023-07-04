import { Provider } from '../Provider'

export type TxStatusArgs = {
  ID: string
}

type TxStatus = {
  status: 'PENDING' | 'INCLUDED' | 'UNKNOWN' | 'FAILED'
}

export interface TxStatusProvider extends Provider {
  /**
   * Checks the status of a transaction ID.
   * @param args The ID string of a transaction.
   * @throws Will throw an error if the check fails.
   **/
  submitTx: (args: TxStatusArgs) => Promise<TxStatus>
}
