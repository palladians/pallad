import { Mina } from "@palladxyz/mina-core"
import { Network } from "@palladxyz/pallad-core"
import { constructTransaction } from "@palladxyz/pallad-core"
import * as bip32 from "@scure/bip32"
import Client from "mina-signer"
import sinon from "sinon"
import { expect } from "vitest"

//import { emip3encrypt } from '../src/emip3'
import {
  type FromBip39MnemonicWordsProps,
  //getPassphraseRethrowTypedError,
  InMemoryKeyAgent,
} from "../../src/InMemoryKeyAgent"
import type {
  MinaDerivationArgs,
  MinaSpecificArgs,
} from "../../src/chains/Mina"
import * as bip39 from "../../src/util/bip39"

// Create a sandbox for managing and restoring stubs
const sandbox = sinon.createSandbox()

// Provide the passphrase for testing purposes
const params = {
  passphrase: "passphrase",
}
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))

describe("Mina InMemoryKeyAgent", () => {
  let agent: InMemoryKeyAgent
  let rootKeyBytes: Uint8Array
  let mnemonic: string[]
  let seed: Uint8Array
  let root: bip32.HDKey
  let networkType: Mina.NetworkType

  beforeEach(async () => {
    // Create keys for testing purposes
    mnemonic = [
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
    ]
    //bip39.generateMnemonicWords(strength)
    seed = bip39.mnemonicToSeed(mnemonic, "")
    // Create root node from seed
    root = bip32.HDKey.fromMasterSeed(seed)
    // unencrypted root key bytes
    rootKeyBytes = root.privateKey ? root.privateKey : Buffer.from([])
    // define the agent properties
    //encryptedSeedBytes = await emip3encrypt(seed, passphrase)
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic,
      mnemonic2ndFactorPassphrase: "",
    }
    agent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    // network type
    networkType = "testnet"
  })

  afterEach(() => {
    // Restore all stubs after each test
    sandbox.restore()
  })

  it("should create an agent with given properties", () => {
    expect(agent).to.be.instanceOf(InMemoryKeyAgent)
  })
  it("should create an agent with given properties and return the getSeralizableData", () => {
    expect(agent).to.be.instanceOf(InMemoryKeyAgent)
    expect(agent.getSeralizableData()).not.toBe(undefined)
  })
  it("should export root private key", async () => {
    const result = await agent.exportRootPrivateKey()
    expect(result).to.deep.equal(rootKeyBytes)
  })
  describe("Restore InMemory KeyAgent", () => {
    /*
    // Need to fix this test
    it('should throw error when decrypting root private key fails', async () => {
        const fakeGetPassphrase = async () => Buffer.from('wrong_passphrase');
        const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase: fakeGetPassphrase,
          mnemonicWords: mnemonic
        });
        await expect(agentFromBip39.decryptSeed()).rejects.toThrow('Failed to decrypt root private key');
      });
      it('should throw error when decrypting coin type private key fails', async () => {
        const fakeGetPassphrase = async () => Buffer.from('wrong_passphrase');
        const agentFromBip39 = await InMemoryKeyAgent.fromBip39MnemonicWords({
          getPassphrase: fakeGetPassphrase,
          mnemonicWords: mnemonic
        });
        await expect(agentFromBip39.decryptCoinTypePrivateKey()).rejects.toThrow('Failed to decrypt coin type private key');
      });*/
    it("should restore an agent that has Mina credentials at initialisation", async () => {
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

      await agent.restoreKeyAgent(args, getPassphrase)
      expect(agent).to.be.instanceOf(InMemoryKeyAgent)
      expect(
        agent.serializableData.credentialSubject.contents[0]?.address,
      ).to.deep.equal(expectedGroupedCredentials.address)
    })
    it("should throw on invalid operation", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
      }

      const groupedCredential = await agent.deriveCredentials(
        args,
        getPassphrase,
        true,
      )
      const transaction: Mina.TransactionBody = {
        to: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        from: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
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

      try {
        await agent.sign(groupedCredential, constructedTx, {
          network: Network.Mina,
          networkType: "testnet",
          operation: "mina_signNotATransaction",
        })
        fail("Expected an error but did not get one.")
      } catch (error) {
        expect(error.message).toContain("Unsupported private key operation")
      }
    })
    it("should throw on invalid operation", async () => {
      const args: MinaDerivationArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
      }

      const groupedCredential = await agent.deriveCredentials(
        args,
        getPassphrase,
        true,
      )
      const transaction: Mina.TransactionBody = {
        to: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        from: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
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

      const signedTx = await agent.sign(groupedCredential, constructedTx, {
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
  })
})
