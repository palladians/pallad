import MinaIcon from "@/common/assets/mina.svg?react"
import { MenuBar } from "@/components/menu-bar"
import { useTranslation } from "react-i18next"

const NETWORKS = [
  {
    id: "mina:mainnet",
    icon: MinaIcon,
    blockchain: "Mina",
    network: "Mainnet",
  },
  {
    id: "mina:devnet",
    icon: MinaIcon,
    blockchain: "Mina",
    network: "Devnet",
  },
]

type NetworksViewProps = {
  onCloseClicked: () => void
  onNetworkSwitch: (network: string) => Promise<void>
  networkId: string
}

export const NetworksView = ({
  onCloseClicked,
  onNetworkSwitch,
  networkId,
}: NetworksViewProps) => {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col flex-1">
      <MenuBar
        variant="wallet"
        onCloseClicked={onCloseClicked}
        networkId={networkId}
        networkManagement
      />
      <div className="px-8 pb-8">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h1>
              <span className="text-mint">{t("wallet.available")}</span>
              <br />
              <span className="text-2xl">{t("wallet.networks")}</span>
            </h1>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4 mt-6">
          {NETWORKS.map((entry) => (
            <button
              type="button"
              key={entry.id}
              className="card flex flex-row bg-secondary w-full py-2 px-4 justify-between items-center"
              onClick={() => onNetworkSwitch(entry.id)}
            >
              <div className="flex items-center gap-2">
                <div className="btn btn-circle">
                  <entry.icon width={24} height={24} />
                </div>
                <h2 className="text-lg">{entry.blockchain}</h2>
              </div>
              <h3 className="text-[#7D7A9C]">{entry.network}</h3>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
