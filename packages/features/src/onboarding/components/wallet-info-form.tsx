import { useTranslation } from "react-i18next"

import { zodResolver } from "@hookform/resolvers/zod"
import { zxcvbn } from "@zxcvbn-ts/core"
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

const getPasswordStrengthConfig = (score: number) => {
  switch (score) {
    case 0:
    case 1:
      return ["Not the best", "#EB6F92"]
    case 2:
      return ["Weak", "#F2BEBC"]
    case 3:
      return ["OK and could be better", "#F2BEBC"]
    case 4:
      return ["Safe", "#A3DBE4"]
    default:
      return ["", ""]
  }
}

export const WalletInfoForm = ({ title, onSubmit }: WalletInfoFormProps) => {
  const [showPassword, setShowPassword] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const toggleAccepted = () => setTermsAccepted(!termsAccepted)
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
    watch,
  } = useForm({
    defaultValues: {
      walletName: "",
      spendingPassword: "",
    },
    resolver: zodResolver(formSchema),
  })
  const [strengthLabel, strengthColor] = getPasswordStrengthConfig(
    zxcvbn(watch("spendingPassword")).score,
  )
  const { t } = useTranslation()

  return (
    <WizardLayout
      title={title}
      backButtonPath={-1}
      footer={
        <>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox rounded-md"
              checked={termsAccepted}
              onClick={toggleAccepted}
              data-testid="onboarding/tosCheckbox"
              id="tosCheckbox"
            />
            <label htmlFor="tosCheckbox" className="label">
              {t("term-of-services")}
            </label>
            <a
              href="https://get.pallad.co/terms"
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
            data-testid="formSubmit"
          >
            <span>{t("next")}</span>
          </button>
        </>
      }
    >
      <div className="flex flex-col flex-1 gap-4">
        <div className="flex flex-col">
          <label htmlFor="walletNameInput" className="label">
            {t("wallet-name")}
          </label>
          <input
            id="walletNameInput"
            placeholder="Set wallet name"
            data-testid="onboarding/walletNameInput"
            className="input"
            autoComplete="off"
            {...register("walletName")}
          />
          {errors.walletName && (
            <FormError>{errors.walletName?.message}</FormError>
          )}
        </div>
        <div className="flex flex-col">
          <label htmlFor="spendingPassword" className="label">
            {t("password")}
          </label>
          <label className="input flex items-center gap-2">
            <input
              id="spendingPassword"
              type={showPassword ? "text" : "password"}
              data-testid="onboarding/spendingPasswordInput"
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
          <label className="text-[#7D7A9C] text-sm my-2 h-px">
            {dirtyFields.spendingPassword && (
              <span>
                {t("your-password")}
                <span style={{ color: strengthColor }} className="px-2">
                  {strengthLabel}
                </span>
              </span>
            )}
          </label>
          {errors.spendingPassword && (
            <FormError>{errors.spendingPassword?.message}</FormError>
          )}
        </div>
      </div>
    </WizardLayout>
  )
}
