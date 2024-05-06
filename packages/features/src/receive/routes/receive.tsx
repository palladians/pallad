import { useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"

import { ReceiveView } from "../views/receive"

export const ReceiveRoute = () => {
  const navigate = useNavigate()
  const { copyWalletAddress, publicKey } = useAccount()
  return (
    <ReceiveView
      publicKey={publicKey}
      onCopyWalletAddress={copyWalletAddress}
      onGoBack={() => navigate(-1)}
    />
  )
}
