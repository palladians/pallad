import { Provider } from '../Provider'

export type TxStatusArgs = {
  ID: string
}

export enum TxStatus {
  PENDING = 'PENDING',
  INCLUDED = 'INCLUDED',
  UNKNOWN = 'UNKNOWN',
  FAILED = 'FAILED'
}

export interface TxStatusProvider extends Provider {
  /**
   * Checks the status of a transaction ID.
   * @param args The ID string of a transaction.
   * @throws Will throw an error if the check fails.
   **/
  submitTx: (args: TxStatusArgs) => Promise<TxStatus>
}
