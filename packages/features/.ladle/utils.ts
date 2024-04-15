import { useEffect } from 'react'
import { MinaPayload, Network } from '@palladxyz/key-management'
import { Mina } from '@palladxyz/mina-core'
import { KeyAgents, useVault } from '@palladxyz/vault'

const MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const useStoriesWallet = () => {
  const restoreWallet = useVault((state) => state.restoreWallet)
  useEffect(() => {
    const restore = async () => {
      await restoreWallet(
        new MinaPayload(),
        {
          network: Network.Mina,
          accountIndex: 0,
          addressIndex: 0,
        },
        Mina.Networks.BERKELEY,
        {
          mnemonicWords: MNEMONIC.split(' '),
          getPassphrase: () =>
            new Promise<Uint8Array>((resolve) =>
              resolve(Buffer.from('passphrase'))
            )
        },
        'Pallad',
        KeyAgents.InMemory,
        'Test'
      )
    }
    restore()
  }, [])
}
