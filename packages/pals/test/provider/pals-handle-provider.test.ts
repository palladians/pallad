import "./test-setup"

import { createPalsHandleProvider } from "../../src"

const relativeUrl = ""

describe("createPalsHandleProvider", () => {
  it("should create a pals handle provider", () => {
    const palsHandleProvider = createPalsHandleProvider(relativeUrl)
    expect(palsHandleProvider).toBeDefined()
  })

  it("should get an address from a handle", async () => {
    const palsHandleProvider = createPalsHandleProvider(relativeUrl)
    const result = await palsHandleProvider.getAddressFromHandle({
      handle: "$teddy",
    })
    expect(result.address).toBe(
      "B62qs2mR2g7LB27P36MhxN5jnsnjS8t6azttZfCnAToVpCmTtRVT2nt",
    )
  })

  it("should check health of Pals Handle Provider", async () => {
    const palsHandleProvider = createPalsHandleProvider(relativeUrl)
    const result = await palsHandleProvider.healthCheck()
    console.log("Pals Handle Provider Health Check Response", result)
    expect(result.ok).toBe(true)
    expect(result.message).toBe("Server is healthy")
  })

  it("should get a list of addresses from a partial handle", async () => {
    const palsHandleProvider = createPalsHandleProvider(relativeUrl)
    const result = await palsHandleProvider.getSearchedHandles({ handle: "$" })
    expect(result.addresses).toHaveLength(5)
  })
})
