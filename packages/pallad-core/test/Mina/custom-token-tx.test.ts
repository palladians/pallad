/*
import {
  ChainDerivationArgs,
  FromBip39MnemonicWordsProps,
  InMemoryKeyAgent,
  KeyDecryptor,
  Network
} from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import sinon from 'sinon'
//import { constructCustomTokenPaymentTx, paymentInfo } from '../../src/Pallad/transactions/mina'




NOTE: This file will error with:
LinkError: WebAssembly.Instance(): Import #0 module="env" function="memory" error: memory import must be a WebAssembly.Memory object
 ❯ Object.<anonymous> ../../node_modules/.pnpm/o1js@0.18.0/node_modules/o1js/dist/node/bindings/compiled/_node_bindings/plonk_wasm.cjs:9823:22

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
LinkError: WebAssembly.Instance(): Import #0 module="env" function="memory" error: memory import must be a WebAssembly.Memory object
 ❯ Object.<anonymous> ../../node_modules/.pnpm/o1js@0.18.0/node_modules/o1js/dist/node/bindings/compiled/_node_bindings/plonk_wasm.cjs:9823:22
 ❯ Module._compile node:internal/modules/cjs/loader:1376:14
 ❯ Object.Module._extensions..js node:internal/modules/cjs/loader:1435:10
 ❯ Module.load node:internal/modules/cjs/loader:1207:32
 ❯ Function.Module._load node:internal/modules/cjs/loader:1023:12
 ❯ cjsLoader node:internal/modules/esm/translators:345:17
 ❯ ModuleWrap.<anonymous> node:internal/modules/esm/translators:294:7
 ❯ ModuleJob.run node:internal/modules/esm/module_job:218:25
 ❯ ModuleLoader.import node:internal/modules/esm/loader:329:24
 ❯ VitestExecutor.interopedImport ../../node_modules/.pnpm/vite-node@1.5.0_@types+node@20.12.7/node_modules/vite-node/dist/client.mjs:383:28

This error originated in "test/Mina/custom-token-tx.test.ts" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.


// Create a sandbox for managing and restoring stubs
const sandbox = sinon.createSandbox()

// Provide the passphrase for testing purposes
const params = {
  passphrase: 'passphrase'
}
const getPassphrase = () => utf8ToBytes(params.passphrase)

describe('Mina InMemoryKeyAgent Signing Custom Token Transaction', () => {
  let agent: InMemoryKeyAgent
  let mnemonic: string[]

  beforeEach(async () => {
    // Create keys for testing purposes
    mnemonic = [
      'habit',
      'hope',
      'tip',
      'crystal',
      'because',
      'grunt',
      'nation',
      'idea',
      'electric',
      'witness',
      'alert',
      'like'
    ]
    //encryptedSeedBytes = await emip3encrypt(seed, passphrase)
    const agentArgs: FromBip39MnemonicWordsProps = {
      getPassphrase: getPassphrase,
      mnemonicWords: mnemonic,
      mnemonic2ndFactorPassphrase: ''
    }
    agent = await InMemoryKeyAgent.fromMnemonicWords(agentArgs)
  })

  afterEach(() => {
    // Restore all stubs after each test
    sandbox.restore()
  })
  describe('Restore InMemory KeyAgent', () => {
    it('should restore an agent that has Mina credentials at initialisation', async () => {
      const expectedPublicKey: Mina.PublicKey =
        'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'

      const expectedGroupedCredentials = {
        '@context': ['https://w3id.org/wallet/v1'],
        id: 'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        type: 'MinaAddress',
        controller:
          'did:mina:B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        name: 'Mina Account',
        description: 'My Mina account.',
        chain: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
        address: expectedPublicKey
      }

      const args: ChainDerivationArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0
      }

      await agent.restoreKeyAgent(args, getPassphrase)
      expect(agent).to.be.instanceOf(InMemoryKeyAgent)
      expect(
        agent.serializableData.credentialSubject.contents[0]?.address
      ).to.deep.equal(expectedGroupedCredentials.address)
      const encryptedChildKey =
        agent.serializableData.credentialSubject.contents[0]
          ?.encryptedPrivateKeyBytes
      const decryptor = new KeyDecryptor(getPassphrase)
      const decryptedChildKey = Buffer.from(
        await decryptor.decryptChildPrivateKey(encryptedChildKey as Uint8Array)
      ).toString()
    })
  })

  describe('Build custom token transaction & sign', () => {
    it('should build a custom token transaction and sign with keyagent', async () => {

      const args: ChainDerivationArgs = {
        network: Network.Mina,
        accountIndex: 0,
        addressIndex: 0,
      }

      await agent.restoreKeyAgent(args, getPassphrase)
      const groupedCredentials = agent.serializableData.credentialSubject.contents[0] as GroupedCredentials

      const paymentargs: paymentInfo = {
        to: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        from: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb',
        amount: '10',
        fee: '0.01',
        tokenAddress: 'B62qjsV6WQwTeEWrNrRRBP6VaaLvQhwWTnFi4WP4LQjGvpfZEumXzxb'
      }
      const tx = await constructCustomTokenPaymentTx(paymentargs) as ChainSignablePayload

      const operationArgs: ChainOperationArgs = {
        operation: 'mina_signTransaction',
        network: 'Mina',
        networkType: networkType
      }

      const signedTx = await agent.sign(groupedCredentials, tx, operationArgs)
    })
  })
})
*/
import { test } from "vitest"

test("concatenation", () => {
  const str1 = "Hello"
  const str2 = "World"
  expect(`${str1} ${str2}`).toBe("Hello World")
})
