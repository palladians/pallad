import { beforeAll, beforeEach, describe, expect, it } from "bun:test"
import { utf8ToBytes } from "@noble/hashes/utils"
import {
  type ChainOperationArgs,
  type FromBip39MnemonicWordsProps,
  type GroupedCredentials,
  InMemoryKeyAgent,
  type MinaSpecificArgs,
} from "@palladco/key-management"
import { type AccountInfo, Mina, type TokenIdMap } from "@palladco/mina-core"
import { Network } from "@palladco/pallad-core"
import type {
  Payment,
  SignedLegacy,
} from "mina-signer/dist/node/mina-signer/src/TSTypes"

import { TransactionBodySchema } from "@mina-js/utils"
import { MinaNode } from "../../../../src"
import { sendMinaOnZeko } from "./util"

const nodeUrl = process.env.NODE_URL || "https://devnet.zeko.io/graphql"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

const params = {
  passphrase: "passphrase",
}

const getPassphrase = () => utf8ToBytes(params.passphrase)
// TODO: change this to local network
// TODO: use different mnemonic for this test -- else there are two duplicate transactions with the unified provider tests
describe.skip("Zeko Sequencer Submit Transaction Provider (Functional)", () => {
  let provider: ReturnType<typeof MinaNode.createTxSubmitProvider>
  let accountInfoProvider: ReturnType<typeof MinaNode.createAccountInfoProvider>
  let tokenMap: TokenIdMap
  let networkType: Mina.NetworkType
  let agent: InMemoryKeyAgent
  let mnemonic: string[]

  beforeEach(() => {
    provider = MinaNode.createTxSubmitProvider(nodeUrl)
    accountInfoProvider = MinaNode.createAccountInfoProvider(nodeUrl)
    tokenMap = {
      MINA: "1",
    }
  })

  beforeAll(async () => {
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
    networkType = "testnet"
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic,
      mnemonic2ndFactorPassphrase: "",
    }
    agent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
    const args: MinaSpecificArgs = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      networkType: networkType,
    }

    await agent.restoreKeyAgent(args, getPassphrase)
  })

  describe("healthCheck", () => {
    it("should return a health check response", async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  // TODO: use different mnemonic for this test -- else there are two duplicate transactions
  describe("submitTx", () => {
    it("should return the submitted transaction response", async () => {
      // fetch account info
      const accountInfo = (await accountInfoProvider.getAccountInfo({
        publicKey,
        tokenMap,
      })) as Record<string, AccountInfo>

      if (accountInfo.MINA?.balance.total === 0) {
        await sendMinaOnZeko(nodeUrl)
      }
      // construct transaction, sign, and submit
      const amount = 1 * 1e9
      const inferredNonce = accountInfo.MINA?.inferredNonce ?? 0
      const transaction = TransactionBodySchema.parse({
        to: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        from: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        fee: 0.5 * 1e9,
        amount: amount,
        nonce: Number(inferredNonce),
        memo: "pallad test suite",
        type: "payment",
        validUntil: 4294967295,
      })
      const credential = agent.serializableData.credentialSubject
        .contents[0] as GroupedCredentials
      const args: ChainOperationArgs = {
        operation: "mina_signTransaction",
        network: "Mina",
        networkType: networkType,
      }

      const signedTx = await agent.sign(credential, { transaction }, args)
      const submitTxArgs = {
        signedTransaction: signedTx as unknown as SignedLegacy<Payment>, // or SignedLegacy<Common>
        type: Mina.TransactionType.PAYMENT,
        transactionDetails: {
          fee: transaction.fee,
          to: transaction.to,
          from: transaction.from,
          nonce: transaction.nonce,
          memo: transaction.memo,
          amount: transaction.amount,
          validUntil: transaction.validUntil,
        },
      }
      // This test now depends on the actual response from the server
      const response = await provider.submitTx(submitTxArgs)
      //expect(response).toHaveProperty('MINA')
    })
  })

  //TODO: Other tests...
})
