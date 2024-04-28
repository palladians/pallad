import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { passwordSchema } from "@/common/lib/validation"
import { FormError } from "@/components/form-error"
import { WizardLayout } from "@/components/wizard-layout"

import type { WalletInfoData } from "../types"

interface WalletInfoFormProps {
  title: string
  onSubmit: (data: WalletInfoData) => void
}

const formSchema = z.object({
  walletName: z.string().min(1).max(48),
  spendingPassword: passwordSchema,
})

export const WalletInfoForm = ({ title, onSubmit }: WalletInfoFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleAccepted = () => setTermsAccepted(!termsAccepted)
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues: {
      walletName: "",
      spendingPassword: "",
    },
    resolver: zodResolver(formSchema),
  })
  return (
    <WizardLayout
      title={title}
      backButtonPath={-1}
      footer={
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox rounded-md"
              checked={termsAccepted}
              onClick={toggleAccepted}
              data-testid="onboarding__tosCheckbox"
              id="tosCheckbox"
            />
            <label htmlFor="tosCheckbox" className="label">
              I accept Terms of Service.
            </label>
            <a
              href="https://palladians.xyz/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon size={24} />
            </a>
          </div>
          <button
            type="button"
            className="btn btn-primary max-w-48 w-full"
            disabled={
              !termsAccepted ||
              !dirtyFields.walletName ||
              !dirtyFields.spendingPassword
            }
            onClick={handleSubmit(onSubmit)}
            data-testid="onboarding__nextButton"
          >
            <span>Next</span>
          </button>
        </div>
      }
    >
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col">
          <label htmlFor="walletNameInput" className="label">
            Wallet name
          </label>
          <input
            id="walletNameInput"
            placeholder="Set wallet name"
            data-testid="onboarding__walletNameInput"
            className="input"
            {...register("walletName")}
          />
          {errors.walletName && (
            <FormError>{errors.walletName?.message}</FormError>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="spendingPassword" className="label">
            Password
          </label>
          <label className="input flex items-center gap-2">
            <input
              id="spendingPassword"
              type={showPassword ? "text" : "password"}
              data-testid="onboarding__spendingPasswordInput"
              placeholder="Create your password"
              className="grow"
              {...register("spendingPassword")}
            />
            <button
              type="button"
              className="btn btn-link -mr-4"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
            </button>
          </label>
          {errors.spendingPassword && (
            <FormError>{errors.spendingPassword?.message}</FormError>
          )}
        </div>
      </div>
    </WizardLayout>
  )
}
