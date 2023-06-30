import { Box } from '@palladxyz/ui'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import { NativeRouter, Route, Routes } from 'react-router-native'

import { AboutView } from './about/views/About'
import { AddressBookView } from './address-book/views/AddressBook'
import { NewAddressView } from './address-book/views/NewAddress'
import { UnlockWalletView } from './lock/views/UnlockWallet'
import { MenuView } from './menu/views/Menu'
import { NotFoundView } from './not-found/views/NotFound'
import { CreateWalletView } from './onboarding/views/CreateWallet'
import { MnemonicConfirmationView } from './onboarding/views/MnemonicConfirmation'
import { MnemonicInputView } from './onboarding/views/MnemonicInput'
import { MnemonicWritedownView } from './onboarding/views/MnemonicWritedown'
import { RestoreWalletView } from './onboarding/views/RestoreWallet'
import { StartView } from './onboarding/views/Start'
import { OverviewView } from './overview/views/Overview'
import { ReceiveView } from './receive/views/Receive'
import { SendView } from './send/views/Send'
import { TransactionErrorView } from './send/views/TransactionError'
import { TransactionSuccessView } from './send/views/TransactionSuccess'
import { SettingsView } from './settings/views/Settings'
import { StakingOverviewView } from './staking/views/StakingOverview'
import { TransactionDetailsView } from './transactions/views/TransactionDetails'
import { TransactionsView } from './transactions/views/Transactions'

dayjs.extend(relativeTime)

export const Router = () => {
  return (
    <Box css={{ flex: 1, height: '100vh' }}>
      <NativeRouter>
        <Routes>
          <Route path="/" element={<StartView />} />
          <Route path="/dashboard" element={<OverviewView />} />
          <Route path="/menu" element={<MenuView />} />
          <Route path="/send" element={<SendView />} />
          <Route path="/receive" element={<ReceiveView />} />
          <Route
            path="/transactions/success"
            element={<TransactionSuccessView />}
          />
          <Route
            path="/transactions/error"
            element={<TransactionErrorView />}
          />
          <Route
            path="/transactions/:hash"
            element={<TransactionDetailsView />}
          />
          <Route path="/transactions" element={<TransactionsView />} />
          <Route path="/staking" element={<StakingOverviewView />} />
          <Route path="/contacts" element={<AddressBookView />} />
          <Route path="/contacts/new" element={<NewAddressView />} />
          <Route path="/create" element={<CreateWalletView />} />
          <Route path="/restore" element={<RestoreWalletView />} />
          <Route path="/unlock" element={<UnlockWalletView />} />
          <Route path="/writedown" element={<MnemonicWritedownView />} />
          <Route path="/confirmation" element={<MnemonicConfirmationView />} />
          <Route path="/mnemonic" element={<MnemonicInputView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/*" element={<NotFoundView />} />
        </Routes>
      </NativeRouter>
    </Box>
  )
}
