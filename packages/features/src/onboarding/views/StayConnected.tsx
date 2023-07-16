import { Button } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

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
            css={{
              flex: 1,
              width: 'auto'
            }}
            onClick={() => navigate('/dashboard')}
            testID="onboarding__nextButton"
          >
            Go to Dashboard
          </Button>
        </>
      }
    >
      <div className="gap-6">
        <ViewHeading title="Stay Connected" />
        <div className="leading-6">
          That's it. Before moving to Dashboard consider joining our Community.
        </div>
        <div className="gap-2">
          <Button asChild className="flex-1">
            <a href={DISCORD_URL} target="_blank">
              Discord
            </a>
          </Button>
          <Button asChild className="flex-1">
            <a href={TWITTER_URL} target="_blank">
              Twitter
            </a>
          </Button>
        </div>
      </div>
    </WizardLayout>
  )
}
