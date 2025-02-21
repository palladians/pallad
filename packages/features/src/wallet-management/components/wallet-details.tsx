import { LogoButton } from "@/components/menu-bar"
import { EyeOff, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"
import { DetailsDropdown } from "./details-dropdown"

type WalletDetailsProps = {
  onCopyWalletAddress: () => void
  walletName: string
  publicKey: string
}

export const WalletDetails = ({
  onCopyWalletAddress,
  walletName,
  publicKey,
}: WalletDetailsProps) => {
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
    </div>
  )
}
