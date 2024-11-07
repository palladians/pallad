import { ArrowRightIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AddressDropdown } from "./address-dropdown"
type FromToProps = {
  tx: {
    from: string
    to: string
  }
}

export const FromTo = ({ tx }: FromToProps) => {
  const { t } = useTranslation()
  return (
    <div className="card bg-secondary py-3 px-4 flex flex-row justify-between mt-1">
      <div className="flex flex-col">
        <div className="text-[#7D7A9C]">{t("components.from")}</div>
        <AddressDropdown publicKey={tx.from} className="before:ml-20" />
      </div>
      <div className="btn btn-circle btn-neutral text-mint">
        <ArrowRightIcon size={24} />
      </div>
      <div className="flex flex-col">
        <div className="text-[#7D7A9C]">{t("components.to")}</div>
        <AddressDropdown
          publicKey={tx.to}
          className="before:-ml-20"
          dropdownEnd
        />
      </div>
    </div>
  )
}
