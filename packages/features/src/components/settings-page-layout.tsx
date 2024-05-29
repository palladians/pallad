import { useVault } from "@palladxyz/vault"
import type { ReactNode } from "react"
import { MenuBar } from "./menu-bar"

type SettingsPageHeaderProps = {
  title: string
  children: ReactNode
  onCloseClicked: () => void
  headerContent?: ReactNode
}

export const SettingsPageLayout = ({
  title,
  children,
  onCloseClicked,
  headerContent = null,
}: SettingsPageHeaderProps) => {
  const currentNetworkName = useVault((state) => state.currentNetworkName)
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col">
        <div className="bg-secondary rounded-b-2xl">
          <MenuBar
            variant="wallet"
            onCloseClicked={onCloseClicked}
            currentNetwork={currentNetworkName}
          />
          <div className={`${headerContent ? "pb-6" : "pb-12"} px-8`}>
            <p className="text-3xl">{title}</p>
            {headerContent}
          </div>
        </div>
      </div>
      <div className="py-6 px-8">{children}</div>
    </div>
  )
}
