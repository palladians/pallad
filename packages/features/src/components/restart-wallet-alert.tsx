import { useVault } from "@palladxyz/vault"

type RestartWalletAlertProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const RestartWalletAlert = ({
  open,
  setOpen,
}: RestartWalletAlertProps) => {
  const confirm = async () => {
    const { storage } = await import("webextension-polyfill")
    useVault.persist.clearStorage()
    await storage.local.clear()
    await storage.session.clear()
    await storage.sync.clear()
    setOpen(false)
    window.close()
  }
  return null
}
