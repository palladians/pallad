import {
  type EthereumSignablePayload,
  EthereumSigningOperations,
} from "./chains"
import type { MinaSignablePayload } from "./chains/Mina"
import { MinaSigningOperations } from "./chains/Mina/signingOperations"
import {
  type ChainDerivationArgs,
  type ChainOperationArgs,
  type ChainSignablePayload,
  type ChainSignatureResult,
  type SessionChainKeyPair,
  createChainDerivationOperationsProvider,
  credentialSessionDerivers,
} from "./types"
import type { SessionGroupedCredentials, SessionKeyAgent } from "./types"
import * as bip39 from "./util/bip39"

export abstract class SessionKeyAgentBase implements SessionKeyAgent {
  async deriveCredentials(
    args: ChainDerivationArgs,
  ): Promise<SessionGroupedCredentials> {
    const derivedKeyPair = await this.deriveKeyPair(args)

    try {
      const deriveFunction = credentialSessionDerivers[args.network]
      if (!deriveFunction) {
        throw new Error(`Unsupported network: ${args.network}`)
      }
      const groupedCredential = deriveFunction(
        args,
        derivedKeyPair.publicKey,
        derivedKeyPair.privateKeyBytes,
      )

      return groupedCredential
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async deriveKeyPair(args: ChainDerivationArgs): Promise<SessionChainKeyPair> {
    // Generate the private key
    const privateKey = await this.#generatePrivateKey(args)

    const provider = createChainDerivationOperationsProvider(args)

    try {
      const keyPair = {
        publicKey: await provider.derivePublicKey(privateKey),
        privateKeyBytes: privateKey,
      }

      return keyPair
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async sign<T extends SessionGroupedCredentials>(
    payload: T,
    signable: ChainSignablePayload,
    args: ChainOperationArgs,
  ): Promise<ChainSignatureResult> {
    const privateKeyBytes = payload.privateKeyBytes

    let privateKey: string | null = Buffer.from(privateKeyBytes).toString()

    try {
      let result
      if (args.network === "Mina") {
        result = MinaSigningOperations(
          signable as MinaSignablePayload,
          args,
          privateKey,
        )
      } else if (args.network === "Ethereum") {
        result = EthereumSigningOperations(
          signable as EthereumSignablePayload,
          args,
          privateKey,
        )
      } else {
        throw new Error("Unsupported network")
      }

      // Overwrite and nullify the privateKey
      privateKey = "0".repeat(privateKey.length)
      privateKey = null

      return result
    } catch (error) {
      // Overwrite and nullify the privateKey
      if (privateKey) {
        privateKey = "0".repeat(privateKey.length)
        privateKey = null
      }
      console.error(error)
      throw error
    }
  }

  async #generatePrivateKey<T extends ChainDerivationArgs>(
    args: T,
  ): Promise<Uint8Array> {
    const randomMnemonic = bip39.generateMnemonicWords(256)
    const entropy = bip39.mnemonicWordsToEntropy(randomMnemonic)
    const seedBytes = bip39.entropyToSeed(entropy)
    const provider = createChainDerivationOperationsProvider(args)
    const privateKey = await provider.derivePrivateKey(seedBytes)
    return Buffer.from(privateKey)
  }
}
