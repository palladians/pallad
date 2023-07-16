import { Badge, Button, Checkbox, cn, Label } from '@palladxyz/ui'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { WizardLayout } from '../../common/components'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useOnboardingStore } from '../../wallet/store/onboarding'

export const MnemonicWritedownView = () => {
  const navigate = useNavigate()
  const mnemonic = useOnboardingStore((state) => state.mnemonic?.split(' '))
  const [noOneIsLooking, setNoOneIsLooking] = useState(false)
  const [mnemonicWritten, setMnemonicWritten] = useState(false)
  const toggleMnemonicWrote = () => setMnemonicWritten(!mnemonicWritten)
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
          <div className="flex flex-col gap-4">
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
                checked={mnemonicWritten}
                onClick={() => setMnemonicWritten(!mnemonicWritten)}
                data-testid="onboarding__mnemonicWrittenCheckbox"
              />
              <Label>I have written down the mnemonic.</Label>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-2">
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
