# Transaction Construciton

This is a TypeScript package that assists in creating and signing transactions for Mina Protocol. This package is a thin wrapper around `mina-signer`.

## Features
- This package provides the ability to create and sign Payment and Delegation transactions.
- It supports interaction with both mainnet and testnet.
- Leverages the mina-signer package to sign transactions.
- Includes robust error handling for transaction creation and signing.

## Usage

Here's a brief overview of how you can use the package.

```ts
import {
  getSignClient,
  constructPaymentTx,
  constructDelegationTx,
  signPayment,
  signDelegation,
  NetworkType
} from '@palladxyz/tx-construction';
```

### Get a client instance

You can get a client instance by providing the network type:
```ts
const client = await getSignClient('mainnet');
```

### Construct a payment transaction
To construct a payment transaction, you need to pass the transaction body:

```ts
const paymentTx = constructPaymentTx({
  to: 'B62...',
  from: 'B62...',
  fee: '1',
  nonce: '0'
});
```

### Construct a delegation transaction
To construct a delegation transaction, you need to pass the transaction body:

```ts
const delegationTx = constructDelegationTx({
  to: 'B62...',
  from: 'B62...',
  fee: '500000000',
  nonce: '1'
});
```

### Sign a payment transaction
To sign a payment transaction, you need to pass the private key, transaction body object (that includes a field `type` to describe whether it is a `payment` or `delegation` transaction), and network type:

```ts
const signedPayment = await signTransaction(
      PRIVATE_KEY,
      payment,
      network
    )
```

### Sign a delegation transaction
To sign a delegation transaction, you need to pass the private key, transaction body object  (that includes a field `type` to describe whether it is a `payment` or `delegation` transaction), and network type:

```ts
const signedDelegation = await signTransaction(
      PRIVATE_KEY,
      payment,
      network
    )
```

## Contributing

Contributions are welcome. Please submit a pull request or open an issue for any improvements or bug fixes.

