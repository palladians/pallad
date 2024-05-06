import { Loader2Icon } from "lucide-react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"

import { FormError } from "@/components/form-error"

import clsx from "clsx"

type ConfirmTransactionFormProps = {
  confirmationForm: UseFormReturn<{ spendingPassword: string }>
  submitTransaction: SubmitHandler<any>
}

export const ConfirmTransactionForm = ({
  confirmationForm,
  submitTransaction,
}: ConfirmTransactionFormProps) => {
  console.log(">>>CF", confirmationForm)
  const {
    formState: { errors },
  } = confirmationForm
  return (
    <form
      onSubmit={confirmationForm.handleSubmit(submitTransaction)}
      className="flex flex-1 flex-col gap-4"
    >
      <fieldset className="flex flex-1 flex-col gap-2">
        <label
          htmlFor="spendingPassword"
          className={clsx(errors.spendingPassword && "text-destructive")}
        >
          Spending Password
        </label>
        <input
          id="spendingPassword"
          type="password"
          placeholder="Spending Password"
          className={errors.spendingPassword && "border-destructive"}
          data-testid="confirm__spendingPassword"
          {...confirmationForm.register("spendingPassword")}
        />
        <FormError>{errors.spendingPassword?.message}</FormError>
        <div className="flex-1" />
      </fieldset>
      <button
        type="submit"
        disabled={confirmationForm.formState.isSubmitting}
        className="group gap-2"
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
