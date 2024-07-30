import { Network } from "@palladxyz/pallad-core"
import { describe, expect, it } from "vitest"

import { hexToBytes } from "@noble/hashes/utils"
import type {
  EthereumDerivationArgs,
  EthereumGroupedCredentials,
} from "../../src"
import {
  assertIsBytes,
  deriveEthereumCredentials,
  deriveEthereumPublicAddress,
  deriveEthereumPublicKey,
  isEthereumCredential,
  privateToPublic,
} from "../../src/chains/Ethereum/credentialDerivation"
import { isMessage, isTransaction } from "../../src/chains/Ethereum/guards"
import { isEthereumDerivation } from "../../src/chains/Ethereum/keyDerivationUtils"

describe("credentialderivation utils", () => {
  const validPrivateKeyHex =
    "ab8e7c879d7a802940c7a6535752ee6d3064f7dcbb25b4d2cd90c1f8efdb61f0"
  const validPrivateKeyBytes = hexToBytes(validPrivateKeyHex)
  const expectedPublicKey = "0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9"

  const expectedGroupedCredentials: EthereumGroupedCredentials = {
    "@context": ["https://w3id.org/wallet/v1"],
    id: "did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9",
    type: "EthereumAddress",
    controller: "did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9",
    name: "Ethereum Account",
    description: "My Ethereum account.",
    chain: Network.Ethereum,
    accountIndex: 0,
    addressIndex: 0,
    address: expectedPublicKey,
    encryptedPrivateKeyBytes: new Uint8Array([0, 1, 2, 3, 4]),
  }

  it("deriveEthereumPublicAddress should derive the correct public address", () => {
    const address = deriveEthereumPublicAddress(validPrivateKeyBytes)
    expect(address).toBeTypeOf("string")
    expect(address).toHaveLength(42) // Ethereum addresses are 42 characters long including the '0x'
  })

  it("assertIsBytes should not throw for valid Uint8Array", () => {
    expect(() => assertIsBytes(validPrivateKeyBytes)).not.toThrow()
  })

  it("assertIsBytes should throw an error for invalid inputs", () => {
    const invalidInput = [1, 2, 3] // Not a Uint8Array
    expect(() => assertIsBytes(invalidInput as any)).toThrow(
      "This method only supports Uint8Array but input was:",
    )
  })

  it("privateToPublic should derive the public key bytes correctly", () => {
    const publicKey = privateToPublic(validPrivateKeyBytes)
    expect(publicKey).toBeInstanceOf(Uint8Array)
    expect(publicKey).toHaveLength(64) // Should return 64 bytes
  })

  it("deriveEthereumPublicKey should derive the correct hex public key", () => {
    const publicKeyHex = deriveEthereumPublicKey(validPrivateKeyBytes)
    expect(publicKeyHex).toBeTypeOf("string")
    expect(publicKeyHex).toHaveLength(128) // Should be 128 hex characters long
  })

  it("deriveEthereumCredentials should correctly format Ethereum credentials", () => {
    const args: EthereumDerivationArgs = {
      network: Network.Ethereum,
      addressIndex: 0,
      accountIndex: 0,
    }
    const encryptedPrivateKeyBytes = Uint8Array.from([0, 1, 2, 3, 4])

    const credentials = deriveEthereumCredentials(
      args,
      expectedPublicKey,
      encryptedPrivateKeyBytes,
    )
    expect(credentials).toMatchObject({
      id: `did:ethr:${expectedPublicKey}`,
      type: "EthereumAddress",
      controller: `did:ethr:${expectedPublicKey}`,
      name: "Ethereum Account",
      description: "My Ethereum account.",
      chain: Network.Ethereum,
      addressIndex: 0,
      accountIndex: 0,
      address: expectedPublicKey,
      encryptedPrivateKeyBytes,
    })
  })

  it("isEthereumCredential should validate credentials correctly", () => {
    const args: EthereumDerivationArgs = {
      network: Network.Ethereum,
      addressIndex: 0,
      accountIndex: 0,
    }

    expect(isEthereumCredential(expectedGroupedCredentials, args)).toBeTruthy()
  })

  it("isEthereumCredential should return false for non-matching credentials", () => {
    const args: EthereumDerivationArgs = {
      network: Network.Ethereum,
      addressIndex: 0,
      accountIndex: 1, // Different account index
    }
    const notEthereumCredential: EthereumGroupedCredentials = {
      "@context": ["https://w3id.org/wallet/v1"],
      id: "did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9",
      type: "EthereumAddress",
      controller: "did:ethr:0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9",
      name: "Ethereum Account",
      description: "My Ethereum account.",
      chain: Network.Ethereum,
      accountIndex: 0,
      addressIndex: 0,
      address: expectedPublicKey,
      encryptedPrivateKeyBytes: new Uint8Array([0, 1, 2, 3, 4]),
    }

    expect(isEthereumCredential(notEthereumCredential, args)).toBeFalsy()
  })
  it("check if it is an Ethereum derivation", () => {
    const args: EthereumDerivationArgs = {
      network: Network.Ethereum,
      addressIndex: 0,
      accountIndex: 1, // Different account index
    }
    expect(isEthereumDerivation(args)).toBeTruthy()
  })
  describe("Ethereum guards", () => {
    describe("isTransaction", () => {
      it("should return true for valid transaction objects", () => {
        const validTransaction = {
          to: "0x123456789abcdef",
          value: "1000",
          data: "0xabcdef",
        }
        expect(isTransaction(validTransaction)).toBeTruthy()
      })

      it("should return false for invalid transaction objects", () => {
        const invalidTransaction = {
          from: "0x123456789abcdef", // Missing required 'to', 'value', and 'data'
          gasPrice: "5000",
        }
        expect(isTransaction(invalidTransaction)).toBeFalsy()
      })

      it("should return false for non-object types", () => {
        expect(isTransaction("this is a string")).toBeFalsy()
        expect(isTransaction(123)).toBeFalsy()
        expect(isTransaction(null)).toBeFalsy()
        expect(isTransaction(undefined)).toBeFalsy()
      })
    })

    describe("isMessage", () => {
      it("should return true for strings", () => {
        expect(isMessage("Hello, blockchain!")).toBeTruthy()
      })

      it("should return true for Uint8Array", () => {
        const messageBytes = new Uint8Array([1, 2, 3, 4, 5])
        expect(isMessage(messageBytes)).toBeTruthy()
      })

      it("should return false for non-string and non-Uint8Array objects", () => {
        expect(isMessage(123)).toBeFalsy()
        expect(isMessage({ text: "Hello, blockchain!" })).toBeFalsy()
        expect(isMessage(null)).toBeFalsy()
        expect(isMessage(undefined)).toBeFalsy()
      })
    })
  })
})
