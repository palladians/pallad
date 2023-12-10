import { useEffect } from 'react'
import { MinaPayload, Network } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { useVault } from '@palladxyz/vault'

const MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const useStoriesWallet = () => {
  const restoreWallet = useVault((state) => state.restoreWallet)
  const switchNetwork = useVault((state) => state.switchNetwork)
  useEffect(() => {
    const restore = async () => {
      await restoreWallet(
        new MinaPayload(),
        {
          network: Network.Mina,
          accountIndex: 0,
          addressIndex: 0,
          networkType: 'testnet'
        },
        Mina.Networks.DEVNET,
        {
          mnemonicWords: MNEMONIC.split(' '),
          getPassphrase: async () => Buffer.from('passphrase')
        }
      )
      await switchNetwork(Mina.Networks.DEVNET)
    }
    restore()
  }, [])
}
