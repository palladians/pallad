import {
  PrivateKey,
  PublicKey
} from 'mina-signer/dist/node/mina-signer/src/TSTypes'
/**
 * Represents a key pair consisting of a public key and a private key.
 */
export type KeyPair = {
  publicKey: PublicKey
  privateKey: PrivateKey
}

/**
 * Represents the network type.
 * It can be either 'mainnet' or 'testnet'.
 */
export type NetworkType = 'mainnet' | 'testnet'
