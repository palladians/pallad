import { mnemonic } from "@palladxyz/common"
import type { Mina } from "@palladxyz/mina-core"
import { Network } from "@palladxyz/pallad-core"
import Client from "mina-signer"
import sinon from "sinon"
import { expect } from "vitest"

import { getPassphraseRethrowTypedError } from "../../src/InMemoryKeyAgent"
import { KeyAgentBase } from "../../src/KeyAgentBase"
import type { MinaSpecificArgs } from "../../src/chains/Mina"
import { emip3encrypt } from "../../src/emip3"
import {
  type ChainOperationArgs,
  type GetPassphrase,
  KeyAgentType,
  type SerializableKeyAgentData,
} from "../../src/types"
import * as util from "../../src/util/bip39"

// Provide the passphrase for testing purposes
const params = {
  passphrase: "passphrase",
}
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))

describe("KeyAgentBase (Mina zkApp Functionality)", () => {
  class KeyAgentBaseInstance extends KeyAgentBase {}

  let instance: KeyAgentBaseInstance
  let serializableData: SerializableKeyAgentData
  let networkType: Mina.NetworkType
  let passphrase: Uint8Array
  let encryptedSeedBytes: Uint8Array

  beforeEach(async () => {
    // Generate a mnemonic (24 words)
    //const strength = 128 // increase to 256 for a 24-word mnemonic
    const seed = util.mnemonicToSeed(mnemonic)

    // passphrase
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // define the agent properties
    passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    // Works with seed
    encryptedSeedBytes = await emip3encrypt(seed, passphrase)
  })

  afterEach(() => {
    // Clean up all sinon stubs after each test.
    sinon.restore()
  })

  describe("Mina KeyAgent", () => {
    beforeEach(() => {
      // Define your own appropriate initial data, network, accountKeyDerivationPath, and accountAddressDerivationPath
      serializableData = {
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
      networkType = "testnet"
      instance = new KeyAgentBaseInstance(serializableData, getPassphrase)
    })
    it("should return the correct empty knownAddresses", () => {
      expect(instance.knownCredentials).to.deep.equal(
        serializableData.credentialSubject.contents,
      )
    })
    it("should use the generic sign<T> function to sign a zkapp command correctly and the client should be able to verify it", async () => {
      // Define a mocked publicKey, which should be expected from the derivation
      const expectedPublicKey: Mina.PublicKey =
        "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

      const expectedGroupedCredentials = {
        "@context": ["https://w3id.org/wallet/v1"],
        id: "did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        type: "MinaAddress",
        controller:
          "did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        name: "Mina Account",
        description: "My Mina account.",
        chain: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        address: expectedPublicKey,
      }

      const args: MinaSpecificArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        networkType: networkType,
      }

      const groupedCredential = await instance.deriveCredentials(
        args,
        getPassphrase,
        true,
      )
      expect(groupedCredential.address).to.deep.equal(
        expectedGroupedCredentials.address,
      )

      const zkAppCommand: Mina.SignableZkAppCommand = {
        command: {
          zkappCommand: {
            accountUpdates: [],
            memo: "E4YM2vTHhWEg66xpj52JErHUBU4pZ1yageL4TVDDpTTSsv8mK6YaH",
            feePayer: {
              body: {
                publicKey:
                  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
                fee: "100000000",
                validUntil: "100000",
                nonce: "1",
              },
              authorization: "",
            },
          },
          feePayer: {
            feePayer: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
            fee: "100000000",
            nonce: "1",
            memo: "test memo",
          },
        },
      }
      const signedZkAppCommand = await instance.sign(
        groupedCredential,
        zkAppCommand,
        {
          network: Network.Mina,
          operation: "mina_signTransaction",
          networkType: "testnet",
        } as ChainOperationArgs,
      )
      const minaClient = new Client({ network: args.networkType })
      const isVerified = await minaClient.verifyZkappCommand(
        signedZkAppCommand as Mina.SignedZkAppCommand,
      )
      expect(isVerified).toBeTruthy()
    })
  })
})
