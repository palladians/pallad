import type { UseFormReturn } from "react-hook-form"

import { FormError } from "@/components/form-error"
import { RestartWalletAlert } from "@/components/restart-wallet-alert"
import { WizardLayout } from "@/components/wizard-layout"
import clsx from "clsx"

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
    headerShown={false}
    footer={
      <button
        type="submit"
        className="btn btn-primary max-w-48 w-full"
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
    <div className="w-full flex flex-col flex-1 items-center gap-12">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-1 flex-col gap-2 w-full"
        id="unlockWalletForm"
      >
        <label
          htmlFor="spendingPassword"
          className={clsx("label cursor-pointer")}
        >
          Spending Password
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-1 w-full relative">
            <input
              id="spendingPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              data-testid="unlockWallet__password"
              className="input flex-1"
              {...form.register("spendingPassword")}
            />
          </div>
        </div>
        <FormError>{form.formState.errors.spendingPassword?.message}</FormError>
        <button
          type="button"
          onClick={() => setRestartAlertVisible(true)}
          className="btn btn-link text-mint self-start pl-0"
        >
          Forgotten password? Restore again.
        </button>
      </form>
    </div>
  </WizardLayout>
)
