import { wordlist } from "@scure/bip39/wordlists/english"

import { KeyAgentBase } from "./KeyAgentBase"
import * as errors from "./errors"
import {
  type ChainDerivationArgs,
  type GetPassphrase,
  type KeyAgent,
  KeyAgentType,
  type SerializableInMemoryKeyAgentData,
} from "./types"
import {
  joinMnemonicWords,
  mnemonicWordsToEncryptedSeed,
  validateMnemonic,
} from "./util"

export interface InMemoryKeyAgentProps
  extends Omit<SerializableInMemoryKeyAgentData, "__typename"> {
  getPassphrase: GetPassphrase
}

export interface FromBip39MnemonicWordsProps {
  mnemonicWords: string[]
  mnemonic2ndFactorPassphrase?: string
  getPassphrase: GetPassphrase
}

export class InMemoryKeyAgent extends KeyAgentBase implements KeyAgent {
  static async fromMnemonicWords({
    getPassphrase,
    mnemonicWords,
    mnemonic2ndFactorPassphrase = "",
  }: FromBip39MnemonicWordsProps): Promise<InMemoryKeyAgent> {
    const mnemonic = joinMnemonicWords(mnemonicWords)
    const validMnemonic = validateMnemonic(mnemonic, wordlist)
    if (!validMnemonic) throw new errors.InvalidMnemonicError()

    const passphrase = getPassphrase()
    const encryptedSeedBytes = await mnemonicWordsToEncryptedSeed(
      mnemonicWords,
      passphrase,
      mnemonic2ndFactorPassphrase,
    )

    return new InMemoryKeyAgent({
      encryptedSeedBytes,
      type: [], // to rename
      id: "",
      issuer: "",
      issuanceDate: "",
      credentialSubject: {
        id: "",
        contents: [],
      },
      getPassphrase,
    })
  }

  constructor({ getPassphrase, ...serializableData }: InMemoryKeyAgentProps) {
    super(
      { ...serializableData, __typename: KeyAgentType.InMemory },
      getPassphrase,
    )
  }

  async restoreKeyAgent(
    args: ChainDerivationArgs,
    getPassphrase: GetPassphrase,
  ): Promise<InMemoryKeyAgent> {
    await this.deriveCredentials(args, getPassphrase, false)
    return this
  }

  getSeralizableData(): SerializableInMemoryKeyAgentData {
    return {
      ...this.serializableData,
    }
  }
}
