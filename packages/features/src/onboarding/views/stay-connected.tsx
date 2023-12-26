import { Link2Icon, TwitterIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { WizardLayout } from '@/components/wizard-layout'

const DISCORD_URL = 'https://discord.gg/ExzzfTGUnB'
const TWITTER_URL = 'https://twitter.com/pallad_xyz'

export const StayConnectedView = () => {
  const navigate = useNavigate()
  return (
    <WizardLayout
      title="Stay Connected"
      footer={
        <>
          <Button
            className="flex-1"
            onClick={() => navigate('/dashboard')}
            data-testid="onboarding__nextButton"
          >
            Go to Dashboard
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4 flex-1 p-4">
        <div className="leading-8">
          That's it. Before moving to Dashboard consider joining our Community.
        </div>
        <div className="flex gap-2">
          <Button size="lg" variant="outline" asChild className="flex-1">
            <a href={DISCORD_URL} className="flex gap-2" target="_blank">
              <Link2Icon size={16} />
              Discord
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild className="flex-1">
            <a href={TWITTER_URL} className="flex gap-2" target="_blank">
              <TwitterIcon size={16} />
              Twitter
            </a>
          </Button>
        </div>
      </div>
    </WizardLayout>
  )
}
