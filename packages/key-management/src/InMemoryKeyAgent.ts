import { wordlist } from '@scure/bip39/wordlists/english'

import { emip3encrypt } from './emip3'
import * as errors from './errors'
import { KeyAgentBase } from './KeyAgentBase'
import {
  ChainSpecificArgs,
  ChainSpecificPayload,
  GetPassphrase,
  KeyAgent,
  KeyAgentType,
  SerializableInMemoryKeyAgentData
} from './types'
import {
  entropyToSeed,
  joinMnemonicWords,
  mnemonicWordsToEntropy,
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

    const entropy = mnemonicWordsToEntropy(mnemonicWords)
    const seedBytes = await entropyToSeed(entropy, mnemonic2ndFactorPassphrase)
    const passphrase = await getPassphraseRethrowTypedError(getPassphrase)
    const encryptedSeedBytes = await emip3encrypt(seedBytes, passphrase)

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
    args: ChainSpecificArgs
  ): Promise<InMemoryKeyAgent> {
    await this.deriveCredentials(payload, args, false)
    return this
  }
}
