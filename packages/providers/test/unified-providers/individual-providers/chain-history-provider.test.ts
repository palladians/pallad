import { beforeEach, describe, expect, it } from "bun:test"
import type { Mina } from "@palladxyz/mina-core"

import { type ProviderConfig, createChainHistoryProvider } from "../../../src"

const minaNodeApiUrl =
  process.env.ARCHIVE_NODE_URL ||
  "https://api.minascan.io/archive/devnet/v1/graphql"

const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

// Deprecated, confirm if we should delete
describe.skip("Unified Chain History Provider (Functional)", () => {
  let provider: ReturnType<typeof createChainHistoryProvider>
  let configMinaExplorer: ProviderConfig

  describe("Mina Explorer Configuration", () => {
    beforeEach(() => {
      configMinaExplorer = {
        nodeEndpoint: {
          providerName: "mina-node",
          url: "...",
        },
        archiveNodeEndpoint: {
          providerName: "mina-scan",
          url: minaNodeApiUrl,
        },
        explorer: {
          accountUrl: "",
          transactionUrl: "",
          pendingTransactionsUrl: "",
        },
        networkName: "Devnet",
        networkId: "mina:devnet",
      }
      provider = createChainHistoryProvider(configMinaExplorer)
    })
    describe("healthCheck", () => {
      it("should return a health check response", async () => {
        // This test depends on the actual response from the server
        const response = await provider.healthCheck()
        expect(response.ok).toBe(true)
      })
    })

    describe("transactionsByAddresses", () => {
      it("should return transaction history for a valid public key", async () => {
        // This test now depends on the actual response from the server
        const response = (await provider.transactionsByAddresses({
          addresses: [publicKey],
        })) as Mina.TransactionBody[]

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
  })

  // TODO: add obsucra Archive provider tests
})
