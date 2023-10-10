import { useEffect } from 'react'
import { MinaPayload, Network } from '@palladxyz/key-management'
import { useWallet } from '../src/common/hooks/useWallet'
import { Mina } from '@palladxyz/mina-core'

const MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const useStoriesWallet = () => {
  const { wallet } = useWallet()
  useEffect(() => {
    const restore = async () => {
      await wallet.restoreWallet(
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
      await wallet.switchNetwork(Mina.Networks.DEVNET)
      restore()
    }
  }, [])
}
