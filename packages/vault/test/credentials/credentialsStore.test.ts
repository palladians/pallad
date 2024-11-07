import { beforeEach, describe, expect, it } from "bun:test"
import type { GroupedCredentials } from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
import { act, renderHook } from "@testing-library/react"

import {
  type CredentialName,
  type SingleCredentialState,
  type StoredCredential,
  useVault,
} from "../../src"
import type { KeyAgentName } from "../../src"

describe("CredentialStore", () => {
  let credential: GroupedCredentials
  let credentialName: CredentialName
  let keyAgentName: KeyAgentName
  let credentialState: SingleCredentialState
  let credentialStateTwo: SingleCredentialState
  let credentialTwo: object

  beforeEach(() => {
    credential = {
      "@context": ["https://w3id.org/wallet/v1"],
      id: "did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
      type: "MinaAddress",
      controller:
        "did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
      name: "Mina Account",
      description: "My Mina account.",
      chain: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
      address: "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
      encryptedPrivateKeyBytes: new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7]),
    }
    credentialTwo = {
      "@context": ["https://www.w3.org/2018/credentials/v1"],
      id: "http://example.edu/credentials/3732",
      type: ["VerifiableCredential", "UniversityDegreeCredential"],
      issuer: "University of Example",
      issuanceDate: "2010-01-01T00:00:00Z",
      credentialSubject: {
        id: "did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb",
        degree: {
          type: "BachelorDegree",
          name: "Bachelor of Science and Arts",
        },
      },
      proof: {
        type: "Kimchi",
        created: "2023-09-19T12:40:16Z",
        proof: {
          publicInput: ["0"],
          publicOutput: ["1"],
          maxProofsVerified: 0,
          proof: "KChzdGF0ZW1...SkpKSkp",
        },
      },
    }

    credentialName = "credentialName"
    keyAgentName = "keyAgentName"
    credentialState = {
      credentialName: credentialName,
      keyAgentName: keyAgentName,
      credential: credential,
    }
    credentialStateTwo = {
      credentialName: "green crocodile credential",
      keyAgentName: "keyAgentNameTwo",
      credential: credentialTwo as StoredCredential,
    }
    const { result } = renderHook(() => useVault())
    act(() => result.current.clearCredentials())
  })

  it("should create an credential store", () => {
    const { result } = renderHook(() => useVault())
    expect(result.current.credentials).toEqual({})
  })

  it("should add one Grouped Credentials and remove one from store", () => {
    let storedCredential: SingleCredentialState | undefined
    const { result } = renderHook(() => useVault())
    act(() => {
      result.current.setCredential(credentialState)
      storedCredential = result.current.getCredential(credentialName)
    })
    expect(storedCredential?.credential).toEqual(credential)
    act(() => {
      result.current.removeCredential(credentialName)
      storedCredential = result.current.getCredential(credentialName)
    })
    // check that credential is removed
    expect(storedCredential?.credential).toBeUndefined()
  })

  it("should add two Grouped Credentials and search for both separately", () => {
    let storedCredentials: StoredCredential[] | undefined
    let storedCredentialsTwo: StoredCredential[] | undefined
    let storedCredentialsThree: StoredCredential[] | undefined
    const { result } = renderHook(() => useVault())
    // search for first credential
    const searchQuery = {
      type: "MinaAddress",
      chain: Network.Mina,
    }
    // search for second credential
    const searchQueryTwo = {
      issuer: "University of Example",
      type: "UniversityDegreeCredential",
    }
    // search for second credential with a different query -- nested query
    const searchQueryThree = {
      credentialSubject: {
        degree: {
          type: "BachelorDegree",
        },
      },
    }
    act(() => {
      // add first credential
      result.current.setCredential(credentialState)
      // add second credential
      result.current.setCredential(credentialStateTwo)
      storedCredentials = result.current.searchCredentials(searchQuery)
    })
    expect(storedCredentials).toBeDefined()
    expect(storedCredentials?.length).toEqual(1)
    act(() => {
      // can partially search a credential with an array
      storedCredentialsTwo = result.current.searchCredentials(searchQueryTwo)
    })
    expect(storedCredentialsTwo).toBeDefined()
    expect(storedCredentialsTwo?.length).toEqual(1)
    act(() => {
      storedCredentialsThree =
        result.current.searchCredentials(searchQueryThree)
    })
    expect(storedCredentialsThree).toBeDefined()
    expect(storedCredentialsThree?.length).toEqual(1)
  })
  it("should add two Grouped Credentials and search for Mina addresses and return them as an array not as a credential object", () => {
    let storedCredentials: StoredCredential[] | undefined
    // search for first credential
    const searchQuery = {
      type: "MinaAddress",
      chain: Network.Mina,
    }
    // return props
    const props = ["address"]
    const { result } = renderHook(() => useVault())
    act(() => {
      // add first credential
      result.current.setCredential(credentialState)
      // add second credential
      result.current.setCredential(credentialStateTwo)
      storedCredentials = result.current.searchCredentials(searchQuery, props)
    })
    expect(storedCredentials).toBeDefined()
    expect(storedCredentials?.length).toEqual(1)
  })
})
