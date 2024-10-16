import { truncateString } from "@/common/lib/string"
import { useVault } from "@palladxyz/vault"
import clsx from "clsx"
import { CopyIcon, ExternalLinkIcon, UserPlusIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { toast } from "sonner"

type AddressDropdownProps = {
  publicKey: string
  className?: string
  dropdownEnd?: boolean
}

export const AddressDropdown = ({
  publicKey,
  className,
  dropdownEnd,
}: AddressDropdownProps) => {
  const currentNetworkInfo = useVault((state) => state.getCurrentNetworkInfo())
  const handleClick = () => {
    const elem = document.activeElement as HTMLLIElement
    if (elem) {
      elem?.blur()
    }
  }
  const copyAddress = async () => {
    await navigator.clipboard.writeText(publicKey)
    toast.success("Address Copied")
  }
  const openInExplorer = () => {
    const url = currentNetworkInfo.explorer.accountUrl.replace(
      "{publicKey}",
      publicKey,
    )
    window.open(url, "_blank")?.focus()
  }
  const { t } = useTranslation()

  return (
    <div className={clsx("dropdown", dropdownEnd && "dropdown-end")}>
      <div
        role="button"
        tabIndex={0}
        className={clsx(
          "tooltip cursor-pointer before:border-secondary before:border-2 before:max-w-screen before:break-all",
          className,
        )}
        data-tip={publicKey}
      >
        {truncateString({
          value: publicKey,
          endCharCount: 3,
          firstCharCount: 5,
        })}
      </div>
      <ul className="p-2 shadow menu dropdown-content border-2 border-secondary z-[1] bg-neutral rounded-box w-52">
        <li onClick={handleClick}>
          <button type="button" onClick={copyAddress} className="flex gap-2">
            <CopyIcon />
            <span>{t("copyAddress")}</span>
          </button>
        </li>
        <li onClick={handleClick}>
          <button type="button" onClick={openInExplorer} className="flex gap-2">
            <ExternalLinkIcon />
            <span>{t("openInMinascan")}</span>
          </button>
        </li>
        <li onClick={handleClick}>
          <Link
            to="/contacts/new"
            state={{ address: publicKey }}
            className="flex gap-2"
          >
            <UserPlusIcon />
            <span>{t("createContact")}</span>
          </Link>
        </li>
      </ul>
    </div>
  )
}
