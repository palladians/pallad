import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { ButtonArrow } from '@/components/button-arrow'
import { FormError } from '@/components/form-error'
import { RestartWalletAlert } from '@/components/restart-wallet-alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

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
  togglePassword
}: UnlockWalletViewProps) => (
  <WizardLayout
    title="Unlock Wallet"
    footer={
      <Button
        type="submit"
        className="flex-1 group gap-2 animate-in slide-in-from-bottom-4 fade-in delay-100 fill-mode-both"
        form="unlockWalletForm"
        data-testid="unlockWallet__unlockButton"
        disabled={!form.formState.dirtyFields.spendingPassword}
      >
        <span>Unlock</span>
        <ButtonArrow />
      </Button>
    }
  >
    <RestartWalletAlert
      open={restartAlertVisible}
      setOpen={setRestartAlertVisible}
    />
    <div className="animate-in slide-in-from-bottom-4 flex flex-col flex-1 items-center gap-12 p-4">
      <img src="/lock.png" className="w-[160px]" />
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 w-full"
        id="unlockWalletForm"
      >
        <Label
          htmlFor="spendingPassword"
          className={cn(
            'cursor-pointer',
            form.formState.errors.spendingPassword && 'text-destructive'
          )}
        >
          Spending Password
        </Label>
        <div className="flex flex-col gap-2">
          <div className="flex w-full relative">
            <Input
              id="spendingPassword"
              type={showPassword ? 'text' : 'password'}
              data-testid="unlockWallet__password"
              className={cn(
                form.formState.errors.spendingPassword && 'border-destructive'
              )}
              autoFocus
              {...form.register('spendingPassword')}
            />
            <Tooltip>
              <TooltipTrigger>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  data-testid="unlockWallet__togglePasswordVisible"
                  className="absolute right-1 top-1 rounded-full w-8 h-8 p-1"
                  onClick={togglePassword}
                >
                  {showPassword ? (
                    <EyeOffIcon size={20} />
                  ) : (
                    <EyeIcon size={20} />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{showPassword ? 'Hide password' : 'Show password'}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <FormError>{form.formState.errors.spendingPassword?.message}</FormError>
        {form.formState.errors.spendingPassword && (
          <Button
            variant="link"
            onClick={() => setRestartAlertVisible(true)}
            className="self-start p-0 m-0"
          >
            Forgotten password? Restore again.
          </Button>
        )}
      </form>
    </div>
  </WizardLayout>
)
