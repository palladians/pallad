import { MinaNetwork } from '@palladxyz/key-generator'
import { Box, Heading, RadioGroup, Text } from '@palladxyz/ui'

import { AppLayout } from '../../common/components/AppLayout'
import { useAppStore } from '../../common/store/app'

export const SettingsView = () => {
  const { setNetwork, network } = useAppStore((state) => ({
    setNetwork: state.setNetwork,
    network: state.network
  }))
  return (
    <AppLayout>
      <Box css={{ padding: 16, gap: 16 }}>
        <Heading size="md">Settings</Heading>
        <Box css={{ gap: 8 }}>
          <Text>Network</Text>
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
