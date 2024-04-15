import { SecurityCheck } from '@/components/security-check'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

type MnemonicWritedownViewProps = {
  onConfirm: () => void
  onSafetyConfirmed: (value: boolean) => void
  safetyConfirmed: boolean
  mnemonicWords: string[]
  mnemonicWritten: boolean
  setMnemonicWritten: (value: boolean) => void
}

export const MnemonicWritedownView = ({
  onConfirm,
  onSafetyConfirmed,
  safetyConfirmed,
  mnemonicWords,
  mnemonicWritten,
  setMnemonicWritten
}: MnemonicWritedownViewProps) => (
  <WizardLayout
    title="Mnemonic Backup"
    backButtonPath={-1}
    footer={
      <Button
        className={cn([
          'flex-1 transition-opacity opacity-50',
          mnemonicWritten && 'opacity-100'
        ])}
        disabled={!mnemonicWritten}
        onClick={onConfirm}
        data-testid="onboarding__nextButton"
      >
        Next
      </Button>
    }
  >
    <div className="flex flex-col flex-1 gap-8">
      {safetyConfirmed ? (
        <div className="animate-in fade-in slide-in-from-bottom-1 flex flex-col gap-4 p-4">
          <Label>Back up the mnemonic</Label>
          <div className="grid grid-cols-3 gap-2">
            {mnemonicWords.map((word, i) => (
              <Badge
                key={i}
                variant="outline"
                data-testid="onboarding__mnemonicWord"
                className="py-2 px-4"
              >
                {word}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Checkbox
              id="mnemonicWrittenCheckbox"
              checked={mnemonicWritten}
              onClick={() => setMnemonicWritten(!mnemonicWritten)}
              data-testid="onboarding__mnemonicWrittenCheckbox"
            />
            <Label htmlFor="mnemonicWrittenCheckbox" className="leading-5">
              I have backed up the mnemonic and acknowledge that it will not be
              shown to me again.
            </Label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 gap-2 p-4">
          <SecurityCheck onConfirm={() => onSafetyConfirmed(true)} />
        </div>
      )}
    </div>
  </WizardLayout>
)
