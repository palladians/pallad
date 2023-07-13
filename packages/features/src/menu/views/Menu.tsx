import { getSessionPersistence } from '@palladxyz/persistence'
import { Box, composeBox, Icons, Text } from '@palladxyz/ui'
import React from 'react'
import { Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useViewAnimation } from '../../common/lib/animation'

const StyledPressable = composeBox({ baseComponent: Pressable })

const MenuItem = ({ item }) => {
  return (
    <StyledPressable
      onPress={item.onPress}
      css={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: '$sm',
        paddingHorizontal: '$md',
        gap: 16
      }}
    >
      <Box
        css={{
          padding: '$sm',
          backgroundColor: '$gray800',
          borderRadius: '50%'
        }}
      >
        <item.Icon />
      </Box>
      <Text css={{ width: 'auto', flex: 1 }}>{item.label}</Text>
      <Icons.ArrowRight />
    </StyledPressable>
  )
}

export const MenuView = () => {
  const navigate = useNavigate()
  const { shift, opacity, scale } = useViewAnimation()
  const MENU_ITEMS = [
    {
      label: 'Transaction',
      onPress: () => navigate('/transactions'),
      Icon: Icons.List
    },
    {
      label: 'Settings',
      onPress: () => navigate('/settings'),
      Icon: Icons.Settings
    },
    {
      label: 'About',
      onPress: () => navigate('/about'),
      Icon: Icons.Info
    },
    {
      label: 'Lock',
      onPress: async () => {
        await getSessionPersistence().setItem('spendingPassword', '')
        // await vaultStore.persist.rehydrate()
        return navigate('/unlock')
      },
      Icon: Icons.Lock
    }
  ]
  return (
    <AppLayout>
      <Box style={{ opacity, marginTop: shift, transform: [{ scale }] }}>
        <Box css={{ padding: '$md' }}>
          <ViewHeading title="Menu" />
        </Box>
        <Box css={{ gap: 4 }}>
          {MENU_ITEMS.map((item, i) => (
            <MenuItem item={item} key={i} />
          ))}
        </Box>
      </Box>
    </AppLayout>
  )
}
