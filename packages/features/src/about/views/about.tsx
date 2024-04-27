import Logo from "@/common/assets/logo.svg"
import { AppLayout } from "@/components/app-layout"
import { MetaField } from "@/components/meta-field"
import { ViewHeading } from "@/components/view-heading"

import packageJson from "../../../package.json"

const AppMeta = [
  {
    label: "Current Version",
    value: packageJson.version,
  },
  {
    label: "Commit Hash",
    value: "9iufgds239803nf",
  },
]

type AboutViewProps = {
  onGoBack: () => void
}

export const AboutView = ({ onGoBack }: AboutViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading title="About" backButton={{ onClick: onGoBack }} />
        <div className="flex flex-col gap-4 flex-1 p-4">
          <div className="flex gap-4 p-4 justify-between rounded-[1rem]">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="font-semibold">Pallad</div>
            </div>
            <button type="button" disabled>
              Up to date
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4 rounded-[1rem]">
            {AppMeta.map(({ label, value }) => (
              <MetaField key={label} label={label} value={value} />
            ))}
          </div>
          <div className="flex flex-col items-start rounded-[1rem]">
            <a
              href="https://pallad.xyz"
              target="_blank"
              rel="noreferrer noopener"
            >
              pallad.xyz
            </a>
            <a
              href="https://palladians.xyz/terms"
              target="_blank"
              rel="noreferrer noopener"
            >
              Terms of Service
            </a>
            <a
              href="https://palladians.xyz/privacy"
              target="_blank"
              rel="noreferrer noopener"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
