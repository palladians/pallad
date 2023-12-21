import { ClockIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

import { MinaIcon } from '../../common/components/MinaIcon'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAccount } from '../../common/hooks/useAccount'

export const AssetList = () => {
  const navigate = useNavigate()
  const { isLoading: accountLoading, minaBalance } = useAccount()
  return (
    <div className="flex flex-col flex-1">
      <ViewHeading
        title="Assets"
        button={{
          label: 'See Transactions',
          onClick: () => navigate('/transactions'),
          icon: <ClockIcon size={16} />
        }}
        noHorizontalPadding
      />
      {accountLoading ? (
        <Skeleton className="w-full h-8" />
      ) : (
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback className="p-2 text-blue-charcoal-950 dark:text-white">
              <MinaIcon stroke={'3'} />
            </AvatarFallback>
          </Avatar>
          <p className="flex-1 font-semibold">MINA</p>
          <p>{minaBalance?.toString()}</p>
        </div>
      )}
    </div>
  )
}
