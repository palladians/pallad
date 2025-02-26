import { AppLayout } from "@/components/app-layout"
import { FormError } from "@/components/form-error"
import { WizardLayout } from "@/components/wizard-layout"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import type { Account } from "../types"

interface EditAccountProps {
  account: Account
  onSubmit: (account: string) => void
}

const formSchema = z.object({
  accountName: z.string().min(1).max(48),
})

export const EditAccountView = ({ account, onSubmit }: EditAccountProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      accountName: account.name,
    },
    resolver: zodResolver(formSchema),
  })

  const { t } = useTranslation()

  return (
    <AppLayout>
      <WizardLayout
        title="Edit wallet"
        backButtonPath={-1}
        footer={
          <button
            type="button"
            className="btn btn-primary max-w-48 w-full"
            disabled={!dirtyFields.accountName}
            onClick={handleSubmit((data) => onSubmit(data.accountName))}
            data-testid="formSubmit"
          >
            <span>{t("editAccount.next")}</span>
          </button>
        }
      >
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col">
            <label htmlFor="accountNameInput" className="label">
              {t("wallet-management.editAccount")}
            </label>
            <input
              id="accountNameInput"
              placeholder="Set account name"
              data-testid="editAccount/accountNameInput"
              className="input"
              autoComplete="off"
              {...register("accountName")}
            />
            {errors.accountName && (
              <FormError>{errors.accountName?.message}</FormError>
            )}
          </div>
        </div>
      </WizardLayout>
    </AppLayout>
  )
}
