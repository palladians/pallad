import type { Mina } from "@palladxyz/mina-core"
import type {
  ChainHistoryProvider,
  TransactionsByAddressesArgs,
  Tx,
} from "@palladxyz/pallad-core"

const convertToTransactionBody = (
  data: any[],
  account: string,
): Mina.TransactionBody[] => {
  return data.map((item) => ({
    type: item.type.toLowerCase() as Mina.TransactionType,
    from: item.direction === "IN" ? item.account : account,
    to: item.direction === "IN" ? account : item.account,
    fee: item.fee,
    nonce: "", //  Not available
    amount: item.amount,
    memo: item.memo,
    validUntil: "", //  Not available
    blockHeight: item.height,
    token: "", //  Not available
    hash: item.transactionHash,
    failureReason: "", //  Not available
    dateTime: new Date(item.timestamp).toISOString(),
    isDelegation: false, //  Not available
  }))
}

export const createChainHistoryProvider = (
  url: string,
): ChainHistoryProvider => {
  const transactionsByAddresses = async (
    args: TransactionsByAddressesArgs,
  ): Promise<Tx[]> => {
    const limit = 50
    // https://zekoscan.io/devnet/api/transactions/B62qq7ecvBQZQK68dwstL27888NEKZJwNXNFjTyu3xpQcfX5UBivCU6?page=0&limit=50&sortBy=height&orderBy=DESC&size=50&pk=B62qq7ecvBQZQK68dwstL27888NEKZJwNXNFjTyu3xpQcfX5UBivCU6&direction=all
    // https://zekoscan.io/devnet/api/transactions/B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb/page=0&limit=20&sortBy=height&orderBy=DESC&size=20&pk=B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb&direction=all
    const endpoint = `${url}/api/transactions/${args.addresses[0]}?page=0&limit=${limit}&sortBy=height&orderBy=DESC&size=${limit}&pk=${args.addresses[0]}&direction=all`
    const response = await fetch(endpoint)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    return convertToTransactionBody(data.data, args.addresses[0] as string)
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
