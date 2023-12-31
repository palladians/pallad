# An Agnostic Key Management Package

Acknowledgements: significant inspiration from [cardano-js-sdk](https://github.com/input-output-hk/cardano-js-sdk) helped build this package. This package has also benefited from the incredible work of [@paulmillr](https://github.com/paulmillr) who's remarkable open source work has helped realize many of the features in this package.

This package provides comprehensive support for key management across multiple blockchain networks. It comes with support for Mina, Ethereum, and Starknet in progress. It can be extended to include more as needed. The requirements for adding more networks requires adding a directory to `./src/chains` and defining functionality to derive keys, build compliant credentials, and perform signing operations.

The goal is to build a KMS that is compliant with the [W3C Universal Wallet Specification](https://w3c-ccg.github.io/universal-wallet-interop-spec/#Data%20Model).

## Features

- Supports Mina, Ethereum, and Starknet networks
- Can derive credentials for each chain
- Signing operations for each chain
- Supports seed decryption and exporting of seeds using an implementation of [EMIP-003](https://github.com/Emurgo/EmIPs/blob/master/specs/emip-003.md)
- In-memory key agent with secure seed storage
- Wrapper functions using `@scure/bip39` library

## Usage

This library exposes various types and methods to interact with supported chains.

### KeyAgentBase

An abstract class that serves as the base for key agents. Key agents handle chain-specific operations such as credential derivation, signing operations, and seed decryption.

#### Functionality

This class provides several core functionalities:

- Data Decryption: Decrypt the root private key which is typically stored in an encrypted form.

- Private Key Export: Export the root private key to be used in other operations such as signing transactions.

- Credential Derivation: Derive blockchain-specific credentials, such as a public key or an address, from the root private key. This is typically done in accordance with blockchain-specific derivation schemes like BIP-32, BIP-39, and BIP-44.

- Transaction Signing: Sign transactions or data with the root private key.

### InMemoryKeyAgent

The `InMemoryKeyAgent` is an extension of `KeyAgentBase` that manages the encrypted seed bytes in memory and can restoring a key agent from a mnemonic.

#### Usage and Functionality

To use `InMemoryKeyAgent`, you need to provide a passphrase, which is a function returning a promise that resolves to the passphrase used for seed encryption.

The class provides the following functionalities:

- Constructing a new instance: This requires providing all necessary details to create a `SerializableInMemoryKeyAgentData` type object, including the encrypted seed bytes and the passphrase function.

- Restoring a KeyAgent: This feature can reinitialize a `KeyAgent` instance by deriving the necessary credentials. It takes a payload and arguments specific to the blockchain in use.

- Creating an instance from mnemonic words: This feature creates a new `InMemoryKeyAgent` from a provided list of BIP39 mnemonic words and a passphrase. The passphrase is used to encrypt the seed derived from the mnemonic words.

**Note:** The `fromMnemonicWords` function first validates the provided mnemonic words. It then converts the mnemonic words into entropy, generates a seed from the entropy, and encrypts it using the passphrase. If the mnemonic words are not valid or the encryption fails, the function throws an error.

Here's a simple example of usage:

```ts
const mnemonicWords = [
  'habit',
  'hope',
  'tip',
  'crystal',
  'because',
  'grunt',
  'nation',
  'idea',
  'electric',
  'witness',
  'alert',
  'like'
]
const getPassphrase = async () => Buffer.from('passphrase')

const agent = await InMemoryKeyAgent.fromMnemonicWords({
  mnemonicWords,
  getPassphrase
})
```

**Important**: When implementing, the passphrase function should be set up in a secure way that's suitable for your application.

With the `InMemoryKeyAgent`, you can handle sensitive key material in a way that conforms to the W3C Universal Wallet Specification. It enables you to derive credentials, sign transactions, and manage seeds for supported blockchain networks, with secure in-memory storage.

Check out the test suite!
