import { beforeEach, describe, expect, it } from "bun:test"
import { utf8ToBytes } from "@noble/hashes/utils"
import { mnemonic } from "@palladxyz/common"
import type {
  ChainDerivationArgs,
  FromBip39MnemonicWordsProps,
} from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
import { act, renderHook } from "@testing-library/react"

import { type CredentialName, KeyAgents } from "../../src"
import { useVault } from "../../src"
import { DEFAULT_NETWORK } from "../../src/network-info/default"
import { EXAMPLE_CREDENTIAL } from "../../src/objects/default"

const PREGENERATED_MNEMONIC = mnemonic

// Provide the passphrase for testing purposes
const params = {
  passphrase: "passphrase",
}
const getPassphrase = () => utf8ToBytes(params.passphrase)

// TODO: Enable when https://github.com/oven-sh/bun/issues/14184 is done
describe.skip("WalletTest", () => {
  let agentArgs: FromBip39MnemonicWordsProps
  let network: string
  let args: ChainDerivationArgs
  let credentialName: CredentialName
  let keyAgentName: string
  let expectedAddress: string
  let defaultNetwork: string

  beforeEach(() => {
    agentArgs = {
      getPassphrase: getPassphrase,
      mnemonicWords: PREGENERATED_MNEMONIC,
    }
    network = DEFAULT_NETWORK
    args = {
      network: Network.Mina,
      accountIndex: 0,
      addressIndex: 0,
    }
    credentialName = "Test Suite Credential"
    keyAgentName = "Test Suite Key Agent"
    expectedAddress = "B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb"
    defaultNetwork = DEFAULT_NETWORK
  })

  it("should (1.) add one key agent its first credential /0/0 (2.) sync the network info (3.) add a credential (4.) check if key agent name has been overwritten", async () => {
    const { result } = renderHook(() => useVault())

    // add first key agent
    await act(async () => {
      // restore wallet
      await result.current.restoreWallet(
        args,
        network,
        agentArgs,
        keyAgentName,
        KeyAgents.InMemory,
        credentialName,
      )
    })
    // add first key agent
    //await result.current.initialiseKeyAgent(
    //  keyAgentName,
    //  KeyAgents.InMemory,
    //  agentArgs
    //)
    // check that key agent is in the store
    const keyagent = result.current.getKeyAgent(keyAgentName)
    expect(keyagent?.keyAgentType).toEqual(KeyAgents.InMemory)

    // check if chainId has been set and not '...'
    const networkId = result.current.getNetworkId()
    expect(networkId).not.toEqual("...")

    // check if first credential is in the store
    const minaCredentials = result.current.getCredentials(
      { type: "MinaAddress" },
      [],
    )
    expect(minaCredentials.length).toEqual(1)
    expect(minaCredentials[0]?.address).toEqual(expectedAddress)

    // check current network info is of the expected network
    const currentNetworkId = result.current.getCurrentNetworkId()
    expect(currentNetworkId).toEqual(defaultNetwork)
    // check if accountInfo is in the store
    const accountInfo = result.current.getAccountsInfo(
      defaultNetwork,
      expectedAddress,
    )
    expect(accountInfo).toBeDefined()
    act(() => {
      result.current.setObject({
        objectName: "example credential",
        object: EXAMPLE_CREDENTIAL,
      })
    })

    const allObjects = result.current.searchObjects(
      { issuer: "University of Example" },
      [],
    )
    expect(allObjects.length).toEqual(2)
    // get keyAgentName
    const currentKeyAgentName = result.current.keyAgentName
    expect(currentKeyAgentName).toBe(keyAgentName)
  }, 30000)
})
