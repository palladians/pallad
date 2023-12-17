import { useFiatPrice } from '@palladxyz/offchain-data'

import { useAccount } from '@/common/hooks/useAccount'
import { Skeleton } from '@/components/ui/skeleton'

import { AppLayout } from '../../common/components/AppLayout'
import { AssetList } from '../components/AssetList'
import { OverviewCard } from '../components/OverviewCard'

export const OverviewView = () => {
  const { isLoading: accountLoading } = useAccount()
  const { isLoading: priceLoading } = useFiatPrice()
  const loading = accountLoading || priceLoading
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4 p-4">
        {loading ? <Skeleton className="h-[180px]" /> : <OverviewCard />}
        <AssetList />
      </div>
    </AppLayout>
  )
}
