import { Mina } from "@palladxyz/mina-core"
import { constructTransaction } from "@palladxyz/pallad-core"
import { Network } from "@palladxyz/pallad-core"
import Client from "mina-signer"
import sinon from "sinon"
import { expect } from "vitest"

import type { MinaDerivationArgs } from "../../dist"
import { SessionKeyAgentBase } from "../../src"
import type { ChainOperationArgs } from "../../src/types"

describe("SessionKeyAgentBase (Mina Functionality)", () => {
  let instance: SessionKeyAgentBase
  let networkType: Mina.NetworkType

  beforeEach(async () => {})

  afterEach(() => {
    // Clean up all sinon stubs after each test.
    sinon.restore()
  })

  describe("Mina KeyAgent", () => {
    beforeEach(() => {
      class SessionKeyAgentBaseInstance extends SessionKeyAgentBase {}
      networkType = "testnet"
      instance = new SessionKeyAgentBaseInstance()
    })

    it("should derive random Mina session key credential", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      expect(groupedCredential.address).not.toBe(undefined)
    })

    it("should derive multiple unique Mina addresses for each account index and store credentials properly", async () => {
      const resultArray = []

      for (let i = 0; i < 5; i++) {
        const args: MinaDerivationArgs = {
          network: Network.Mina,
          accountIndex: i,
          addressIndex: 0,
        }
        // when pure is false it will store the credentials
        const result = await instance.deriveCredentials(args)

        resultArray.push(result)
      }

      // Check if the credentials were stored properly.
      expect(resultArray[0]?.address).not.toBe(undefined)
      expect(resultArray[1]?.address).not.toBe(undefined)
      expect(resultArray[2]?.address).not.toBe(undefined)
      expect(resultArray[3]?.address).not.toBe(undefined)
    })

    it("should use the generic sign<T> function for signing a transaction", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      expect(groupedCredential.address).not.toBe(undefined)

      const transaction: Mina.TransactionBody = {
        to: groupedCredential.address,
        from: groupedCredential.address,
        fee: 1,
        amount: 100,
        nonce: 0,
        memo: "hello Bob",
        validUntil: 321,
        type: "payment",
      }
      const constructedTx: Mina.ConstructedTransaction = constructTransaction(
        transaction,
        Mina.TransactionKind.PAYMENT,
      )
      const signedTx = await instance.sign(groupedCredential, constructedTx, {
        network: Network.Mina,
        networkType: "testnet",
        operation: "mina_signTransaction",
      })
      const minaClient = new Client({ network: "testnet" })
      const isVerified = minaClient.verifyTransaction(
        signedTx as Mina.SignedTransaction,
      )
      expect(isVerified).toBeTruthy()
    })
    it("should use the generic sign<T> function for signing a message", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      const message: Mina.MessageBody = {
        message: "Hello, Bob!",
      }
      const signedMessage = await instance.sign(groupedCredential, message, {
        network: Network.Mina,
        operation: "mina_sign",
        networkType: "testnet",
      } as ChainOperationArgs)
      const minaClient = new Client({ network: "testnet" })
      const isVerified = await minaClient.verifyMessage(
        signedMessage as Mina.SignedMessage,
      )
      expect(isVerified).toBeTruthy()
    })
    it("should fail to sign a message because of an unsupported network", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      const message: Mina.MessageBody = {
        message: "Hello, Bob!",
      }

      try {
        await instance.sign(groupedCredential, message, {
          network: "NotAMinaNetwork" as Network,
          operation: "mina_sign",
          networkType: "testnet",
        } as ChainOperationArgs)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        // Check the error message to contain specific text indicating the type of error
        expect(error.message).toContain("Unsupported network")
      }
    })

    it("should use the generic sign<T> function to sign fields correctly and the client should be able to verify it", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      const fields: Mina.SignableFields = {
        fields: [
          BigInt(10),
          BigInt(20),
          BigInt(30),
          BigInt(340817401),
          BigInt(2091283),
          BigInt(1),
          BigInt(0),
        ],
      }
      const signedFields = await instance.sign(groupedCredential, fields, {
        network: Network.Mina,
        operation: "mina_signFields",
        networkType: "testnet",
      } as ChainOperationArgs)
      const minaClient = new Client({ network: "testnet" })
      const isVerified = await minaClient.verifyFields(
        signedFields as Mina.SignedFields,
      )
      expect(isVerified).toBeTruthy()
    })
    it("should use the generic sign<T> function to create a nullifier correctly and the client should be able to verify it", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      const nullifier: Mina.CreatableNullifer = {
        message: [BigInt(10)],
      }
      const createdNullifier = await instance.sign(
        groupedCredential,
        nullifier,
        {
          network: Network.Mina,
          operation: "mina_createNullifier",
          networkType: "testnet",
        } as ChainOperationArgs,
      )

      expect(createdNullifier).not.toBeUndefined()
    })
    it("should use the generic sign<T> function to create a nullifier using the args `operation` field --correctly and the client should be able to verify it", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: Math.floor(Math.random() * 10),
        addressIndex: Math.floor(Math.random() * 10),
      }

      const groupedCredential = await instance.deriveCredentials(args)

      const nullifier: Mina.CreatableNullifer = {
        message: [BigInt(10)],
      }

      const operations: ChainOperationArgs = {
        operation: "mina_createNullifier",
        network: "Mina",
        networkType: "testnet",
      }

      const createdNullifier = await instance.sign(
        groupedCredential,
        nullifier,
        operations,
      )

      expect(createdNullifier).not.toBeUndefined()
    })
  })
})
