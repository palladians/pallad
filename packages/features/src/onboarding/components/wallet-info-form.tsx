import { zodResolver } from "@hookform/resolvers/zod"
import { EyeIcon, EyeOffIcon, LinkIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { passwordSchema } from "@/common/lib/validation"
import { ButtonArrow } from "@/components/button-arrow"
import { FormError } from "@/components/form-error"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WizardLayout } from "@/components/wizard-layout"
import { cn } from "@/lib/utils"

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
        <Button
          className={cn([
            "flex-1 transition-opacity opacity-50 gap-2 group",
            termsAccepted && "opacity-100",
          ])}
          disabled={
            !termsAccepted ||
            !dirtyFields.walletName ||
            !dirtyFields.spendingPassword
          }
          onClick={handleSubmit(onSubmit)}
          data-testid="onboarding__nextButton"
        >
          <span>Next</span>
          <ButtonArrow />
        </Button>
      }
    >
      <div className="flex flex-col flex-1 gap-4 p-4">
        <div className="gap-2">
          <Label
            htmlFor="walletNameInput"
            className={cn(
              "cursor-pointer",
              errors.walletName && "text-destructive",
            )}
          >
            Wallet Name
          </Label>
          <Input
            id="walletNameInput"
            placeholder="Wallet Name"
            data-testid="onboarding__walletNameInput"
            className={cn(errors.walletName && "border-destructive")}
            {...register("walletName")}
          />
          {errors.walletName && (
            <FormError>{errors.walletName?.message}</FormError>
          )}
        </div>
        <div className="gap-2">
          <Label
            htmlFor="spendingPassword"
            className={cn(
              "cursor-pointer",
              errors.spendingPassword && "text-destructive",
            )}
          >
            Spending Password
          </Label>
          <div className="flex gap-2 relative">
            <Input
              id="spendingPassword"
              type={showPassword ? "text" : "password"}
              data-testid="onboarding__spendingPasswordInput"
              placeholder="Password"
              className={cn(errors.spendingPassword && "border-destructive")}
              {...register("spendingPassword")}
            />
            <Button
              variant="secondary"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1 rounded-full w-8 h-8 p-1"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </Button>
          </div>
          {errors.spendingPassword && (
            <FormError>{errors.spendingPassword?.message}</FormError>
          )}
        </div>
        <div className="flex items-center">
          <Checkbox
            checked={termsAccepted}
            onClick={toggleAccepted}
            data-testid="onboarding__tosCheckbox"
            id="tosCheckbox"
          />
          <Label htmlFor="tosCheckbox" className="ml-4 cursor-pointer">
            I accept Terms of Service.
          </Label>
          <Button variant="link" size="icon" className="pl-0" asChild>
            <a
              href="https://palladians.xyz/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              <LinkIcon size={16} />
            </a>
          </Button>
        </div>
      </div>
    </WizardLayout>
  )
}
