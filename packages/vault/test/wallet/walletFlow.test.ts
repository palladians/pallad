import { mnemonic } from "@palladxyz/common"
import type {
  ChainDerivationArgs,
  //constructTransaction,
  FromBip39MnemonicWordsProps,
  //GroupedCredentials,
  //MinaDerivationArgs,
} from "@palladxyz/key-management"
import { Network } from "@palladxyz/pallad-core"
//import { Mina } from '@palladxyz/mina-core'
import { act, renderHook } from "@testing-library/react"
import { expect } from "vitest"

//import Client from 'mina-signer'
//import { Payment, SignedLegacy } from 'mina-signer/dist/node/mina-signer/src/TSTypes'
import { type CredentialName, KeyAgents } from "../../src"
import { useVault } from "../../src"
import { DEFAULT_NETWORK } from "../../src/network-info/default"
import { EXAMPLE_CREDENTIAL } from "../../src/objects/default"

const PREGENERATED_MNEMONIC = mnemonic

// Provide the passphrase for testing purposes
const params = {
  passphrase: "passphrase",
}
const getPassphrase = () =>
  new Promise<Uint8Array>((resolve) => resolve(Buffer.from(params.passphrase)))

describe("WalletTest", () => {
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

  //afterEach(() => {
  //  const {
  //    result: { current }
  //  } = renderHook(() => useVault())
  //  act(() => current.clear())
  //})

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
    const chainId = result.current.getChainId()
    console.log("chainId: ", chainId)
    const networkInfos = result.current.getNetworkInfo(defaultNetwork)
    console.log("networkInfos: ", networkInfos)
    const currentNetworkInfo = result.current.getCurrentNetworkInfo()
    console.log("currentNetworkInfo: ", currentNetworkInfo)
    expect(chainId).not.toEqual("...")

    // check if first credential is in the store
    const minaCredentials = result.current.getCredentials(
      { type: "MinaAddress" },
      [],
    )
    expect(minaCredentials.length).toEqual(1)
    expect(minaCredentials[0]?.address).toEqual(expectedAddress)

    // check current network info is of the expected network
    const currentNetwork = result.current.getCurrentNetwork()
    console.log("currentNetwork: ", currentNetwork)
    expect(currentNetwork).toEqual(defaultNetwork)
    // check if accountInfo is in the store
    const accountInfo = result.current.getAccountsInfo(
      defaultNetwork,
      expectedAddress,
    )
    console.log("accountInfo", accountInfo)
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
    console.log("all credentials", allObjects)
    // get keyAgentName
    const currentKeyAgentName = result.current.keyAgentName
    console.log("keyAgentName", currentKeyAgentName)
    expect(currentKeyAgentName).toBe(keyAgentName)
  }, 30000)
})
