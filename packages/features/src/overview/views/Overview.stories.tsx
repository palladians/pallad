import { StoryDefault } from '@ladle/react'
import { useEffect } from 'react'

import { useAppStore } from '../../common/store/app'
import { useVaultStore } from '../../common/store/vault'
import { OverviewView } from './Overview'

const WALLET_NAME = 'Demo Wallet'
const MNEMONIC =
  'habit hope tip crystal because grunt nation idea electric witness alert like'

export const View = () => {
  const restoreWallet = useVaultStore((state) => state.restoreWallet)
  const setNetwork = useAppStore((state) => state.setNetwork)
  useEffect(() => {
    setNetwork('Devnet')
    restoreWallet({ walletName: WALLET_NAME, mnemonic: MNEMONIC })
  }, [])
  return <OverviewView />
}

export default {
  title: 'Overview / Overview'
} satisfies StoryDefault
