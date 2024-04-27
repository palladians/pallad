import * as bip32 from "@scure/bip32"

import { MinaKeyConst } from "../chains/Mina/types"

export interface DeriveCoinTypePrivateKeyProps {
  rootPrivateKey: Uint8Array
}

export const deriveCoinTypePrivateKey = async ({
  rootPrivateKey,
}: DeriveCoinTypePrivateKeyProps): Promise<Uint8Array> => {
  const coinTypeKey = await bip32.HDKey.fromMasterSeed(rootPrivateKey)
    .deriveChild(MinaKeyConst.PURPOSE)
    .deriveChild(MinaKeyConst.MINA_COIN_TYPE)
  return coinTypeKey.privateKey ? coinTypeKey.privateKey : Buffer.from([])
}
