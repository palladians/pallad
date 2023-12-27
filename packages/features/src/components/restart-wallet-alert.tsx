import { useVault } from '@palladxyz/vault'
import { storage } from 'webextension-polyfill'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

type RestartWalletAlertProps = {
  open: boolean
  setOpen: (open: boolean) => void
}

export const RestartWalletAlert = ({
  open,
  setOpen
}: RestartWalletAlertProps) => {
  const confirm = async () => {
    useVault.persist.clearStorage()
    await storage.local.clear()
    await storage.session.clear()
    await storage.managed.clear()
    setOpen(false)
    window.close()
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action is irreversible. This will permanently remove all data
            associated with your wallet. If you don't currently have your
            mnemonic, you won't be able to use it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirm}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
