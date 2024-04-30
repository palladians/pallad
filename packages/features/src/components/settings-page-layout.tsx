import type { ReactNode } from "react"
import { MenuBar } from "./menu-bar"

type SettingsPageHeaderProps = {
  title: string
  children: ReactNode
  onCloseClicked: () => void
}

export const SettingsPageLayout = ({
  title,
  children,
  onCloseClicked,
}: SettingsPageHeaderProps) => {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col">
        <div className="bg-secondary rounded-b-xl">
          <MenuBar variant="wallet" onCloseClicked={onCloseClicked} />
          <div className="pb-12 px-8">
            <p className="text-3xl">{title}</p>
          </div>
        </div>
      </div>
      <div className="py-6 px-8">{children}</div>
    </div>
  )
}
