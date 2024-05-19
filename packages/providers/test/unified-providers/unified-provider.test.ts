import type { TokenIdMap } from "@palladxyz/mina-core"
import type { Tx } from "@palladxyz/pallad-core"

import { type ProviderConfig, createChainProvider } from "../../src"

const explorerUrl = process.env.EXPLORER_URL || "https://minascan.io/qanet/api/"
const nodeUrl =
  process.env.NODE_URL || "https://api.minascan.io/node/berkeley/v1/graphql"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

describe("Unified Chain provider", () => {
  let provider: ReturnType<typeof createChainProvider>
  let tokenMap: TokenIdMap
  let config: ProviderConfig

  beforeEach(() => {
    tokenMap = {
      MINA: "1",
    }
  })

  describe("Blockberry Configuration -- Mina Berkeley", () => {
    beforeEach(() => {
      config = {
        nodeEndpoint: {
          providerName: "mina-node",
          url: nodeUrl,
        },
        archiveNodeEndpoint: {
          providerName: "mina-scan",
          url: explorerUrl,
        },
        networkName: "berkeley",
        chainId: "...",
        networkType: "testnet",
      }

      provider = createChainProvider(config)
    })

    describe("healthCheck", () => {
      it("should return a health check response", async () => {
        // This test depends on the actual response from the server
        const response = await provider.healthCheck()
        expect(response).toHaveProperty("ok")
      })
    })

    describe("getAccountInfo", () => {
      it("should return account info for a valid public key", async () => {
        // This test now depends on the actual response from the server
        const response = await provider.getAccountInfo({ publicKey, tokenMap })
        expect(response).toHaveProperty("MINA")
      })

      describe("getTransactionsByAddress", () => {
        it("should return transactions for a valid public key", async () => {
          // This test now depends on the actual response from the server
          const response = (await provider.getTransactions({
            addresses: [publicKey],
          })) as Tx[]

          console.log(
            "Mina Explorer Unified.ChainHistory Provider Response",
            response,
          )
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
    })
  })

  describe("Zeko Configuration (Mixed with Mina Explorer for Chain History)", () => {
    beforeEach(() => {
      config = {
        nodeEndpoint: {
          providerName: "mina-node",
          url: "http://sequencer-zeko-dev.dcspark.io/graphql",
        },
        archiveNodeEndpoint: {
          providerName: "zeko-scan",
          url: "https://zekoscan.io/devnet",
        },
        networkName: "ZekoDevNet",
        networkType: "testnet",
        chainId: "...", // todo: fetch chainId from a provider
      }

      provider = createChainProvider(config)
    })

    describe("healthCheck", () => {
      it("should return a health check response", async () => {
        // This test depends on the actual response from the server
        const response = await provider.healthCheck()
        expect(response).toHaveProperty("ok")
      })
    })

    describe("getAccountInfo", () => {
      it("should return account info for a valid public key", async () => {
        // This test now depends on the actual response from the server
        const response = await provider.getAccountInfo({ publicKey, tokenMap })
        expect(response).toHaveProperty("MINA")
      })

      describe("getTransactionsByAddress", () => {
        it("should return transactions for a valid public key", async () => {
          // This test now depends on the actual response from the server
          const response = (await provider.getTransactions({
            addresses: [publicKey],
          })) as Tx[]

          console.log(
            "Mina Explorer Unified.ChainHistory Provider Response",
            response,
          )
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
    })
  })
})
