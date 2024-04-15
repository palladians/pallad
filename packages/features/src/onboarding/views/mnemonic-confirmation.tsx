import { Loader2Icon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { ButtonArrow } from '@/components/button-arrow'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

import { MnemonicConfirmationData } from '../types'

type MnemonicConfirmationViewProps = {
  onSubmit: () => unknown
  form: UseFormReturn<MnemonicConfirmationData, any, undefined>
  restoring: boolean
  confirmationIndex: number
  confirmationValid: boolean
}

export const MnemonicConfirmationView = ({
  onSubmit,
  form,
  restoring,
  confirmationIndex,
  confirmationValid
}: MnemonicConfirmationViewProps) => (
  <WizardLayout
    title="Confirm The Mnemonic"
    backButtonPath={-1}
    footer={
      <Button
        type="submit"
        form="mnemonicConfirmationForm"
        className={cn([
          'flex-1 opacity-50 transition-opacity gap-2 group',
          confirmationValid && 'opacity-100'
        ])}
        disabled={!confirmationValid || restoring}
        data-testid="onboarding__nextButton"
      >
        {restoring && <Loader2Icon size={16} className="animate-spin" />}
        <span>Next</span>
        <ButtonArrow />
      </Button>
    }
  >
    <form
      className="flex flex-col flex-1 gap-4 p-4"
      id="mnemonicConfirmationForm"
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
    >
      <Label data-testid="onboarding__writedownIndex">
        Type in the word #{confirmationIndex + 1}
      </Label>
      <Input
        data-testid="onboarding__mnemonicConfirmationInput"
        {...form.register('mnemonicWord')}
        autoFocus
      />
    </form>
  </WizardLayout>
)
