import Logo from "@/common/assets/logo.svg?react"
import { ChevronRightIcon } from "lucide-react"
import { MenuBar } from "./menu-bar"
import { MenuDrawer } from "./menu-drawer"

export const DashboardMenuBar = () => {
  return (
    <MenuBar
      leftSlot={<Logo width={32} height={32} />}
      rightSlot={<MenuDrawer />}
    >
      <button type="button" className="btn flex gap-1">
        <span>B62qq...B7S</span>
        <ChevronRightIcon />
      </button>
    </MenuBar>
  )
}
