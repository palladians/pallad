import { AppLayout } from "@/components/app-layout"
import { FormError } from "@/components/form-error"
import { WizardLayout } from "@/components/wizard-layout"
import { zodResolver } from "@hookform/resolvers/zod"
import type { SingleCredentialState } from "@palladxyz/vault"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { getRandomAnimalName } from "../../../../vault/src/lib/utils"

interface AddEditAccountProps {
  title: string
  handleAddEditAccount: (credentialName: string) => Promise<void>
  account?: SingleCredentialState
}

const formSchema = z.object({
  accountName: z.string().min(1).max(48),
})

export const AddEditAccountView = ({
  title,
  account,
  handleAddEditAccount,
}: AddEditAccountProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      accountName: account ? account.credentialName : getRandomAnimalName(),
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
