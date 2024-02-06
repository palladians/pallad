import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'

import { AboutView } from './about/views/about'
import { AddressBookView } from './address-book/views/address-book'
import { NewAddressView } from './address-book/views/new-address'
import { UnlockWalletView } from './lock/views/unlock-wallet'
import { NotFoundView } from './not-found/views/not-found'
import { CreateWalletView } from './onboarding/views/create-wallet'
import { MnemonicConfirmationView } from './onboarding/views/mnemonic-confirmation'
import { MnemonicInputView } from './onboarding/views/mnemonic-input'
import { MnemonicWritedownView } from './onboarding/views/mnemonic-writedown'
import { RestoreWalletView } from './onboarding/views/restore-wallet'
import { StartView } from './onboarding/views/start'
import { StayConnectedView } from './onboarding/views/stay-connected'
import { OverviewView } from './overview/views/overview'
import { ReceiveView } from './receive/views/receive'
import { SendView } from './send/views/send'
import { TransactionErrorView } from './send/views/transaction-error'
import { TransactionSuccessView } from './send/views/transaction-success'
import { TransactionSummaryView } from './send/views/transaction-summary'
import { SettingsView } from './settings/views/settings'
import { BlockProducersView } from './staking/views/block-producers'
import { DelegateView } from './staking/views/delegate'
import { StakingOverviewView } from './staking/views/staking-overview'
import { TransactionDetailsView } from './transactions/views/transaction-details'
import { TransactionsView } from './transactions/views/transactions'

dayjs.extend(relativeTime)

export const Router = () => {
  return (
    <TooltipProvider>
      <div className="flex flex-1 pointer">
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<StartView />} />
            <Route path="/dashboard" element={<OverviewView />} />
            <Route path="/send" element={<SendView />} />
            <Route path="/receive" element={<ReceiveView />} />
            <Route
              path="/transactions/summary"
              element={<TransactionSummaryView />}
            />
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
            <Route path="/staking/delegate" element={<DelegateView />} />
            <Route path="/staking/producers" element={<BlockProducersView />} />
            <Route path="/contacts" element={<AddressBookView />} />
            <Route path="/contacts/new" element={<NewAddressView />} />
            <Route path="/onboarding/create" element={<CreateWalletView />} />
            <Route path="/onboarding/restore" element={<RestoreWalletView />} />
            <Route path="/unlock" element={<UnlockWalletView />} />
            <Route
              path="/onboarding/writedown"
              element={<MnemonicWritedownView />}
            />
            <Route
              path="/onboarding/confirmation"
              element={<MnemonicConfirmationView />}
            />
            <Route
              path="/onboarding/mnemonic"
              element={<MnemonicInputView />}
            />
            <Route path="/onboarding/finish" element={<StayConnectedView />} />
            <Route path="/settings" element={<SettingsView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/*" element={<NotFoundView />} />
          </Routes>
        </MemoryRouter>
        <Toaster />
      </div>
    </TooltipProvider>
  )
}
