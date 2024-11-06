# An Agnostic Key Management Package

Acknowledgements: significant inspiration from [cardano-js-sdk](https://github.com/input-output-hk/cardano-js-sdk) helped build this package. This package has also benefited from the incredible work of [@paulmillr](https://github.com/paulmillr) who's remarkable open source work has helped realize many of the features in this package.

This package provides comprehensive support for key management across multiple blockchain networks. It can be extended to include more as needed. The requirements for adding more networks requires adding a directory to `./src/chains` and defining functionality to derive keys, build compliant credentials, and perform signing operations.

The goal is to build a KMS that is compliant with the [W3C Universal Wallet Specification](https://w3c-ccg.github.io/universal-wallet-interop-spec/#Data%20Model).

## Features

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
  "habit",
  "hope",
  "tip",
  "crystal",
  "because",
  "grunt",
  "nation",
  "idea",
  "electric",
  "witness",
  "alert",
  "like",
];
const getPassphrase = () => utf8ToBytes(passphrase);

const agent = await InMemoryKeyAgent.fromMnemonicWords({
  mnemonicWords,
  getPassphrase,
});
```

**Important**: When implementing, the passphrase function should be set up in a secure way that's suitable for your application.

With the `InMemoryKeyAgent`, you can handle sensitive key material in a way that conforms to the W3C Universal Wallet Specification. It enables you to derive credentials, sign transactions, and manage seeds for supported blockchain networks, with secure in-memory storage.

Check out the test suite!

# `src/emip3.ts`

This TypeScript module provides functions to encrypt and decrypt data using the ChaCha20-Poly1305 cipher, alongside PBKDF2 with SHA-512 for key derivation. It leverages the `@noble/ciphers` and `@noble/hashes` libraries.

## Constants

- `KEY_LENGTH`: Length of the encryption key in bytes. Set to 32.
- `NONCE_LENGTH`: Length of the nonce in bytes used for encryption. Set to 12.
- `PBKDF2_ITERATIONS`: Number of iterations used in PBKDF2 for key derivation. Set to 19162.
- `SALT_LENGTH`: Length of the salt in bytes used in PBKDF2. Set to 32.

## Functions

### `createPbkdf2Key(passphrase: Uint8Array, salt: Uint8Array | Uint16Array): Promise<Uint8Array>`

Generates a derived key using PBKDF2 with SHA-512 based on the provided passphrase and salt.

- **`passphrase`**: The passphrase used for key derivation, as a Uint8Array.
- **`salt`**: The salt used for key derivation, as a Uint8Array or Uint16Array. It is internally converted to Uint8Array.

Returns a promise that resolves with the derived key as a Uint8Array.

### `emip3encrypt(data: Uint8Array, passphrase: Uint8Array): Promise<Uint8Array>`

Encrypts the provided data using ChaCha20-Poly1305 with a key derived from the given passphrase.

- **`data`**: The plaintext data to encrypt, as a Uint8Array.
- **`passphrase`**: The passphrase used for key derivation, as a Uint8Array.

Returns a promise that resolves with the encrypted data, prefixed with the salt and nonce used during encryption.

### `emip3decrypt(encrypted: Uint8Array, passphrase: Uint8Array): Promise<Uint8Array>`

Decrypts the provided data, which was encrypted using the `emip3encrypt` function, with the given passphrase.

- **`encrypted`**: The encrypted data to decrypt, which includes the salt, nonce, and ciphertext, as a Uint8Array.
- **`passphrase`**: The passphrase used for key derivation, as a Uint8Array.

Returns a promise that resolves with the decrypted data as a Uint8Array.

## Usage

1. **Encryption**: Call `emip3encrypt` with plaintext data and a passphrase to get encrypted data.
2. **Decryption**: Call `emip3decrypt` with the encrypted data (including salt and nonce) and the same passphrase to decrypt and obtain the original plaintext.

# `src/keyDecryptor.ts`

This TypeScript module introduces the `KeyDecryptor` class, designed to decrypt encrypted private keys and seed bytes using a passphrase. It depends on the previously documented `emip3.ts` for the decryption process, as well as custom error handling and type definitions from other modules within the same project.

## Dependencies

- `./emip3`: Provides the `emip3decrypt` function for ChaCha20-Poly1305 decryption.
- `./errors`: Contains custom error classes, including `AuthenticationError`.
- `./InMemoryKeyAgent`: Contains utility functions, notably `getPassphraseRethrowTypedError`, which is used to safely retrieve the passphrase.
- `./types`: Defines TypeScript types and interfaces used in the decryption process.

## KeyDecryptor Class

### Constructor: `constructor(getPassphrase: GetPassphrase)`

Initializes a new instance of the `KeyDecryptor` class.

- **`getPassphrase`**: A callback function of type `GetPassphrase`, which asynchronously returns a passphrase as `Uint8Array`. This function may optionally accept a `noCache` parameter to bypass caching mechanisms.

### Methods

#### `async decryptChildPrivateKey(encryptedPrivateKeyBytes: Uint8Array, noCache?: true): Promise<Uint8Array>`

Decrypts an encrypted child private key.

- **`encryptedPrivateKeyBytes`**: The encrypted child private key as a `Uint8Array`.
- **`noCache`** (optional): If `true`, instructs the passphrase retrieval process to bypass any caching mechanisms.

Returns a promise that resolves with the decrypted private key as `Uint8Array`.

#### `decryptSeedBytes(serializableData: SerializableKeyAgentData, noCache?: true): Promise<Uint8Array>`

Decrypts encrypted seed bytes from a serializable data structure.

- **`serializableData`**: An object of type `SerializableKeyAgentData` containing encrypted seed bytes under a specified property name.
- **`noCache`** (optional): If `true`, instructs the passphrase retrieval process to bypass any caching mechanisms.

Returns a promise that resolves with the decrypted seed bytes as `Uint8Array`.

### Private Methods

#### `async decryptSeed(keyPropertyName: EncryptedKeyPropertyName, serializableData: SerializableKeyAgentData, errorMessage: string, noCache?: true): Promise<Uint8Array>`

A private utility method to abstract the decryption process of seed bytes or any other encrypted property within the `SerializableKeyAgentData`.

- **`keyPropertyName`**: The property name in `serializableData` that contains the encrypted data to decrypt.
- **`serializableData`**: An object of type `SerializableKeyAgentData` containing encrypted data under the `keyPropertyName`.
- **`errorMessage`**: A custom error message to use if decryption fails.
- **`noCache`** (optional): If `true`, bypasses passphrase caching.

Returns a promise that resolves with the decrypted bytes as `Uint8Array`.

## Usage

Instantiate a `KeyDecryptor` with a function to retrieve the user's passphrase. Use the `decryptChildPrivateKey` and `decryptSeedBytes` methods to decrypt the respective types of encrypted data.

## Error Handling

- If decryption fails or the passphrase retrieval encounters an issue, the methods will throw an `AuthenticationError` with a relevant message.

## Notes

- This module is designed for integration within a system that manages cryptographic keys and requires secure, passphrase-based decryption of keys or seed information.
