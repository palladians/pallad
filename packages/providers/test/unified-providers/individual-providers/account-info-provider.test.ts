import type { TokenIdMap } from "@palladxyz/mina-core"

import { type ProviderConfig, createAccountInfoProvider } from "../../../src"

const minaNodeApiUrl =
  process.env.NODE_URL || "https://api.minascan.io/node/devnet/v1/graphql"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"

describe("Unified Account Info Provider (Functional)", () => {
  let provider: ReturnType<typeof createAccountInfoProvider>
  let tokenMap: TokenIdMap
  let configMinaExplorer: ProviderConfig

  beforeEach(() => {
    tokenMap = {
      MINA: "1",
    }
  })

  describe.skip("Mina Explorer Configuration", () => {
    beforeEach(() => {
      configMinaExplorer = {
        nodeEndpoint: {
          providerName: "mina-node",
          url: minaNodeApiUrl,
        },
        networkName: "Devnet",
        chainId: "...",
      }
      provider = createAccountInfoProvider(configMinaExplorer)
    })
    describe("healthCheck", () => {
      it("should return a health check response", async () => {
        // This test depends on the actual response from the server
        const response = await provider.healthCheck()
        expect(response.ok).toBe(true)
      })
    })

    describe("getAccountInfo", () => {
      it("should return account info for a valid public key", async () => {
        // This test now depends on the actual response from the server
        const response = await provider.getAccountInfo({ publicKey, tokenMap })
        expect(response).toHaveProperty("MINA")
      })
    })
  })
})
