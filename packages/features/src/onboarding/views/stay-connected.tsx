import HeartIcon from "@/common/assets/heart.svg?react"
import SocialDiscordIcon from "@/common/assets/social-discord.svg?react"
import SocialXIcon from "@/common/assets/social-x.svg?react"
import { WizardLayout } from "@/components/wizard-layout"
import { useTranslation } from "react-i18next"

const DISCORD_URL = "https://discord.gg/ExzzfTGUnB"
const TWITTER_URL = "https://twitter.com/pallad_"

type StayConnectedRoute = {
  onGoToDashboard: () => void
}

export const StayConnectedView = ({ onGoToDashboard }: StayConnectedRoute) => {
  const { t } = useTranslation()
  return (
    <WizardLayout
      headerShown={false}
      footer={
        <button
          type="button"
          className="btn btn-primary"
          onClick={onGoToDashboard}
          data-testid="formSubmit"
        >
          {t("onboarding.goToDashboard")}
        </button>
      }
    >
      <div className="flex flex-col justify-center items-center gap-4 flex-1">
        <HeartIcon />
        <h1 className="text-2xl text-center">{t("onboarding.allDone")}</h1>
        <div className="leading-8 text-center">{t("onboarding.followUs")}</div>
        <div className="flex w-full gap-2">
          <a
            href={TWITTER_URL}
            className="btn flex-1 gap-2"
            target="_blank"
            rel="noreferrer"
          >
            <SocialXIcon />
            Twitter
          </a>
          <a
            href={DISCORD_URL}
            className="btn flex-1 gap-2"
            target="_blank"
            rel="noreferrer"
          >
            <SocialDiscordIcon />
            Discord
          </a>
        </div>
      </div>
    </WizardLayout>
  )
}
