import { chacha20_poly1305 } from '@noble/ciphers/chacha'
import { pbkdf2Async } from '@noble/hashes/pbkdf2'
import { randomBytes } from '@noble/ciphers/webcrypto/utils'
import { sha512 } from '@noble/hashes/sha512'

const KEY_LENGTH = 32
const NONCE_LENGTH = 12
const PBKDF2_ITERATIONS = 19_162
const SALT_LENGTH = 32
//const TAG_LENGTH = 16

export const createPbkdf2Key = async (
  passphrase: Uint8Array,
  salt: Uint8Array
) =>
  pbkdf2Async(sha512, passphrase, salt, {
    c: PBKDF2_ITERATIONS,
    dkLen: KEY_LENGTH
  })

export const emip3encrypt = async (
  data: Uint8Array,
  passphrase: Uint8Array
): Promise<Uint8Array> => {
  const salt = randomBytes(SALT_LENGTH)
  const key = await createPbkdf2Key(passphrase, salt)
  const nonce = randomBytes(NONCE_LENGTH)
  const cipher = chacha20_poly1305(key, nonce)
  const encrypted = cipher.encrypt(data)
  return Buffer.concat([salt, nonce, encrypted])
}

export const emip3decrypt = async (
  encrypted: Uint8Array,
  passphrase: Uint8Array
): Promise<Uint8Array> => {
  const salt = encrypted.slice(0, SALT_LENGTH)
  const nonce = encrypted.slice(SALT_LENGTH, SALT_LENGTH + NONCE_LENGTH)
  const data = encrypted.slice(SALT_LENGTH + NONCE_LENGTH)
  const key = await createPbkdf2Key(passphrase, salt)
  const decipher = chacha20_poly1305(key, nonce)
  return decipher.decrypt(data)
}
