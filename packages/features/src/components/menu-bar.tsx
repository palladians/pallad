import Logo from "@/common/assets/logo.svg?react"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  XIcon,
} from "lucide-react"
import { MenuDrawer } from "./menu-drawer"

type MenuBarBaseProps = {
  leftSlot?: React.ReactNode
  children?: React.ReactNode
  rightSlot?: React.ReactNode
}

export const MenuBarBase = ({
  leftSlot,
  children,
  rightSlot,
}: MenuBarBaseProps) => {
  return (
    <nav className="flex justify-between items-center px-8 py-7">
      <div>{leftSlot}</div>
      <div>{children}</div>
      <div>{rightSlot}</div>
    </nav>
  )
}

type MenuBarProps = {
  variant: "dashboard" | "wallet" | "card" | "back" | "back-stop" | "stop"
  onBackClicked?: () => void
  onCloseClicked?: () => void
  onAddressClicked?: () => void
  onNetworkClicked?: () => void
  onLogoClicked?: () => void
  networkManagement?: boolean
}

export const MenuBar = ({
  variant,
  onBackClicked,
  onCloseClicked,
  onAddressClicked,
  onNetworkClicked,
  onLogoClicked,
  networkManagement = false,
}: MenuBarProps) => {
  switch (variant) {
    case "dashboard":
      return (
        <MenuBarBase
          leftSlot={
            <button type="button" onClick={onLogoClicked}>
              <Logo width={32} height={32} />
            </button>
          }
          rightSlot={<MenuDrawer />}
        >
          <button
            type="button"
            className="btn flex gap-1"
            onClick={onAddressClicked}
          >
            <span>B62qq...B7S</span>
            <ChevronRightIcon />
          </button>
        </MenuBarBase>
      )
    case "wallet":
      return (
        <MenuBarBase
          leftSlot={
            <button type="button" onClick={onLogoClicked}>
              <Logo width={32} height={32} />
            </button>
          }
          rightSlot={
            <div className="flex space-x-2">
              <button
                type="button"
                className="flex flex-col btn"
                onClick={onNetworkClicked}
              >
                <p className="text-sm">Mina</p>
                {networkManagement ? (
                  <ChevronUpIcon width={24} height={24} />
                ) : (
                  <ChevronDownIcon width={24} height={24} />
                )}
              </button>
              <button
                type="button"
                className="btn btn-circle"
                onClick={onCloseClicked}
              >
                <XIcon width={24} height={24} />
              </button>
            </div>
          }
        />
      )
    case "card":
      return (
        <MenuBarBase
          leftSlot={
            <button type="button" onClick={onLogoClicked}>
              <Logo width={32} height={32} />
            </button>
          }
          rightSlot={
            <div className="flex space-x-2">
              <button
                type="button"
                className="btn btn-circle"
                onClick={onCloseClicked}
              >
                <XIcon width={24} height={24} />
              </button>
            </div>
          }
        />
      )
    case "back":
      return (
        <MenuBarBase
          leftSlot={
            <button
              type="button"
              className="btn btn-circle"
              onClick={onBackClicked}
            >
              <ArrowLeftIcon width={24} height={24} />
            </button>
          }
        />
      )
    case "back-stop":
      return (
        <MenuBarBase
          leftSlot={
            <button
              type="button"
              className="btn btn-circle"
              onClick={onBackClicked}
            >
              <ArrowLeftIcon width={24} height={24} />
            </button>
          }
          rightSlot={
            <button
              type="button"
              className="btn btn-circle"
              onClick={onCloseClicked}
            >
              <XIcon width={24} height={24} />
            </button>
          }
        />
      )
    case "stop":
      return (
        <MenuBarBase
          rightSlot={
            <button
              type="button"
              className="btn btn-circle"
              onClick={onCloseClicked}
            >
              <XIcon width={24} height={24} />
            </button>
          }
        />
      )
  }
}
