import { useTheme } from 'next-themes'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { useAccount } from '@/common/hooks/use-account'
import { AppLayout } from '@/components/app-layout'
import { Card } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { ViewHeading } from '@/components/view-heading'

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
        <div className="flex flex-col flex-1 justify-center items-center gap-4 p-4">
          {publicKey && (
            <div className="animate-in slide-in-from-bottom-2 fade-in relative max-w-[256px] max-h-[256px] w-full h-full">
              <QRCode
                value={publicKey}
                bgColor={theme === 'dark' ? '#020617' : '#ffffff'}
                fgColor={theme === 'dark' ? '#ffffff' : '#000000'}
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
