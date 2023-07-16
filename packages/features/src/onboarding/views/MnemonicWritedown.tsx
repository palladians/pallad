import { Button, Checkbox, Label } from '@palladxyz/ui'
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
        <>
          <Button
            onClick={() => navigate(-1)}
            css={{ flex: 1, width: 'auto' }}
            testID="onboarding__backButton"
          >
            Back
          </Button>
          <Button
            variant="secondary"
            css={{
              flex: 1,
              width: 'auto',
              opacity: mnemonicWritten ? 1 : 0.5,
              transition: 'opacity 0.3s'
            }}
            disabled={!mnemonicWritten}
            onClick={() => navigate('/onboarding/confirmation')}
            testID="onboarding__nextButton"
          >
            Next
          </Button>
        </>
      }
    >
      <div className="gap-6">
        <ViewHeading
          title="Write Down The Mnemonic"
          backButton={{ onClick: () => navigate(-1) }}
        />
        {noOneIsLooking ? (
          <div className="gap-4">
            <Label>Write This Down</Label>
            <div className="flex-wrap gap-2">
              {mnemonic?.map((word, i) => (
                <div
                  key={i}
                  className="bg-sky-700 text-sky-300 px-4 py-2 rounded text-sm"
                  data-testid="onboarding__mnemonicWord"
                >
                  {word}
                </div>
              ))}
            </div>
            <div className="items-center gap-4">
              <Checkbox
                value={mnemonicWritten}
                onClick={() => setMnemonicWritten(!mnemonicWritten)}
                testID="onboarding__mnemonicWrittenCheckbox"
              />
              <a onClick={toggleMnemonicWrote}>
                <div className="text-gray-100">
                  I have written down the mnemonic.
                </div>
              </a>
            </div>
          </div>
        ) : (
          <div className="gap-2">
            <FormLabel>Confirm No One Is Behind You</FormLabel>
            <Button
              onClick={() => setNoOneIsLooking(true)}
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
