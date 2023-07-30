import { Card } from '@palladxyz/ui'
import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'

export const ReceiveView = () => {
  const navigate = useNavigate()
  const { wallet } = useWallet()
  const walletAddress = wallet.getCurrentWallet()?.address
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
              <QRCode
                value={walletAddress}
                bgColor="#020617"
                fgColor="#0ea5e9"
              />
            )}
          </Card>
          <Card className="p-2 break-all text-center leading-8">
            {walletAddress}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
