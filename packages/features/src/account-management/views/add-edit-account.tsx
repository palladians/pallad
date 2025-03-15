import { AppLayout } from "@/components/app-layout"
import { FormError } from "@/components/form-error"
import { WizardLayout } from "@/components/wizard-layout"
import { zodResolver } from "@hookform/resolvers/zod"
import type { SingleCredentialState } from "@palladco/vault"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { getRandomAnimalName } from "../../../../vault/src/lib/utils"

interface AddEditAccountProps {
  title: string
  handleAddEditAccount: (credentialName: string) => Promise<void>
  account?: SingleCredentialState
  isLoading: boolean
}

const formSchema = z.object({
  accountName: z.string().min(1).max(48),
})

export const AddEditAccountView = ({
  title,
  account,
  handleAddEditAccount,
  isLoading,
}: AddEditAccountProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      accountName: "",
    },
    resolver: zodResolver(formSchema),
  })

  const { t } = useTranslation()

  useEffect(() => {
    if (account) {
      return reset({ accountName: account.credentialName })
    }
    return setValue("accountName", getRandomAnimalName())
  }, [account, reset, setValue])

  return (
    <AppLayout>
      <WizardLayout
        title={title}
        backButtonPath={-1}
        footer={
          <button
            type="button"
            className="btn btn-primary max-w-48 w-full"
            disabled={isLoading}
            onClick={handleSubmit((data) =>
              handleAddEditAccount(data.accountName),
            )}
            data-testid="formSubmit"
          >
            <span>{t(title)}</span>
          </button>
        }
      >
        <div className="flex flex-col flex-1 gap-4">
          <div className="flex flex-col">
            <label htmlFor="accountNameInput" className="label">
              {t("accountManagement.addEditAccount")}
            </label>
            <input
              id="accountNameInput"
              placeholder={t("accountManagement.setAccountName")}
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
