import { useAccount } from '@/common/hooks/use-account'
import { useBlockchainSummary } from '@/common/hooks/use-blockchain-summary'
import { truncateString } from '@/common/lib/string'
import { AppLayout } from '@/components/app-layout'
import { ButtonArrow } from '@/components/button-arrow'
import { MetaField } from '@/components/meta-field'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ViewHeading } from '@/components/view-heading'
import { getAccountUrl } from '@/lib/explorer'

type StakingOverviewViewProps = {
  stakeDelegated: boolean
  onChangePool: () => void
  blockchainSummary: ReturnType<typeof useBlockchainSummary>
  account: ReturnType<typeof useAccount>
}

export const StakingOverviewView = ({
  stakeDelegated,
  onChangePool,
  blockchainSummary,
  account
}: StakingOverviewViewProps) => (
  <AppLayout>
    <div className="flex flex-col flex-1">
      <ViewHeading
        title="Staking"
        button={
          stakeDelegated
            ? {
                label: 'Change Pool',
                onClick: onChangePool
              }
            : undefined
        }
      />
      <div className="flex flex-col flex-1 gap-4 p-4">
        {blockchainSummary.isLoading ? (
          <Skeleton className="h-[52px]" />
        ) : (
          <Card className="grid grid-cols-2 p-4 gap-2 rounded-[1rem]">
            <MetaField
              label="Epoch"
              value={blockchainSummary.data?.epoch ?? ''}
            />
            <MetaField
              label="Slot"
              value={`${blockchainSummary.data?.slot}/7140`}
            />
          </Card>
        )}
        {stakeDelegated ? (
          <div className="flex flex-col flex-1">
            <ViewHeading title="Delegation Info" noHorizontalPadding />
            <div className="flex flex-col gap-4">
              <MetaField
                label="Block Producer"
                value={truncateString({
                  value: account.data.delegate, //TODO: Change to util
                  endCharCount: 8,
                  firstCharCount: 8
                })}
                url={getAccountUrl({
                  network: account.network,
                  publicKey: account.data.publicKey
                })}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1">
            <div className="flex-1" />
            <Button onClick={onChangePool} className="group gap-2">
              <span>Start Staking</span>
              <ButtonArrow />
            </Button>
          </div>
        )}
      </div>
    </div>
  </AppLayout>
)
