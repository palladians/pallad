import { truncateString } from "@/common/lib/string"
import { LogoButton } from "@/components/menu-bar"
import { EyeOff, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import QRCode from "react-qr-code"
import type { Account } from "../types"
import { DetailsDropdown } from "./details-dropdown"

type WalletDetailsProps = {
  account: Account
}

export const WalletDetails = ({ account }: WalletDetailsProps) => {
  const { t } = useTranslation()

  const dropdownOptions = [
    {
      name: t("Edit"),
      icon: <Pencil className="w-4 h-4" />,
      onClick: () => console.log("Edit clicked"),
    },
    {
      name: t("Remove"),
      icon: <EyeOff className="w-4 h-4" />,
      onClick: () => console.log("Remove clicked"),
    },
  ]

  return (
    <div className="flex flex-col text-center justify-center items-center space-y-8 card bg-accent p-3">
      <nav className="flex justify-between w-full relative">
        <div>
          <LogoButton onClick={() => {}} color={"#191725"} />
        </div>
        <DetailsDropdown options={dropdownOptions} />
      </nav>
      <div className="flex w-full justify-between">
        <div className="flex flex-col py-3 justify-end">
          <div className="text-xl text-secondary">{account.name}</div>
          <div className="text-lg text-secondary break-all">
            {truncateString({
              value: account.publicKey,
              endCharCount: 3,
              firstCharCount: 5,
            })}
          </div>
        </div>
        <QRCode
          value={account.publicKey}
          bgColor={"#25233A"}
          fgColor={"#D1B4F4"}
          className="relative w-[120px] h-[120px]"
        />
      </div>
    </div>
  )
}
