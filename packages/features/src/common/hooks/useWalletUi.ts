import { Mina } from '@palladxyz/mina-core'
import { useWallet } from '@palladxyz/mina-wallet'
// import { useNavigate } from 'react-router-dom'

export const useWalletUi = () => {
  const wallet = useWallet({ name: 'Pallad', network: Mina.Networks.DEVNET })

  const lockWallet = () => {
    console.log('Not for now lol')
  }
  // const navigate = useNavigate()
  // The use App Store should be an API on the wallet

  // useState for the address
  // const gradientBackground = useMemo(
  //   () =>
  //     address &&
  //     easyMeshGradient({
  //       seed: address,
  //       hueRange: [180, 240]
  //     }),
  //   [address]
  // )

  // const switchNetwork = async (network: Mina.Networks) => {
  //   setNetwork(network)
  //   await wallet.switchNetwork(network)
  // }

  // const copyWalletAddress = async () => {
  //   await navigator.clipboard.writeText(address || '')
  //   toast({
  //     title: 'Wallet address was copied.'
  //   })
  // }

  // const lockWallet = () => {
  //   getSessionPersistence().setItem('spendingPassword', '')
  //   // TODO: create a store manager for keyAgentStore, accountStore, credentialStore
  //   // store.destory()? Maybe we don't have to do this
  //   // store.persist.rehydrate()
  //   wallet.rehydrateStores()
  //   return navigate('/')
  // }

  return {
    ...wallet,
    lockWallet
  }
}
