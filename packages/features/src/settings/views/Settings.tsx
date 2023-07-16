import { MinaNetwork } from '@palladxyz/key-generator'
import { Card, Label } from '@palladxyz/ui'
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
      <div className="p-4 gap-6">
        <ViewHeading
          title="Settings"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="gap-2">
          <Label>Network</Label>
          {/*<RadioGroup*/}
          {/*  onChange={(value) => handleNetworkSwitch(value as MinaNetwork)}*/}
          {/*  options={[*/}
          {/*    {*/}
          {/*      value: MinaNetwork[MinaNetwork.Mainnet],*/}
          {/*      label: 'Mainnet',*/}
          {/*      defaultSelected: network === MinaNetwork[MinaNetwork.Mainnet]*/}
          {/*    },*/}
          {/*    {*/}
          {/*      value: MinaNetwork[MinaNetwork.Devnet],*/}
          {/*      label: 'Devnet',*/}
          {/*      defaultSelected: network === MinaNetwork[MinaNetwork.Devnet]*/}
          {/*    },*/}
          {/*    {*/}
          {/*      value: MinaNetwork[MinaNetwork.Berkeley],*/}
          {/*      label: 'Berkeley',*/}
          {/*      defaultSelected: network === MinaNetwork[MinaNetwork.Berkeley]*/}
          {/*    }*/}
          {/*  ]}*/}
          {/*/>*/}
        </div>
        <div className="gap-4">
          <h2>Authorized Domains</h2>
          <div className="gap-4">
            <Card
              css={{
                padding: '$md',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <div>Pallad</div>
              <div className="gap-2 items-center">
                <div>pallad.xyz</div>
                <a>
                  <TrashIcon />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
