import { useTheme } from "next-themes"
import { useNavigate } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"

import { ReceiveView } from "../views/receive"

export const ReceiveRoute = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { copyWalletAddress, publicKey, gradientBackground } = useAccount()
  return (
    <ReceiveView
      theme={theme ?? "dark"}
      publicKey={publicKey}
      gradientBackground={gradientBackground}
      onCopyWalletAddress={copyWalletAddress}
      onGoBack={() => navigate(-1)}
    />
  )
}
