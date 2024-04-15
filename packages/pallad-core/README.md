# @palladxyz/mina-core

@palladxyz/mina-core is a TypeScript package designed for interacting with the Mina Protocol. It provides interfaces for retrieving account information, processing transaction history, submitting transactions, and provider health checks. The package also includes the core types that represent the main data structures of the Mina Protocol.

## Installation

Install the package via npm:

```bash
npm install @palladxyz/mina-core
```

## Usage

### AccountInfoProvider

The `AccountInfoProvider` interface is used to fetch account information based on a public key.

```ts
import { AccountInfoProvider } from '@palladxyz/mina-core'

async function getAccountInfo(provider: AccountInfoProvider) {
  const accountInfo = await provider.getAccountInfo({ publicKey: '...' })
  console.log(accountInfo)
}
```

### ChainHistoryProvider

The `ChainHistoryProvider` interface provides methods to fetch transactions either by addresses or by hashes.

```ts
import { ChainHistoryProvider } from '@palladxyz/mina-core'

async function getTransactionsByAddresses(provider: ChainHistoryProvider) {
  const transactions = await provider.transactionsByAddresses({
    addresses: ['...']
  })
  console.log(transactions)
}

async function getTransactionsByHashes(provider: ChainHistoryProvider) {
  const transactions = await provider.transactionsByHashes({ ids: ['...'] })
  console.log(transactions)
}
```

### TxSubmitProvider

The `TxSubmitProvider` interface allows you to submit signed transactions to the network.

```ts
import { TxSubmitProvider } from '@palladxyz/mina-core'

async function submitTx(provider: TxSubmitProvider) {
  const signedTx = // Prepare your signed transaction here
    await provider.submitTx({ signedTransaction: signedTx })
}
```

### Provider

All provider types extend the base Provider interface, which provides a health check method to verify if the provider is operational.

```ts
import { Provider } from '@palladxyz/mina-core'

async function checkHealth(provider: Provider) {
  const healthCheckResponse = await provider.healthCheck()
  console.log(
    healthCheckResponse.ok ? 'Provider is healthy' : 'Provider is down'
  )
}
```

### Mina Core Types

This package also includes TypeScript definitions for some of the core data structures of the Mina Protocol, which can be found under `./src/Mina/types`.

### Disclaimer

This package is still under development. Use it at your own risk and ensure to test thoroughly in your applications. Contributions and suggestions are welcomed!
