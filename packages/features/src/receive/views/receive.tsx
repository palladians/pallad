import { useTranslation } from "react-i18next"
import QRCode from "react-qr-code"

import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"

type ReceiveViewProps = {
  publicKey: string
  walletName: string
  onGoBack: () => void
  onCopyWalletAddress: () => void
}

export const ReceiveView = ({
  publicKey,
  walletName,
  onGoBack,
  onCopyWalletAddress,
}: ReceiveViewProps) => (
  <AppLayout>
    <div className="flex flex-col flex-1">
      <MenuBar variant="card" onCloseClicked={onGoBack} />
      <div className="animate-in fade-in slide-in-from-bottom-8 px-8 pb-8">
        <h1 className="text-3xl mb-4">{useTranslation().t("yourAddress")}</h1>
        <div className="flex flex-col text-center justify-center items-center space-y-8 card bg-accent p-8">
          <QRCode
            value={publicKey}
            bgColor={"#25233A"}
            fgColor={"#D1B4F4"}
            className="relative w-[140px] h-[140px]"
          />
          <div className="space-y-3">
            <h2 className="text-2xl text-secondary">{walletName}</h2>
            <p className="text-secondary break-all">{publicKey}</p>
            <button
              type="button"
              className="btn btn-link text-secondary text-sm"
              onClick={onCopyWalletAddress}
            >
              {useTranslation().t("copyClipboard")}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
)
