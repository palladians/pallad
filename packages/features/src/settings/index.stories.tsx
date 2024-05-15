import { action } from "@ladle/react"
import type { StoryDefault } from "@ladle/react"

import { AboutView } from "./views/about"
import { CurrencyView } from "./views/currency"
import { DisplayView } from "./views/display"
import { LanguageView } from "./views/language"
import { PrivacyView } from "./views/privacy"
import { SettingsView } from "./views/settings"
import { SupportView } from "./views/support"
import { TermsOfUseView } from "./views/terms-of-use"

export const Settings = () => (
  <SettingsView
    onCloseClicked={action("Go Back")}
    onDonateClicked={action("Donate Clicked")}
  />
)

export const About = () => <AboutView onCloseClicked={action("Go Back")} />

export const Support = () => <SupportView onCloseClicked={action("Go Back")} />

export const TermsOfUse = () => (
  <TermsOfUseView onCloseClicked={action("Go Back")} />
)

export const Currency = () => (
  <CurrencyView onCloseClicked={action("Go Back")} />
)

export const Display = () => <DisplayView onCloseClicked={action("Go Back")} />

export const Language = () => (
  <LanguageView onCloseClicked={action("Go Back")} />
)

export const Privacy = () => <PrivacyView onCloseClicked={action("Go Back")} />

export default {
  title: "Settings",
} satisfies StoryDefault
