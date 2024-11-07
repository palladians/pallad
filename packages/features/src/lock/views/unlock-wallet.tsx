import type { UseFormReturn } from "react-hook-form"

import { FormError } from "@/components/form-error"
import { WizardLayout } from "@/components/wizard-layout"
import clsx from "clsx"
import { EyeIcon, EyeOffIcon } from "lucide-react"

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
        data-testid="submitForm"
        disabled={!form.formState.dirtyFields.spendingPassword}
      >
        <span>Unlock</span>
      </button>
    }
  >
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
        <label className="input flex items-center gap-2 w-full">
          <input
            id="spendingPassword"
            type={showPassword ? "text" : "password"}
            data-testid="unlockWallet/password"
            placeholder="Enter your password"
            className="grow"
            {...form.register("spendingPassword")}
          />
          <button
            type="button"
            className="btn btn-link -mr-4"
            onClick={togglePassword}
          >
            {showPassword ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
          </button>
        </label>
        <FormError>{form.formState.errors.spendingPassword?.message}</FormError>
      </form>
    </div>
  </WizardLayout>
)
