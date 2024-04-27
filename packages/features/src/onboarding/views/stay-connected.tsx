import { Link2Icon, TwitterIcon } from "lucide-react"

import { WizardLayout } from "@/components/wizard-layout"

const DISCORD_URL = "https://discord.gg/ExzzfTGUnB"
const TWITTER_URL = "https://twitter.com/pallad_"

type StayConnectedRoute = {
  onGoToDashboard: () => void
}

export const StayConnectedView = ({ onGoToDashboard }: StayConnectedRoute) => (
  <WizardLayout
    title="Stay Connected"
    footer={
      <>
        <button
          type="button"
          className="flex-1"
          onClick={onGoToDashboard}
          data-testid="onboarding__nextButton"
        >
          Go to Dashboard
        </button>
      </>
    }
  >
    <div className="flex flex-col gap-4 flex-1 p-4">
      <div className="leading-8">
        That's it. Before moving to Dashboard consider joining our Community.
      </div>
      <div className="flex gap-2">
        <a
          href={DISCORD_URL}
          className="flex gap-2"
          target="_blank"
          rel="noreferrer"
        >
          <Link2Icon size={16} />
          Discord
        </a>
        <a
          href={TWITTER_URL}
          className="flex gap-2"
          target="_blank"
          rel="noreferrer"
        >
          <TwitterIcon size={16} />
          Twitter
        </a>
      </div>
    </div>
  </WizardLayout>
)
