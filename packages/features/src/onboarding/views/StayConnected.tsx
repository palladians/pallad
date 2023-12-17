import { TwitterIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

import { WizardLayout } from '../../common/components'
import { ViewHeading } from '../../common/components/ViewHeading'

const DISCORD_URL = 'https://discord.gg/ExzzfTGUnB'
const TWITTER_URL = 'https://twitter.com/pallad_xyz'

export const StayConnectedView = () => {
  const navigate = useNavigate()
  return (
    <WizardLayout
      footer={
        <>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => navigate('/dashboard')}
            data-testid="onboarding__nextButton"
          >
            Go to Dashboard
          </Button>
        </>
      }
    >
      <div className="flex flex-col flex-1">
        <ViewHeading title="Stay Connected" />
        <div className="flex flex-col gap-4 flex-1 p-4">
          <div className="leading-8">
            That's it. Before moving to Dashboard consider joining our
            Community.
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild className="flex-1">
              <a href={DISCORD_URL} target="_blank">
                Discord
              </a>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <a href={TWITTER_URL} className="flex gap-2" target="_blank">
                <TwitterIcon size={16} />
                Twitter
              </a>
            </Button>
          </div>
        </div>
      </div>
    </WizardLayout>
  )
}
