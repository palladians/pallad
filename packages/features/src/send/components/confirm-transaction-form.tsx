import { EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"

import { FormError } from "@/components/form-error"
import { useState } from "react"

type ConfirmTransactionFormProps = {
  confirmationForm: UseFormReturn<{ spendingPassword: string }>
  submitTransaction: SubmitHandler<any>
}

export const ConfirmTransactionForm = ({
  confirmationForm,
  submitTransaction,
}: ConfirmTransactionFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    formState: { errors },
  } = confirmationForm
  return (
    <form
      onSubmit={confirmationForm.handleSubmit(submitTransaction)}
      className="flex flex-1 flex-col items-center gap-4 w-full"
    >
      <label className="input flex items-center gap-2 w-full">
        <input
          id="spendingPassword"
          type={showPassword ? "text" : "password"}
          data-testid="onboarding__spendingPasswordInput"
          placeholder="Create your password"
          className="grow"
          {...confirmationForm.register("spendingPassword")}
        />
        <button
          type="button"
          className="btn btn-link -mr-4"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
        </button>
      </label>
      <FormError>{errors.spendingPassword?.message}</FormError>
      <div className="flex-1" />
      <button
        type="submit"
        disabled={confirmationForm.formState.isSubmitting}
        className="btn btn-primary max-w-48 w-full"
        data-testid="confirm__nextButton"
      >
        {confirmationForm.formState.isSubmitting && (
          <Loader2Icon size={16} className="animate-spin" />
        )}
        <span>Send</span>
      </button>
    </form>
  )
}
