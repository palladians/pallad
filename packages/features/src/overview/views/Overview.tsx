import { AppLayout } from '../../common/components/AppLayout'
import { AssetList } from '../components/AssetsList'
import { OverviewCard } from '../components/OverviewCard'

export const OverviewView = () => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4">
        <OverviewCard />
        <AssetList />
      </div>
    </AppLayout>
  )
}
