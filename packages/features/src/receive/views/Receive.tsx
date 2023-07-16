import QRCode from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'

export const ReceiveView = () => {
  const navigate = useNavigate()
  // const currentWallet = useVaultStore((state) => state.getCurrentWallet())
  // const walletAddress = currentWallet?.walletPublicKey
  const walletAddress = 'B62XXX'
  return (
    <AppLayout>
      <div className="p-4 flex-1">
        <ViewHeading
          title="Receive"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="justify-center items-center flex-1 gap-6">
          {walletAddress && (
            <QRCode value={walletAddress} bgColor="#ff0000" fgColor="#00ff00" />
          )}
          <a>{walletAddress}</a>
        </div>
      </div>
    </AppLayout>
  )
}
