import { ArrowLeft, ChevronDown, XIcon } from "lucide-react"
import type { ReactNode } from "react"

type BackButtonProps = {
  onClick?: () => void
}

type SettingsPageHeaderProps = {
  title: string
  children: ReactNode
  backButton: BackButtonProps
}

export const SettingsPageHeader = ({
  title,
  children,
  backButton,
}: SettingsPageHeaderProps) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col">
        <div className="pt-6 px-8 bg-secondary rounded-b-xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="btn btn-circle"
              onClick={backButton.onClick}
            >
              <ArrowLeft width={24} height={24} />
            </button>
            <div className="flex space-x-2">
              <button type="button" className="flex flex-col btn">
                <p className="text-sm">Mina</p>
                <ChevronDown width={24} height={24} />
              </button>
              <button type="button" className="btn btn-circle">
                <XIcon width={24} height={24} />
              </button>
            </div>
          </div>
          <div className="pt-8 pb-12">
            <p className="text-3xl">{title}</p>
          </div>
        </div>
      </div>
      <div className="py-6 px-8">{children}</div>
    </div>
  )
}
