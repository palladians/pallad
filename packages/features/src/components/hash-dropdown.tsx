import { useVault } from "@palladco/vault"
import clsx from "clsx"
import { CopyIcon, ExternalLinkIcon } from "lucide-react"
import { toast } from "sonner"

import { useTranslation } from "react-i18next"

type HashDropdownProps = {
  hash: string
  className?: string
}

export const HashDropdown = ({ hash, className }: HashDropdownProps) => {
  const currentNetworkInfo = useVault((state) => state.getCurrentNetworkInfo())
  const handleClick = () => {
    const elem = document.activeElement as HTMLLIElement
    if (elem) {
      elem?.blur()
    }
  }
  const copyHash = async () => {
    await navigator.clipboard.writeText(hash)
    toast.success("Hash Copied")
  }
  const openInExplorer = () => {
    const url = currentNetworkInfo?.explorer.transactionUrl.replace(
      "{hash}",
      hash,
    )
    window.open(url, "_blank")?.focus()
  }
  const { t } = useTranslation()
  return (
    <div className={clsx("dropdown dropdown-top dropdown-end")}>
      <button
        type="button"
        tabIndex={0}
        className={clsx("cursor-pointer", className)}
      >
        {hash}
      </button>
      <ul className="p-2 shadow menu dropdown-content border-2 border-secondary z-[1] bg-neutral rounded-box w-52">
        <li onClick={handleClick}>
          <button type="button" onClick={copyHash} className="flex gap-2">
            <CopyIcon />
            <span>{t("components.copyHash")}</span>
          </button>
        </li>
        <li onClick={handleClick}>
          <button type="button" onClick={openInExplorer} className="flex gap-2">
            <ExternalLinkIcon />
            <span>{t("components.openInMinascan")}</span>
          </button>
        </li>
      </ul>
    </div>
  )
}
