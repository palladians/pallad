import * as bip32 from '@scure/bip32'

import { KeyConst } from '../types'

export interface DeriveCoinTypePrivateKeyProps {
  rootPrivateKey: Uint8Array
}

export const deriveCoinTypePrivateKey = async ({
  rootPrivateKey
}: DeriveCoinTypePrivateKeyProps): Promise<Uint8Array> => {
  const coinTypeKey = await bip32.HDKey.fromMasterSeed(rootPrivateKey)
    .deriveChild(KeyConst.PURPOSE)
    .deriveChild(KeyConst.MINA_COIN_TYPE)
  return coinTypeKey.privateKey ? coinTypeKey.privateKey : Buffer.from([])
}
