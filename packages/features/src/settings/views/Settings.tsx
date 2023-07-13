import { MinaNetwork } from '@palladxyz/key-generator'
import {
  Box,
  Card,
  composeBox,
  Heading,
  Icons,
  RadioGroup,
  Text,
  theme
} from '@palladxyz/ui'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'
import { useSWRConfig } from 'swr'

import { AppLayout } from '../../common/components/AppLayout'
import { FormLabel } from '../../common/components/FormLabel'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useAppStore } from '../../wallet/store/app'

const StyledPressable = composeBox({ baseComponent: Pressable })

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
      <Box css={{ padding: 16, gap: 24 }}>
        <ViewHeading
          title="Settings"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <Box css={{ gap: 8 }}>
          <FormLabel>Network</FormLabel>
          <RadioGroup
            onChange={(value) => handleNetworkSwitch(value as MinaNetwork)}
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
        <Box css={{ gap: 16 }}>
          <Heading size="md">Authorized Domains</Heading>
          <Box css={{ gap: 16 }}>
            <Card
              css={{
                padding: '$md',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text>Pallad</Text>
              <Box css={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <Text>pallad.xyz</Text>
                <StyledPressable>
                  <Icons.Trash color={theme.colors.primary500.value} />
                </StyledPressable>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  )
}
