import { truncateString } from "@/common/lib/string"
import { LogoButton } from "@/components/menu-bar"
import type { SingleCredentialState } from "@palladxyz/vault"
import { EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import QRCode from "react-qr-code"
import { toast } from "sonner"
import { DetailsDropdown } from "./details-dropdown"

type AccountDetailsProps = {
  account: SingleCredentialState
  // accounts: Account[];
}

// export const AccountDetails = ({ account, accounts }: AccountDetailsProps) => {
export const AccountDetails = ({ account }: AccountDetailsProps) => {
  const { t } = useTranslation()

  const dropdownOptions = [
    {
      name: t("Remove"),
      icon: <EyeOff className="w-4 h-4" />,
      onClick: (pubKey: string) => {
        console.log("pubKey", pubKey)
        if (account?.credential?.address) toast.success("Account removed")
      },
    },
  ]

  return (
    <div className="flex flex-col text-center justify-center items-center space-y-8 card bg-accent p-3">
      <nav className="flex justify-between w-full relative">
        <div>
          <LogoButton onClick={() => {}} color={"#191725"} />
        </div>
        <DetailsDropdown options={dropdownOptions} account={account} />
      </nav>
      <div className="flex w-full justify-between">
        <div className="flex flex-col py-3 justify-end">
          <div className="text-xl text-secondary">
            {account?.credentialName}
          </div>
          <div className="text-lg text-secondary break-all">
            {account?.credential?.address &&
              truncateString({
                value: account?.credential?.address,
                endCharCount: 3,
                firstCharCount: 5,
              })}
          </div>
        </div>
        {account?.credential?.address && (
          <QRCode
            value={account?.credential?.address}
            bgColor={"#25233A"}
            fgColor={"#D1B4F4"}
            className="relative w-[120px] h-[120px]"
          />
        )}
      </div>
    </div>
  )
}
