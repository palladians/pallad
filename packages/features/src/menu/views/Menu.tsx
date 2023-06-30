import { Box, composeBox, composeCard, Icons, Text } from '@palladxyz/ui'
import React from 'react'
import { FlatList, Pressable } from 'react-native'
import { useNavigate } from 'react-router-native'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { sessionPersistence } from '../../common/lib/storage'
import { vaultStore } from '../../common/store/vault'

const StyledPressable = composeCard({ baseComponent: Pressable })
const StyledFlatList = composeBox({ baseComponent: FlatList })

const MenuItem = ({ index, item }) => {
  return (
    <StyledPressable
      onPress={item.onPress}
      css={{
        flex: 1,
        marginRight: index % 2 === 0 ? 8 : 0,
        marginLeft: index % 2 === 0 ? 0 : 8,
        height: 116,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
      }}
    >
      <item.Icon />
      <Text css={{ width: 'auto', fontSize: 14 }}>{item.label}</Text>
    </StyledPressable>
  )
}

export const MenuView = () => {
  const navigate = useNavigate()
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
        await sessionPersistence.setItem('spendingPassword', '')
        await vaultStore.persist.rehydrate()
        return navigate('/unlock')
      },
      Icon: Icons.Lock
    }
  ]
  return (
    <AppLayout>
      <Box css={{ padding: '$md' }}>
        <ViewHeading
          title="Menu"
          backButton={{ onPress: () => navigate(-1) }}
        />
        <StyledFlatList
          data={MENU_ITEMS}
          renderItem={MenuItem}
          ItemSeparatorComponent={() => <Box css={{ height: 16 }} />}
          css={{
            gap: 8,
            marginTop: '$md'
            // marginTop: 16,
            // flexDirection: 'row',
            // flexWrap: 'wrap'
          }}
          numColumns={2}
        />
      </Box>
    </AppLayout>
  )
}
