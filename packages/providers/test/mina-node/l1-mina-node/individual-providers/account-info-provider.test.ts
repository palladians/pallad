import type { TokenIdMap } from "@palladxyz/mina-core"

import { MinaNode } from "../../../../src"

const nodeUrl =
  process.env.NODE_URL || "https://api.minascan.io/node/berkeley/v1/graphql"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq"
// TODO: change this to local network
describe.skip("Blockberry Account Info Provider (Functional)", () => {
  let provider: ReturnType<typeof MinaNode.createAccountInfoProvider>
  let tokenMap: TokenIdMap

  beforeEach(() => {
    provider = MinaNode.createAccountInfoProvider(nodeUrl)
    tokenMap = {
      MINA: "1",
    }
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

  //TODO: Other tests...
})
