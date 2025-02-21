import { useVault } from "@palladxyz/vault"
import type { ReactNode } from "react"
import { MenuBar } from "./menu-bar"

type ManagementPageHeaderProps = {
  title: string
  children: ReactNode
  onCloseClicked: () => void
  headerContent?: ReactNode
}

export const ManagementPageLayout = ({
  title,
  children,
  onCloseClicked,
  headerContent = null,
}: ManagementPageHeaderProps) => {
  const networkId = useVault((state) => state.currentNetworkId)
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col">
        <MenuBar
          variant="wallet"
          onCloseClicked={onCloseClicked}
          networkId={networkId}
        />
        <div className={`${headerContent ? "pb-6" : "pb-12"} px-8`}>
          <div className="flex justify-between">
            <p className="text-3xl">{title}</p>
            <p className="flex items-center">{headerContent}</p>
          </div>
        </div>
      </div>
      <div className="py-6 px-8">{children}</div>
    </div>
  )
}
