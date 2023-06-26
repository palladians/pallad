import { Box } from '@palladxyz/ui'
import React from 'react'
import { NativeRouter, Route, Routes } from 'react-router-native'

import { UnlockWalletView } from './lock/views/UnlockWallet'
import { CreateWalletView } from './onboarding/views/CreateWallet'
import { MnemonicConfirmationView } from './onboarding/views/MnemonicConfirmation'
import { MnemonicInputView } from './onboarding/views/MnemonicInput'
import { MnemonicWritedownView } from './onboarding/views/MnemonicWritedown'
import { RestoreWalletView } from './onboarding/views/RestoreWallet'
import { StartView } from './onboarding/views/Start'
import { OverviewView } from './overview/views/Overview'
import { SendView } from './send/views/Send'
import { SettingsView } from './settings/views/Settings'

export const Router = () => {
  return (
    <Box css={{ flex: 1, height: '100vh' }}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<StartView />} />
          <Route path="/dashboard" element={<OverviewView />} />
          <Route path="/send" element={<SendView />} />
          <Route path="/create" element={<CreateWalletView />} />
          <Route path="/restore" element={<RestoreWalletView />} />
          <Route path="/unlock" element={<UnlockWalletView />} />
          <Route path="/writedown" element={<MnemonicWritedownView />} />
          <Route path="/confirmation" element={<MnemonicConfirmationView />} />
          <Route path="/mnemonic" element={<MnemonicInputView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </NativeRouter>
    </Box>
  )
}
