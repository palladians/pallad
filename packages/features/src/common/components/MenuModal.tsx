import { Box, Button, Heading, icons, Modal } from '@palladxyz/ui'
import React from 'react'
import { useNavigate } from 'react-router-native'

import { useVaultStore } from '../store/vault'
import { sessionPersistence } from '../lib/storage'

interface MenuModalProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const MenuModal = ({ isOpen, setIsOpen }: MenuModalProps) => {
  const navigate = useNavigate()
  const MENU_ITEMS = [
    {
      label: 'Transaction',
      onPress: () => navigate('/dashboard'),
      icon: icons.iconTransactions
    },
    {
      label: 'Staking',
      onPress: () => navigate('/dashboard'),
      icon: icons.iconStaking
    },
    {
      label: 'Settings',
      onPress: () => navigate('/settings'),
      icon: icons.iconSettings
    },
    {
      label: 'About',
      onPress: () => navigate('/dashboard'),
      icon: icons.iconAbout
    },
    {
      label: 'Lock',
      onPress: async () => {
        await sessionPersistence.setItem('spendingPassword', '')
        await useVaultStore.persist.rehydrate()
        return navigate('/unlock')
      },
      icon: icons.iconLock
    }
  ]
  return (
    <Modal
      maxHeight="100vh"
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      borderRadius={0}
    >
      <Heading size="md">Menu</Heading>
      <Box css={{ gap: 8, marginTop: 16 }}>
        {MENU_ITEMS.map((menuItem, i) => (
          <Button
            key={i}
            variant="secondary"
            css={{ justifyContent: 'flex-start' }}
            size="lg"
            leftIcon={menuItem.icon}
            onPress={() => {
              setIsOpen(false)
              menuItem.onPress()
            }}
          >
            {menuItem.label}
          </Button>
        ))}
      </Box>
    </Modal>
  )
}
