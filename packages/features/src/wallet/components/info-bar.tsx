import { InfoIcon, XIcon } from "lucide-react"

type InfoBarProps = {
  onClose: () => void
}

export const InfoBar = ({ onClose }: InfoBarProps) => {
  return (
    <div className="px-8">
      <div className="flex gap-2 items-center w-full bg-secondary p-4 rounded-xl">
        <div className="p-2 bg-neutral rounded-full">
          <InfoIcon className="text-primary" />
        </div>
        <div className="flex flex-col">
          <h2>Open Beta version</h2>
          <p className="text-gray-400 text-sm">
            Only works for Devnet before Mainnet launch
          </p>
        </div>
        <button type="button" onClick={onClose}>
          <XIcon size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  )
}
