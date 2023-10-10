import { Card, Tooltip, TooltipContent, TooltipTrigger } from '@palladxyz/ui'
import { useTheme } from 'next-themes'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWalletUi } from '../../common/hooks/useWalletUi'

export const ReceiveView = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { currentWallet } = useWalletUi()
  const walletAddress = currentWallet?.credential?.address
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title="Receive"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 gap-6">
          <Card className="flex justify-center items-center p-4">
            {walletAddress && (
              <div className="relative max-w-[256px] max-h-[256px] w-full h-full">
                <QRCode
                  value={walletAddress}
                  bgColor={theme === 'dark' ? '#020617' : '#ffffff'}
                  fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
                  className="relative w-full h-full rounded-lg"
                />
                <div
                  className="absolute w-full h-full inset-0 dark:mix-blend-darken mix-blend-lighten"
                  style={{ backgroundImage: gradientBackground }}
                />
              </div>
            )}
          </Card>
          <Tooltip>
            <TooltipTrigger>
              <Card
                className="p-2 break-all text-center leading-8 cursor-pointer"
                onClick={copyWalletAddress}
              >
                {walletAddress}
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
}
