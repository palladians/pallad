import * as Json from 'mina-signer/dist/node/mina-signer/src/TSTypes'

export type SignedZkAppCommand = Json.Signed<Json.ZkappCommand>

export type SignableZkAppCommand = {
  command: Json.ZkappCommand
}
