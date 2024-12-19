import type { Mina } from "@palladxyz/mina-core"
import type {
  ChainHistoryProvider,
  TransactionsByAddressesArgs,
  Tx,
} from "@palladxyz/pallad-core"

//import { healthCheck } from "../utils/health-check-utils";

const convertToTransactionBody = (
  data: any[],
  address: string,
): Mina.TransactionBody[] => {
  return data.map((item) => ({
    type: item.type.toLowerCase() as Mina.TransactionType,
    from: item.direction === "OUT" ? address : item.accountAddress,
    to: item.direction === "OUT" ? item.accountAddress : address,
    fee: item.fee,
    nonce: "", //  Not available
    amount: item.amount,
    memo: item.memo,
    validUntil: "", //  Not available
    blockHeight: item.blockHeight,
    token: "", //  Not available
    hash: item.txHash,
    failureReason: "", //  Not available
    dateTime: new Date(item.age).toISOString(),
    isDelegation: item.type === "delegation",
  }))
}

export const createChainHistoryProvider = (
  url: string,
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs,
  ): Promise<Tx[]> => {
    console.log(">>>>ARGS", args, url)
    const limit = 50
    const endpoint = `${url}/v1/accounts/${args.addresses[0]}/txs?page=0&sortBy=AGE&orderBy=DESC&size=${limit}&direction=ALL`
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return convertToTransactionBody(data.data, args.addresses[0] ?? "")
  }
  // TODO: remove txByHashes method
  const transactionsByHashes = async (): Promise<Tx[]> => {
    /*const promises = args.ids.map(id => {
      const endpoint = `${url}/api/core/transactions/${id}`;
      return fetch(endpoint).then(response => response.json());
    });*/
    //const transactionsData = await Promise.all(promises);
    return [] //transactionsData.map(txData => convertToTransactionBody([txData])[0]); // Assuming each response contains one transaction
  }

  return {
    healthCheck: () =>
      Promise.resolve({ ok: true, data: "no health-check here!" }), // healthCheck(url),
    transactionsByAddresses,
    transactionsByHashes,
  }
}
