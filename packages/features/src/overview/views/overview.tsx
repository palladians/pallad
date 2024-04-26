import type { useAccount } from "@/common/hooks/use-account"
import { AppLayout } from "@/components/app-layout"
import { Skeleton } from "@/components/ui/skeleton"

import { AssetList } from "../components/asset-list"
import { OverviewCard } from "../components/overview-card"

type OverviewViewProps = {
  account: ReturnType<typeof useAccount>
  fiatBalance: number
}

export const OverviewView = ({ account, fiatBalance }: OverviewViewProps) => {
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-4 p-4">
        {account.isLoading ? (
          <Skeleton className="h-[182px]" />
        ) : (
          <OverviewCard account={account} fiatBalance={fiatBalance} />
        )}
        <AssetList account={account} />
      </div>
    </AppLayout>
  )
}
