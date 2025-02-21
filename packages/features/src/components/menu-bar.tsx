import Logo from "@/common/assets/logo.svg?react"
import { truncateString } from "@/common/lib/string"
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
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

export const LogoButton = ({
  onClick,
  color,
}: {
  onClick?: () => void
  color?: string
}) => {
  return (
    <button type="button" onClick={onClick}>
      <Logo width={32} height={32} {...(color ? { color: color } : {})} />
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
  publicAddress?: string
  networkId?: string
}

export const MenuBar = ({
  variant,
  onBackClicked,
  onCloseClicked,
  onNetworkClicked,
  networkManagement = false,
  publicAddress,
  networkId,
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
          {(publicAddress?.length ?? 0) > 0 && (
            <Link to="/receive" className="btn flex gap-1 min-h-10 h-10">
              {truncateString({
                value: publicAddress ?? "",
                firstCharCount: 5,
                endCharCount: 3,
              })}
            </Link>
          )}
        </MenuBarBase>
      )
    case "wallet":
      return (
        <MenuBarBase
          leftSlot={<LogoButton onClick={goHome} />}
          rightSlot={
            <div className="flex space-x-2">
              <div
                className="tooltip tooltip-secondary tooltip-bottom"
                data-tip="Network management"
              >
                <Link
                  to="/networks"
                  type="button"
                  className="flex flex-col btn min-h-10 h-10"
                  onClick={onNetworkClicked}
                >
                  <p className="text-sm">{networkId}</p>
                  {networkManagement ? (
                    <ChevronUpIcon width={24} height={24} />
                  ) : (
                    <ChevronDownIcon width={24} height={24} />
                  )}
                </Link>
              </div>
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
