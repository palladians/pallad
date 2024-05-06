import Logo from "@/common/assets/logo.svg?react"
import MenuIcon from "@/common/assets/menu.svg?react"
import { XIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const MenuDrawer = () => {
  const navigate = useNavigate()
  return (
    <div className="drawer drawer-end">
      <input id="menu-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="menu-drawer"
          className="btn btn-circle min-h-10 h-10 w-10"
        >
          <MenuIcon />
        </label>
      </div>
      <div className="drawer-side z-10">
        <label
          htmlFor="menu-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="flex flex-col items-start justify-between px-8 py-7 w-full min-h-full bg-secret-sauce text-base-content">
          <div className="w-full flex justify-between items-center">
            <button type="button" onClick={() => navigate("/dashboard")}>
              <Logo width={32} height={32} />
            </button>
            <label
              htmlFor="menu-drawer"
              className="btn btn-circle min-h-10 h-10 w-10 btn-primary bg-white hover:bg-white shadow-none border-none"
            >
              <XIcon />
            </label>
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/transactions")}
            >
              Activity
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/staking")}
            >
              Staking
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/contacts")}
            >
              Address Book
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/settings")}
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
