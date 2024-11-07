import { beforeEach, describe, expect, it } from "bun:test"
import { MinaNode } from "../../../../src"

const nodeUrl =
  process.env.NODE_URL || "https://api.minascan.io/node/devnet/v1/graphql"

// TODO: change this to local network
describe("Blockberry Node Status Provider (Functional)", () => {
  let provider: ReturnType<typeof MinaNode.createNodeStatusProvider>

  beforeEach(() => {
    provider = MinaNode.createNodeStatusProvider(nodeUrl)
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
      const response = await provider.getNodeStatus()
    })
  })

  //TODO: Other tests...
})
