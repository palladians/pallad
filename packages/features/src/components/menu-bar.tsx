import Logo from "@/common/assets/logo.svg?react"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  XIcon,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
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

const LogoButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button type="button" onClick={onClick}>
      <Logo width={32} height={32} />
    </button>
  )
}

type MenuBarProps = {
  variant: "dashboard" | "wallet" | "card" | "back" | "back-stop" | "stop"
  onBackClicked?: () => void
  onCloseClicked?: () => void
  onAddressClicked?: () => void
  onNetworkClicked?: () => void
  networkManagement?: boolean
}

export const MenuBar = ({
  variant,
  onBackClicked,
  onCloseClicked,
  onAddressClicked,
  onNetworkClicked,
  networkManagement = false,
}: MenuBarProps) => {
  const navigate = useNavigate()
  const goHome = () => navigate("/dashboard")
  switch (variant) {
    case "dashboard":
      return (
        <MenuBarBase
          leftSlot={<LogoButton onClick={goHome} />}
          rightSlot={<MenuDrawer />}
        >
          <button
            type="button"
            className="btn flex gap-1 min-h-10 h-10"
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
          leftSlot={<LogoButton onClick={goHome} />}
          rightSlot={
            <div className="flex space-x-2">
              <button
                type="button"
                className="flex flex-col btn min-h-10 h-10"
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
                className="btn btn-circle min-h-10 h-10 w-10"
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
          leftSlot={<LogoButton onClick={goHome} />}
          rightSlot={
            <div className="flex space-x-2">
              <button
                type="button"
                className="btn btn-circle min-h-10 h-10 w-10"
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
              className="btn btn-circle min-h-10 h-10 w-10"
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
              className="btn btn-circle min-h-10 h-10 w-10"
              onClick={onBackClicked}
            >
              <ArrowLeftIcon width={24} height={24} />
            </button>
          }
          rightSlot={
            <button
              type="button"
              className="btn btn-circle min-h-10 h-10 w-10"
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
              className="btn btn-circle min-h-10 h-10 w-10"
              onClick={onCloseClicked}
            >
              <XIcon width={24} height={24} />
            </button>
          }
        />
      )
  }
}
