import { useFiatPrice } from '@palladxyz/offchain-data'

import { useAccount } from '@/common/hooks/use-account'
import { AppLayout } from '@/components/app-layout'
import { Skeleton } from '@/components/ui/skeleton'

import { AssetList } from '../components/asset-list'
import { OverviewCard } from '../components/overview-card'

export const OverviewView = () => {
  const { isLoading: accountLoading } = useAccount()
  const { isLoading: priceLoading } = useFiatPrice()
  const loading = accountLoading || priceLoading
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4 p-4">
        {loading ? <Skeleton className="h-[182px]" /> : <OverviewCard />}
        <AssetList />
      </div>
    </AppLayout>
  )
}
