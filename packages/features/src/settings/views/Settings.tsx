import { MinaNetwork } from '@palladxyz/key-generator'
import { Card, Label, RadioGroup, RadioGroupItem } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAppStore } from '../../wallet/store/app'
import { TrashIcon } from 'lucide-react'

export const SettingsView = () => {
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const { setNetwork, network } = useAppStore((state) => ({
    setNetwork: state.setNetwork,
    network: state.network
  }))
  const handleNetworkSwitch = (value: MinaNetwork) => {
    setNetwork(value)
    mutate(() => true, undefined, { revalidate: false })
  }
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-6">
        <ViewHeading
          title="Settings"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col gap-2">
          <Label>Network</Label>
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Mainnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Devnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">Berkeley</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Theme</Label>
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compact" id="r3" />
              <Label htmlFor="r3">System</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-4">
          <h2>Authorized Domains</h2>
          <div className="flex flex-col gap-2">
            <Card className="flex p-2 justify-between">
              <div>Pallad</div>
              <div className="flex gap-2 items-center">
                <div>pallad.xyz</div>
                <a>
                  <TrashIcon size={16} />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
