import { Card, Label } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { formatCompact } from '../../common/lib/numbers'
import { EpochProgressChart } from '../components/EpochProgressChart'

export const StakingOverviewView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="p-4 gap-4">
        <ViewHeading
          title="Staking"
          button={{
            label: 'Change Pool',
            onClick: () => navigate('/staking/delegate')
          }}
        />
        <Card>
          <div className="gap-2">
            <div className="flex-1, gap-2">
              <Label>Epoch</Label>
              <div>55</div>
            </div>
            <div className="flex-1 gap-2">
              <Label>Slot</Label>
              <div>6894/7140</div>
            </div>
          </div>
          <div className="gap-2">
            <div className="flex-1 gap-2">
              <Label>Epoch ends in</Label>
              <div>01d : 3h : 7m</div>
            </div>
            <div className="flex-1 gap-2">
              <EpochProgressChart progress={0.75} />
            </div>
          </div>
        </Card>
        <ViewHeading title="Delegation Info" />
        <div className="gap-6">
          <div className="gap-2">
            <Label>Block Producer</Label>
            <div>B62qm...iQvm</div>
          </div>
          <div className="gap-2">
            <Label>Total Stake</Label>
            <div>{formatCompact({ value: 208000 })} MINA</div>
          </div>
          <div className="gap-2">
            <Label>Total Delegators</Label>
            <div>56</div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
