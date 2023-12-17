import { useTheme } from 'next-themes'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'

export const ReceiveView = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const { copyWalletAddress, publicKey, gradientBackground } = useAccount()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Receive"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <Card className="flex justify-center items-center p-4">
            {publicKey && (
              <div className="relative max-w-[256px] max-h-[256px] w-full h-full">
                <QRCode
                  value={publicKey}
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
}
