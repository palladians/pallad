import { beforeEach, describe, expect, it } from "bun:test"
import type { Mina } from "@palladco/mina-core"
import { MinaNode } from "../../../../src"

const nodeUrl =
  process.env.ARCHIVE_NODE_URL ||
  "https://api.minascan.io/node/devnet/v1/graphql"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

// Deprecated, to be removed when confirmed it won't be needed.
describe.skip("Mina Explorer Chain History Provider (Functional)", () => {
  let provider: ReturnType<typeof MinaNode.createChainHistoryProvider>

  beforeEach(() => {
    provider = MinaNode.createChainHistoryProvider(nodeUrl)
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
      // TODO: check why pageResults is undefined

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
      expect(transaction).toHaveProperty("kind")
      expect(transaction).toHaveProperty("to")
      expect(transaction).toHaveProperty("token")
    })
  })

  //TODO: Other tests...
})
