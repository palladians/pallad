import { useAppStore } from '../src/wallet/store/app'
import { useEffect } from 'react'
import { MinaNetwork, Network } from '@palladxyz/key-management'

const WALLET_NAME = 'Demo Wallet'
const MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const useStoriesWallet = () => {
  const setNetwork = useAppStore((state) => state.setNetwork)
  useEffect(() => {
    setNetwork(MinaNetwork[MinaNetwork.Devnet])
    // restoreWallet({
    //   walletName: WALLET_NAME,
    //   mnemonic: MNEMONIC,
    //   network: Network.Mina,
    //   accountNumber: 0
    // })
  }, [])
}
