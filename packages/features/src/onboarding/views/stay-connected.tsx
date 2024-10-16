import { useTranslation } from "react-i18next"

import HeartIcon from "@/common/assets/heart.svg?react"
import SocialDiscordIcon from "@/common/assets/social-discord.svg?react"
import SocialXIcon from "@/common/assets/social-x.svg?react"

import { WizardLayout } from "@/components/wizard-layout"

const DISCORD_URL = "https://discord.gg/ExzzfTGUnB"
const TWITTER_URL = "https://twitter.com/pallad_"

type StayConnectedRoute = {
  onGoToDashboard: () => void
}

export const StayConnectedView = ({ onGoToDashboard }: StayConnectedRoute) => (
  <WizardLayout
    headerShown={false}
    footer={
      <button
        type="button"
        className="btn btn-primary"
        onClick={onGoToDashboard}
        data-testid="formSubmit"
      >
        {useTranslation().t("goToDashboard")}
      </button>
    }
  >
    <div className="flex flex-col justify-center items-center gap-4 flex-1">
      <HeartIcon />
      <h1 className="text-2xl text-center">{useTranslation().t("allDone")}</h1>
      <div className="leading-8 text-center">
        {useTranslation().t("followUs")}
      </div>
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
