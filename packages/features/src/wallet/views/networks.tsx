import MinaIcon from "@/common/assets/mina.svg?react"
import { MenuBar } from "@/components/menu-bar"

type NetworksViewProps = {
  onCloseClicked: () => void
}

export const NetworksView = ({ onCloseClicked }: NetworksViewProps) => {
  return (
    <div className="flex flex-col flex-1">
      <MenuBar
        variant="wallet"
        onCloseClicked={onCloseClicked}
        networkManagement
      />
      <div className="px-8 pb-8">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1>
              <span className="text-mint">Available</span>
              <br />
              <span className="text-2xl">Networks</span>
            </h1>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 mt-6">
          <div className="card flex flex-row bg-secondary w-full py-2 px-4 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="btn btn-circle">
                <MinaIcon />
              </div>
              <h2 className="text-lg">Mina</h2>
            </div>
            <h3 className="text-[#7D7A9C]">Berkeley</h3>
          </div>
        </div>
      </div>
    </div>
  )
}
