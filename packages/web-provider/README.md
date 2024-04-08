# @palladxyz/web-extension

🚧 This package is a WIP & implementation of RFC-0008/-0009 🚧

This package has been heavily inspired by the [WalletConnect Monorepo](https://github.com/WalletConnect/walletconnect-monorepo).

This is a typescript package that allows applications to interact with the wallet.

## Current Design (POC)

`UniversalProvider` is a more generic class that allows users to interact with a specific chain-provider, currently there is only `MinaProvider` which is an EIP-1193-like provider for Pallad and abstracts over the `vault` using `VaultService` that can fetch wallet or network information but also help perform wallet specific operations (like signing) all with prompting the user for permission.

### Example Flow

`UniversalProvider` --> `{chain}Provider` --> `VaultService` or `MinaProvider` --> `VaultService`.

## Features

The `MinaProvider` class provides the following features:

1. **Connection Management**: Connect and disconnect from the Mina blockchain.
2. **Account Management**: Retrieve and manage blockchain accounts.
3. **Transaction Signing**: Sign transactions with user accounts.
4. **Event Handling**: Listen to and handle blockchain events.
5. **RPC URL Handling**: Get RPC URLs based on the chain ID.
6. **Error Handling**: Create custom RPC errors for better error management.

## Usage

### Initialization

Create an instance of `MinaProvider`:

```typescript
const providerOptions = {
  projectId: '1234',
  chains: ['Mina Devnet']
}
const minaProvider = MinaProvider.init(providerOptions)
```

Users can also initialize this provider with a set of unauthorized methods if they desire to limit the specific methods to a zkApp can access.

To do this:

```typescript
const providerOptions = {
  projectId: '1234',
  chains: ['Mina Devnet']
}
const unauthorizedMethods = ['mina_SignFields']
const minaProvider = MinaProvider.init(providerOptions, unauthorizedMethods)
```

### Connecting to the Wallet

To connect to the wallet's provider:

```typescript
await minaProvider.enable()
```

### Account Handling

Retrieve accounts:

```typescript
const accounts = minaProvider.requestAccounts()
```

### Signing Transactions

To sign a transaction:

```typescript
const transactionPayload = {
  /* ... */
}
const signedTransaction = await minaProvider.request({
  method: 'mina_signTransaction',
  params: transactionPayload
})
```

### Listening to Events

Listen to wallet events:

```typescript
minaProvider.on('connect', (info) => {
  console.log('Connected to chain:', info.chainId)
})
```

## Error Handling

Handle errors gracefully during operations:

```typescript
try {
  await minaProvider.connect()
} catch (error) {
  console.error('Connection error:', error.message)
}
```
