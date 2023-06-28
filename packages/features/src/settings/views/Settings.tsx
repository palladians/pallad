import { MinaNetwork } from '@palladxyz/key-generator'
import { Box, RadioGroup } from '@palladxyz/ui'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAppStore } from '../../common/store/app'

export const SettingsView = () => {
  const navigate = useNavigate()
  const { setNetwork, network } = useAppStore((state) => ({
    setNetwork: state.setNetwork,
    network: state.network
  }))
  return (
    <AppLayout>
      <Box css={{ padding: 16, gap: 16 }}>
        <ViewHeading
          title="Settings"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ gap: 8 }}>
          <FormLabel>Network</FormLabel>
          <RadioGroup
            onChange={(value) => setNetwork(value as MinaNetwork)}
            options={[
              {
                value: MinaNetwork[MinaNetwork.Mainnet],
                label: 'Mainnet',
                defaultSelected: network === MinaNetwork[MinaNetwork.Mainnet]
              },
              {
                value: MinaNetwork[MinaNetwork.Devnet],
                label: 'Devnet',
                defaultSelected: network === MinaNetwork[MinaNetwork.Devnet]
              },
              {
                value: MinaNetwork[MinaNetwork.Berkeley],
                label: 'Berkeley',
                defaultSelected: network === MinaNetwork[MinaNetwork.Berkeley]
              }
            ]}
          />
        </Box>
      </Box>
    </AppLayout>
  )
}
