import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { MixpanelProvider } from "react-mixpanel-browser"
import { MemoryRouter, Route, Routes } from "react-router-dom"

import { AboutRoute } from "./about/routes/about"
import { AddressBookRoute } from "./address-book/routes/address-book"
import { NewAddressRoute } from "./address-book/routes/new-address"
import { UnlockWalletRoute } from "./lock/routes/unlock-wallet"
import { NotFoundRoute } from "./not-found/routes/not-found"
import { CreateWalletRoute } from "./onboarding/routes/create-wallet"
import { MnemonicConfirmationRoute } from "./onboarding/routes/mnemonic-confirmation"
import { MnemonicInputRoute } from "./onboarding/routes/mnemonic-input"
import { MnemonicWritedownRoute } from "./onboarding/routes/mnemonic-writedown"
import { RestoreWalletRoute } from "./onboarding/routes/restore-wallet"
import { StartRoute } from "./onboarding/routes/start"
import { StayConnectedRoute } from "./onboarding/routes/stay-connected"
import { OverviewRoute } from "./overview/routes/overview"
import { ReceiveRoute } from "./receive/routes/receive"
import { SendRoute } from "./send/routes/send"
import { TransactionErrorRoute } from "./send/routes/transaction-error"
import { TransactionSuccessRoute } from "./send/routes/transaction-success"
import { TransactionSummaryRoute } from "./send/routes/transaction-summary"
import { SettingsRoute } from "./settings/routes/settings"
import { BlockProducersRoute } from "./staking/routes/block-producers"
import { DelegateRoute } from "./staking/routes/delegate"
import { StakingOverviewRoute } from "./staking/routes/staking-overview"
import { TransactionDetailsRoute } from "./transactions/routes/transaction-details"
import { TransactionsRoute } from "./transactions/routes/transactions"

dayjs.extend(relativeTime)

const mixpanelConfig = {
  track_pageview: true,
}

export const Router = () => {
  return (
    <MixpanelProvider
      config={mixpanelConfig}
      token="ee1f7980362645f72b80bfdd0c7be4a8"
    >
      <div className="flex flex-1 pointer">
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<StartRoute />} />
            <Route path="/dashboard" element={<OverviewRoute />} />
            <Route path="/send" element={<SendRoute />} />
            <Route path="/receive" element={<ReceiveRoute />} />
            <Route
              path="/transactions/summary"
              element={<TransactionSummaryRoute />}
            />
            <Route
              path="/transactions/success"
              element={<TransactionSuccessRoute />}
            />
            <Route
              path="/transactions/error"
              element={<TransactionErrorRoute />}
            />
            <Route
              path="/transactions/:hash"
              element={<TransactionDetailsRoute />}
            />
            <Route path="/transactions" element={<TransactionsRoute />} />
            <Route path="/staking" element={<StakingOverviewRoute />} />
            <Route path="/staking/delegate" element={<DelegateRoute />} />
            <Route
              path="/staking/producers"
              element={<BlockProducersRoute />}
            />
            <Route path="/contacts" element={<AddressBookRoute />} />
            <Route path="/contacts/new" element={<NewAddressRoute />} />
            <Route path="/onboarding/create" element={<CreateWalletRoute />} />
            <Route
              path="/onboarding/restore"
              element={<RestoreWalletRoute />}
            />
            <Route path="/unlock" element={<UnlockWalletRoute />} />
            <Route
              path="/onboarding/writedown"
              element={<MnemonicWritedownRoute />}
            />
            <Route
              path="/onboarding/confirmation"
              element={<MnemonicConfirmationRoute />}
            />
            <Route
              path="/onboarding/mnemonic"
              element={<MnemonicInputRoute />}
            />
            <Route path="/onboarding/finish" element={<StayConnectedRoute />} />
            <Route path="/settings" element={<SettingsRoute />} />
            <Route path="/about" element={<AboutRoute />} />
            <Route path="/*" element={<NotFoundRoute />} />
          </Routes>
        </MemoryRouter>
      </div>
    </MixpanelProvider>
  )
}
