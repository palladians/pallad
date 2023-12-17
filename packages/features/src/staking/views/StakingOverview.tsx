import { useNavigate } from 'react-router-dom'

import { Card } from '@/components/ui/card'

import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'
import { formatCompact } from '../../common/lib/numbers'
import { EpochProgressChart } from '../components/EpochProgressChart'

export const StakingOverviewView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="Staking"
          button={{
            label: 'Change Pool',
            onClick: () => navigate('/staking/delegate')
          }}
        />
        <div className="flex flex-col flex-1 gap-4 p-4">
          <Card className="grid grid-cols-2 p-4 gap-2">
            <MetaField label="Epoch" value="55" />
            <MetaField label="Slot" value="6894/7140" />
            <MetaField label="Epoch ends in" value="01d : 3h : 7m" />
            <div className="flex-1 gap-2">
              <EpochProgressChart progress={0.75} />
            </div>
          </Card>
          <ViewHeading title="Delegation Info" noHorizontalPadding />
          <div className="flex flex-col gap-4">
            <MetaField label="Block Producer" value="B62qm...iQvm" />
            <MetaField
              label="Total Stake"
              value={`${formatCompact({ value: 208000 })} MINA`}
            />
            <MetaField label="Total Delegators" value="56" />
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
