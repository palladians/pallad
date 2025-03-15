import { useVault } from "@palladco/vault"
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
            <div className="text-3xl">{title}</div>
            <div className="flex items-center">{headerContent}</div>
          </div>
        </div>
      </div>
      <div className="py-2 px-8">{children}</div>
    </div>
  )
}
