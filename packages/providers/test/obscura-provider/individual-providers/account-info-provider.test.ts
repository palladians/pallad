import type { TokenIdMap } from "@palladxyz/mina-core"

import { Obscura } from "../../../src/"

const nodeUrl =
  process.env.OBSCURA_URL || "https://pallad.co/api/obscura/devnet.json"
const publicKey =
  process.env.PUBLIC_KEY ||
  "B62qmHMUwiyNfv81NNTumW7Hv8SfRAGLXceGK3ZpyzXgmg2FLqmVhmA"
//'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

describe("Obscura Account Info Provider (Functional)", () => {
  let provider: ReturnType<typeof Obscura.createAccountInfoProvider>
  let tokenMap: TokenIdMap

  beforeEach(() => {
    provider = Obscura.createAccountInfoProvider(nodeUrl)
    tokenMap = {
      MINA: "1",
      WETH: "xaU5YZyGmvztCyXRFXnfrsp5E8wUVXmtyXBYrw5PF4WXGwPvme",
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
