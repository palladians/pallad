import type { useAccount } from "@/common/hooks/use-account"
import type { useBlockchainSummary } from "@/common/hooks/use-blockchain-summary"
import { truncateString } from "@/common/lib/string"
import { AppLayout } from "@/components/app-layout"
import { MenuBar } from "@/components/menu-bar"
import { MetaField } from "@/components/meta-field"

import { getAccountUrl } from "@/lib/explorer"

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
  account,
}: StakingOverviewViewProps) => (
  <AppLayout>
    <MenuBar variant="dashboard" />
    <div className="flex flex-col flex-1 gap-4 p-4">
      {blockchainSummary.isLoading ? (
        <div className="skeleton" />
      ) : (
        <div className="grid grid-cols-2 p-4 gap-2 rounded-[1rem]">
          <MetaField
            label="Epoch"
            value={blockchainSummary.data?.epoch ?? ""}
          />
          <MetaField
            label="Slot"
            value={`${blockchainSummary.data?.slot}/7140`}
          />
        </div>
      )}
      {stakeDelegated ? (
        <div className="flex flex-col flex-1">
          <div className="flex flex-col gap-4">
            <MetaField
              label="Block Producer"
              value={truncateString({
                value: account.data.delegate, //TODO: Change to util
                endCharCount: 8,
                firstCharCount: 8,
              })}
              url={getAccountUrl({
                network: account.network,
                publicKey: account.data.publicKey,
              })}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="flex-1" />
          <button type="button" onClick={onChangePool} className="group gap-2">
            <span>Start Staking</span>
          </button>
        </div>
      )}
    </div>
  </AppLayout>
)
