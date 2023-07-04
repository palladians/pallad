# @palladxyz/mina-graphql

This TypeScript library provides a GraphQL API client for the Mina Protocol. It consists of several providers that offer distinct functionalities as described below:

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

### AccountInfoGraphQLProvider

This provider is used for querying account related information such as account balance and health check. You can initialize it by passing the URL of your Mina GraphQL endpoint.

Example usage:
```ts
const provider = new AccountInfoGraphQLProvider('https://...');
const response = await provider.getAccountInfo({ publicKey: 'B62...' });
```

### ChainHistoryGraphQLProvider

This provider allows you to fetch transactions by address or by transaction hashes and also offers a health check functionality. Like the `AccountInfoGraphQLProvider`, it requires the URL of your Mina Explorer GraphQL endpoint.

Example usage:
```ts
const provider = new ChainHistoryGraphQLProvider('https://...');
const response = await provider.transactionsByHashes({ ids: ['3NLnAL...' ]});
```

### TxSubmitGraphQLProvider

This provider is used for submitting transactions to the network. It accepts the URL of your Mina GraphQL endpoint as a constructor argument.

Example usage:
```ts
const provider = new TxSubmitGraphQLProvider('https://...');
await provider.submitTx({ kind: 'PAYMENT', transactionDetails: {...}, signedTransaction: {...} });
```
Each provider has a healthCheck method that can be used to verify the health of the GraphQL endpoint. If the endpoint is healthy, it will return `{ ok: true }`. If there is a problem with the endpoint, it will return `{ ok: false, message: 'Error message' }`.