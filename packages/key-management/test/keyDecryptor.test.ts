import { beforeAll, describe, expect, it } from "bun:test"

import {
  KeyAgentType,
  KeyDecryptor,
  type SerializableKeyAgentData,
  generateMnemonicWords,
  mnemonicToSeed,
} from "../src"
import { emip3encrypt } from "../src/emip3"

describe("KeyDecryptor", () => {
  const passphrase = new Uint8Array([1, 2, 3, 4, 5])
  const getPassphrase = () => passphrase
  let mnemonic: string[]
  let seed: Uint8Array
  let encryptedPrivateKey: Uint8Array

  beforeAll(async () => {
    mnemonic = generateMnemonicWords()
    seed = mnemonicToSeed(mnemonic, "")
    encryptedPrivateKey = await emip3encrypt(
      new Uint8Array([1, 2, 3]),
      passphrase,
    )
  })

  it("decryptChildPrivateKey should decrypt properly", async () => {
    const keyDecryptor = new KeyDecryptor(getPassphrase)
    const encryptedPrivateKey = await emip3encrypt(seed, passphrase) // Reusing emip3 encrypt for the setup

    const decryptedPrivateKey =
      await keyDecryptor.decryptChildPrivateKey(encryptedPrivateKey)
    expect(decryptedPrivateKey).toEqual(seed)
  })

  it("decryptSeedBytes should decrypt seed bytes properly", async () => {
    const keyDecryptor = new KeyDecryptor(getPassphrase)
    const encryptedSeedBytes = await emip3encrypt(seed, passphrase)
    const serializableData: SerializableKeyAgentData = {
      __typename: KeyAgentType.InMemory,
      encryptedSeedBytes: encryptedSeedBytes,
      id: "http://example.gov/wallet/3732",
      type: ["VerifiableCredential", "EncryptedWallet"],
      issuer: "did:example:123",
      issuanceDate: "2020-05-22T17:38:21.910Z",
      credentialSubject: {
        id: "did:example:123",
        contents: [],
      },
    }

    const decryptedBytes = await keyDecryptor.decryptSeedBytes(serializableData)
    expect(decryptedBytes).toEqual(seed)
  })

  it("should throw an authentication error if decryption fails", async () => {
    const keyDecryptor = new KeyDecryptor(getPassphrase)
    const wrongEncryptedData = new Uint8Array([99, 99, 99]) // data that cannot be correctly decrypted

    await expect(
      keyDecryptor.decryptChildPrivateKey(wrongEncryptedData),
    ).rejects.toThrow("Failed to decrypt child private key")
  })

  it("should throw an authentication error if decryption fails in decryptSeed", async () => {
    const keyDecryptor = new KeyDecryptor(getPassphrase)
    const wrongEncryptedData = new Uint8Array([99, 99, 99]) // data that cannot be correctly decrypted
    const serializableData: SerializableKeyAgentData = {
      __typename: KeyAgentType.InMemory,
      encryptedSeedBytes: wrongEncryptedData, // intentionally incorrect data
      id: "http://example.gov/wallet/3732",
      type: ["VerifiableCredential", "EncryptedWallet"],
      issuer: "did:example:123",
      issuanceDate: "2020-05-22T17:38:21.910Z",
      credentialSubject: {
        id: "did:example:123",
        contents: [],
      },
    }

    expect(keyDecryptor.decryptSeedBytes(serializableData)).rejects.toThrow(
      "Failed to decrypt seed bytes",
    )
  })
  it("should not expose passphrase", async () => {
    const keyDecryptor = new KeyDecryptor(getPassphrase)
    let exposedPassphrase = null

    // Trying to intercept the passphrase by replacing the internal getPassphrase method
    keyDecryptor.getPassphrase = () => {
      exposedPassphrase = passphrase
      return passphrase
    }

    await keyDecryptor.decryptChildPrivateKey(encryptedPrivateKey)

    // Check if the passphrase was exposed
    expect(exposedPassphrase).toBeNull()
  })
})
