import { beforeEach, describe, expect, it } from "bun:test"
import type { Mina } from "@palladxyz/mina-core"

import { Blockberry } from "../../src"

const explorerUrl =
  process.env.ARCHIVE_NODE_URL || "https://pallad.co/api/proxy/mina-devnet"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

describe("Mina Explorer Chain History Provider (Functional)", () => {
  let provider: ReturnType<typeof Blockberry.createChainHistoryProvider>

  beforeEach(() => {
    provider = Blockberry.createChainHistoryProvider(explorerUrl)
  })

  describe("healthCheck", () => {
    it("should return a health check response", async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe("transactionsByAddresses", () => {
    it("should return transaction history for a public key", async () => {
      // This test now depends on the actual response from the server
      const response = (await provider.transactionsByAddresses({
        addresses: [publicKey],
      })) as Mina.TransactionBody[]

      // TODO: investigate pagination
      const transaction = response[0]

      expect(transaction).toHaveProperty("amount")
      expect(transaction).toHaveProperty("blockHeight")
      expect(transaction).toHaveProperty("dateTime")
      expect(transaction).toHaveProperty("failureReason")
      expect(transaction).toHaveProperty("fee")
      expect(transaction).toHaveProperty("from")
      expect(transaction).toHaveProperty("hash")
      expect(transaction).toHaveProperty("isDelegation")
      //expect(transaction).toHaveProperty("kind")
      expect(transaction).toHaveProperty("to")
      expect(transaction).toHaveProperty("token")
    })
  })

  //TODO: Other tests...
})
