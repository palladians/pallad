import { wordlist } from '@scure/bip39/wordlists/english'

import * as errors from './errors'
import { KeyAgentBase } from './KeyAgentBase'
import {
  ChainDerivationArgs,
  ChainSpecificPayload,
  GetPassphrase,
  KeyAgent,
  KeyAgentType,
  SerializableInMemoryKeyAgentData
} from './types'
import {
  joinMnemonicWords,
  mnemonicWordsToEncryptedSeed,
  validateMnemonic
} from './util'

export interface InMemoryKeyAgentProps
  extends Omit<SerializableInMemoryKeyAgentData, '__typename'> {
  getPassphrase: GetPassphrase
}

export interface FromBip39MnemonicWordsProps {
  mnemonicWords: string[]
  mnemonic2ndFactorPassphrase?: string
  getPassphrase: GetPassphrase
}

export const getPassphraseRethrowTypedError = async (
  getPassphrase: GetPassphrase
) => {
  try {
    return await getPassphrase()
  } catch (error) {
    throw new errors.AuthenticationError('Failed to enter passphrase', error)
  }
}
export class InMemoryKeyAgent extends KeyAgentBase implements KeyAgent {
  static async fromMnemonicWords({
    getPassphrase,
    mnemonicWords,
    mnemonic2ndFactorPassphrase = ''
  }: FromBip39MnemonicWordsProps): Promise<InMemoryKeyAgent> {
    const mnemonic = joinMnemonicWords(mnemonicWords)
    const validMnemonic = validateMnemonic(mnemonic, wordlist)
    if (!validMnemonic) throw new errors.InvalidMnemonicError()

    const passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    const encryptedSeedBytes = await mnemonicWordsToEncryptedSeed(
      mnemonicWords,
      passphrase,
      mnemonic2ndFactorPassphrase
    )

    return new InMemoryKeyAgent({
      encryptedSeedBytes,
      type: [], // to rename
      id: '',
      issuer: '',
      issuanceDate: '',
      credentialSubject: {
        id: '',
        contents: []
      },
      getPassphrase
    })
  }

  constructor({ getPassphrase, ...serializableData }: InMemoryKeyAgentProps) {
    super(
      { ...serializableData, __typename: KeyAgentType.InMemory },
      getPassphrase
    )
  }

  async restoreKeyAgent<T extends ChainSpecificPayload>(
    payload: T,
    args: ChainDerivationArgs,
    getPassphrase: GetPassphrase
  ): Promise<InMemoryKeyAgent> {
    await this.deriveCredentials(payload, args, getPassphrase, false)
    return this
  }

  getSeralizableData(): SerializableInMemoryKeyAgentData {
    return {
      ...this.serializableData
    }
  }
}
