import type { AccountInfoArgs } from "@palladxyz/pallad-core"
import { optimismSepolia } from "viem/chains"

import { Optimism } from "../../../src"

const nodeUrl =
  process.env.OPTIMISM_NODE_URL || "wss://optimism-sepolia-rpc.publicnode.com"
const publicKey =
  process.env.PUBLIC_KEY || "0xA98005e6ce8E62ADf8f9020fa99888E8f107e3C9"

// TODO: Enable when we go back to EVM
describe.skip("Optimism Account Info Provider (Functional)", () => {
  let provider: ReturnType<typeof Optimism.createAccountInfoProvider>

  beforeEach(() => {
    provider = Optimism.createAccountInfoProvider(nodeUrl)
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
      const args: AccountInfoArgs = {
        publicKey: publicKey,
        chainInfo: optimismSepolia,
      }
      const response = await provider.getAccountInfo(args)
      expect(response).toHaveProperty("ETH")
    })
  })

  //TODO: Other tests...
})
