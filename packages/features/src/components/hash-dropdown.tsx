import clsx from "clsx"
import { toast } from "sonner"

type HashDropdownProps = {
  hash: string
  className?: string
}

export const HashDropdown = ({ hash, className }: HashDropdownProps) => {
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
    const url = `https://minascan.io/devnet/tx/${hash}/txInfo`
    window.open(url, "_blank")?.focus()
  }
  return (
    <div className={clsx("dropdown dropdown-top dropdown-end")}>
      <div
        role="button"
        tabIndex={0}
        className={clsx("cursor-pointer", className)}
      >
        {hash}
      </div>
      <ul className="p-2 shadow menu dropdown-content border-2 border-secondary z-[1] bg-neutral rounded-box w-52">
        <li onClick={handleClick}>
          <button type="button" onClick={copyHash}>
            Copy Hash
          </button>
        </li>
        <li onClick={handleClick}>
          <button type="button" onClick={openInExplorer}>
            Open in Minascan
          </button>
        </li>
      </ul>
    </div>
  )
}
