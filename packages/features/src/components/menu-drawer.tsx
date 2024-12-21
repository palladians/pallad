import Logo from "@/common/assets/logo.svg?react"
import MenuIcon from "@/common/assets/menu.svg?react"
import { useVault } from "@palladco/vault"
import { ChevronDownIcon, XIcon } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

import { useTranslation } from "react-i18next"

export const MenuDrawer = () => {
  const navigate = useNavigate()
  const networkId = useVault((state) => state.currentNetworkId)
  const { t } = useTranslation()

  return (
    <div className="drawer drawer-end">
      <input id="menu-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div
          className="tooltip tooltip-secondary tooltip-bottom"
          data-tip="Menu"
        >
          <label
            htmlFor="menu-drawer"
            className="btn btn-circle min-h-10 h-10 w-10"
            data-testid="menu/open"
            data-hotkey="Meta+k"
          >
            <MenuIcon />
          </label>
        </div>
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
            <div className="flex gap-2 items-center">
              <div
                className="tooltip tooltip-bottom"
                data-tip="Network management"
              >
                <Link
                  to="/networks"
                  className="btn btn-primary min-h-10 h-10 bg-white hover:bg-white shadow-none border-none gap-2"
                >
                  <span>{networkId}</span>
                  <ChevronDownIcon size={24} />
                </Link>
              </div>
              <label
                htmlFor="menu-drawer"
                className="btn btn-circle min-h-10 h-10 w-10 btn-primary bg-white hover:bg-white shadow-none border-none"
              >
                <XIcon />
              </label>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/")}
              data-testid="menu/activity"
            >
              {t("components.dashboard")}
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/transactions")}
              data-testid="menu/activity"
            >
              {t("components.activity")}
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/staking")}
              data-testid="menu/staking"
            >
              {t("components.staking")}
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/credentials")}
              data-testid="menu/credentials"
            >
              {t("credentials.credentials")}
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/contacts")}
              data-testid="menu/addressBook"
            >
              {t("components.adressBook")}
            </button>
            <button
              type="button"
              className="text-3xl text-left"
              onClick={() => navigate("/settings")}
              data-testid="menu/settings"
            >
              {t("components.settings")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
