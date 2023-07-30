import { Avatar, AvatarFallback, Skeleton } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

import MinaLogo from '../../common/assets/mina.svg'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'

export const AssetList = () => {
  const navigate = useNavigate()
  const { data: accountData, isLoading: accountLoading } = useAccount()
  const rawMinaBalance = accountData?.balance.total
  const minaBalance = rawMinaBalance?.toFixed(4) || '0'
  return (
    <div className="flex flex-col flex-1 gap-3">
      <ViewHeading
        title="Assets"
        button={{
          label: 'See Transactions',
          onClick: () => navigate('/transactions')
        }}
      />
      {accountLoading ? (
        <Skeleton className="w-full h-32" />
      ) : (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="p-2">
              <MinaLogo />
            </AvatarFallback>
          </Avatar>
          <p className="flex-1 font-semibold">MINA</p>
          <p>{minaBalance}</p>
        </div>
      )}
    </div>
  )
}
