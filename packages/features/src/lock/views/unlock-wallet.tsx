import type { UseFormReturn } from "react-hook-form"

import { FormError } from "@/components/form-error"
import { RestartWalletAlert } from "@/components/restart-wallet-alert"
import { WizardLayout } from "@/components/wizard-layout"
import { cn } from "@/lib/utils"

type UnlockWalletData = {
  spendingPassword: string
}

type UnlockWalletViewProps = {
  restartAlertVisible: boolean
  setRestartAlertVisible: (visible: boolean) => void
  form: UseFormReturn<UnlockWalletData, any, undefined>
  onSubmit: (data: UnlockWalletData) => unknown
  showPassword: boolean
  togglePassword: (event: any) => void
}

export const UnlockWalletView = ({
  restartAlertVisible,
  setRestartAlertVisible,
  form,
  onSubmit,
  showPassword,
  togglePassword,
}: UnlockWalletViewProps) => (
  <WizardLayout
    title="Unlock Wallet"
    footer={
      <button
        type="submit"
        className="flex-1 group gap-2 animate-in slide-in-from-bottom-4 fade-in delay-100 fill-mode-both"
        form="unlockWalletForm"
        data-testid="unlockWallet__unlockButton"
        disabled={!form.formState.dirtyFields.spendingPassword}
      >
        <span>Unlock</span>
      </button>
    }
  >
    <RestartWalletAlert
      open={restartAlertVisible}
      setOpen={setRestartAlertVisible}
    />
    <div className="animate-in slide-in-from-bottom-4 flex flex-col flex-1 items-center gap-12 p-4">
      <img src="/lock.png" className="w-[160px]" alt="Wallet locked" />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-full"
        id="unlockWalletForm"
      >
        <label
          htmlFor="spendingPassword"
          className={cn(
            "cursor-pointer",
            form.formState.errors.spendingPassword && "text-destructive",
          )}
        >
          Spending Password
        </label>
        <div className="flex flex-col gap-2">
          <div className="flex w-full relative">
            <input
              id="spendingPassword"
              type={showPassword ? "text" : "password"}
              data-testid="unlockWallet__password"
              className={cn(
                form.formState.errors.spendingPassword && "border-destructive",
              )}
              {...form.register("spendingPassword")}
            />
          </div>
        </div>
        <FormError>{form.formState.errors.spendingPassword?.message}</FormError>
        {form.formState.errors.spendingPassword && (
          <button
            type="button"
            onClick={() => setRestartAlertVisible(true)}
            className="self-start p-0 m-0"
          >
            Forgotten password? Restore again.
          </button>
        )}
      </form>
    </div>
  </WizardLayout>
)
