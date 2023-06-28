import { useVaultStore } from '../src/common/store/vault'
import { useAppStore } from '../src/common/store/app'
import { useEffect } from 'react'
import { MinaNetwork, Network } from '@palladxyz/key-generator'

const WALLET_NAME = 'Demo Wallet'
const MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const useStoriesWallet = () => {
  const restoreWallet = useVaultStore((state) => state.restoreWallet)
  const setNetwork = useAppStore((state) => state.setNetwork)
  useEffect(() => {
    setNetwork(MinaNetwork[MinaNetwork.Devnet])
    restoreWallet({
      walletName: WALLET_NAME,
      mnemonic: MNEMONIC,
      network: Network.Mina,
      accountNumber: 0
    })
  }, [])
}
