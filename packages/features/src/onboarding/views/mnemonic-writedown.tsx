import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useOnboardingStore } from '@/common/store/onboarding'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ViewHeading } from '@/components/view-heading'
import { WizardLayout } from '@/components/wizard-layout'
import { cn } from '@/lib/utils'

export const MnemonicWritedownView = () => {
  const navigate = useNavigate()
  const mnemonic = useOnboardingStore((state) => state.mnemonic?.split(' '))
  const [noOneIsLooking, setNoOneIsLooking] = useState(false)
  const [mnemonicWritten, setMnemonicWritten] = useState(false)
  return (
    <WizardLayout
      footer={
        <Button
          variant="secondary"
          className={cn([
            'flex-1 transition-opacity opacity-50',
            mnemonicWritten && 'opacity-100'
          ])}
          disabled={!mnemonicWritten}
          onClick={() => navigate('/onboarding/confirmation')}
          data-testid="onboarding__nextButton"
        >
          Next
        </Button>
      }
    >
      <div className="flex flex-col flex-1 gap-8">
        <ViewHeading
          title="Write Down The Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        {noOneIsLooking ? (
          <div className="flex flex-col gap-4 p-4">
            <Label>Write This Down</Label>
            <div className="flex flex-wrap gap-2">
              {mnemonic?.map((word, i) => (
                <Badge key={i} data-testid="onboarding__mnemonicWord">
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
              <Label htmlFor="mnemonicWrittenCheckbox">
                I have written down the mnemonic.
              </Label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-2 p-4">
            <Label>Confirm No One Is Behind You</Label>
            <Button
              onClick={() => setNoOneIsLooking(true)}
              className="flex-1"
              data-testid="onboarding__confirmAlone"
            >
              I am alone
            </Button>
          </div>
        )}
      </div>
    </WizardLayout>
  )
}
