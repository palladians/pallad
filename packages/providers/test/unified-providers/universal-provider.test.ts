import type { TokenIdMap } from "@palladxyz/mina-core"
import type { Tx } from "@palladxyz/pallad-core"

import { type ProviderConfig, createChainProvider } from "../../src"

const minaExplorerArchiveUrl =
  process.env.ARCHIVE_URL || "https://berkeley.graphql.minaexplorer.com"
const obscuraUrl =
  process.env.OBSCURA_URL ||
  "https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

describe("Universal Chain provider -- Mina Example (Functional)", () => {
  let provider: ReturnType<typeof createChainProvider>
  let tokenMap: TokenIdMap
  let configObscura: ProviderConfig

  beforeEach(() => {
    tokenMap = {
      MINA: "1",
    }
  })

  describe("Obscura Configuration (Mixed with Mina Explorer for Chain History)", () => {
    beforeEach(() => {
      configObscura = {
        nodeEndpoint: {
          providerName: "obscura",
          url: obscuraUrl,
        },
        archiveNodeEndpoint: {
          providerName: "mina-node",
          url: minaExplorerArchiveUrl,
        },
        networkName: "berkeley",
        chainId: "...",
      }

      provider = createChainProvider(configObscura)
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
        console.log("Obscura AccountInfo Provider Response", response)
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
          expect(transaction).toHaveProperty("kind")
          expect(transaction).toHaveProperty("to")
          expect(transaction).toHaveProperty("token")
        })
      })
    })
  })
})
