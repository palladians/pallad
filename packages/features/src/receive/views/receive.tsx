import QRCode from "react-qr-code"

import { AppLayout } from "@/components/app-layout"
import { ViewHeading } from "@/components/view-heading"

type ReceiveViewProps = {
  theme: string
  publicKey: string
  gradientBackground: string
  onGoBack: () => void
  onCopyWalletAddress: () => void
}

export const ReceiveView = ({
  theme,
  publicKey,
  gradientBackground,
  onGoBack,
  onCopyWalletAddress,
}: ReceiveViewProps) => (
  <AppLayout>
    <div className="flex flex-col flex-1">
      <ViewHeading title="Receive" backButton={{ onClick: onGoBack }} />
      <div className="flex flex-col flex-1 justify-center items-center gap-4 p-4">
        {publicKey && (
          <div className="animate-in slide-in-from-bottom-2 fade-in relative max-w-[256px] max-h-[256px] w-full h-full">
            <QRCode
              value={publicKey}
              bgColor={theme === "dark" ? "#020617" : "#ffffff"}
              fgColor={theme === "dark" ? "#ffffff" : "#000000"}
              className="relative w-full h-full"
            />
            <div
              className="absolute w-full h-full inset-0 dark:mix-blend-darken mix-blend-lighten"
              style={{ backgroundImage: gradientBackground }}
            />
          </div>
        )}
        <Tooltip>
          <TooltipTrigger>
            <Card
              className="animate-in slide-in-from-bottom-1 delay-100 fill-mode-both fade-in p-2 break-all text-center leading-8 cursor-pointer rounded-[1rem] text-sm max-w-[256px]"
              onClick={onCopyWalletAddress}
            >
              {publicKey}
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Address</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  </AppLayout>
)
