# @palladxyz/mina-graphql

This TypeScript library creates Providers that can read and write (mutate) data to the Mina Protocol via both archive node and node APIs. 

A Provider is an abstraction that encapsulates the functionality for interacting with the underlying Mina Protocol, whether by reading or mutating on-chain data or querying historical state information. With dedicated functionality spanning from account data querying to transaction submission, each provider serves as a streamlined interface, ensuring simplified and standardized interactions with the Mina Protocol APIs.

It consists of two main providers that offer distinct functionalities as described below:

## Installation
Install the package via npm:

```bash
npm install @palladxyz/mina-graphql
```
or via yarn:

```bash
yarn add @palladxyz/mina-graphql
```
## Providers

### MinaProvider

This provider abstracts over node related queries and mutations such as `AccountInfoGraphQLProvider` and `TxSubmitGraphQLProvider`.

Example usage:
```ts
const provider = new MinaProvider('https://...');
const accountInfo = await provider.getAccountInfo({ publicKey: 'B62...' });
await provider.submitTx({ kind: 'PAYMENT', transactionDetails: {...}, signedTransaction: {...} });
```

#### AccountInfoGraphQLProvider

This provider is used for querying account related information such as account balance and health check. You can initialize it by passing the URL of your Mina Node GraphQL endpoint.

Example usage:
```ts
const provider = new AccountInfoGraphQLProvider('https://...');
const response = await provider.getAccountInfo({ publicKey: 'B62...' });
```

#### TxSubmitGraphQLProvider

This provider is used for submitting transactions to the network. It accepts the URL of your Mina GraphQL endpoint as a constructor argument.

Example usage:
```ts
const provider = new TxSubmitGraphQLProvider('https://...');
await provider.submitTx({ kind: 'PAYMENT', transactionDetails: {...}, signedTransaction: {...} });
```
Each provider has a healthCheck method that can be used to verify the health of the GraphQL endpoint. If the endpoint is healthy, it will return `{ ok: true }`. If there is a problem with the endpoint, it will return `{ ok: false, message: 'Error message' }`.


#### TxStatusProvider

This provider is used to query for the status of a transaction, whether it is in-flight or not.

Example usage:
```ts
const provider = new TxStatusGraphQLProvider(minaExplorerGql)
const response = await provider.checkTxStatus({ID: '3XpD...8sk'}))
```

#### BlockListenerProvider

There is an untested, unfinished implementation of a `BlockListener` provider that will be able to subscribe to the new block events. This is useful for applications that don't want to have or minimize their polling-based APIs.


### MinaArchiveProvider

This provider abstracts over archive node related queries such as `ChainHistoryGraphQLProvider`. 

Example usage:
```ts
const providerArchive = new MinaArchiveProvider('https://...')
const transaction = await provider.transactionsByHashes({ ids: ['3NLnAL...' ]});
```

#### ChainHistoryGraphQLProvider

This provider allows you to fetch transactions by address or by transaction hashes and also offers a health check functionality. Like the `AccountInfoGraphQLProvider`, it requires the URL of your Mina Explorer GraphQL endpoint.

Example usage:
```ts
const provider = new ChainHistoryGraphQLProvider('https://...');
const response = await provider.transactionsByHashes({ ids: ['3NLnAL...' ]});

const args: TransactionsByAddressesArgs = {
    addresses: ['B62...H1xq'],
    pagination: { startAt: 0, limit: 10 }
}

const response = await provider.transactionsByAddresses(args)
```
