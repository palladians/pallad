import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { ErrorBoundary } from "react-error-boundary"
import { Toaster } from "sonner"
import { AccountManagementRoute } from "./account-management/routes/account-management"
import { AddAccountRoute } from "./account-management/routes/add-account"
import { EditAccountRoute } from "./account-management/routes/edit-account"
import { AddressBookRoute } from "./address-book/routes/address-book"
import { NewAddressRoute } from "./address-book/routes/new-address"
import { ErrorView } from "./error-renderer/views/error"
import { UnlockWalletRoute } from "./lock/routes/unlock-wallet"
import { NotFoundRoute } from "./not-found/routes/not-found"
import { CreateWalletRoute } from "./onboarding/routes/create-wallet"
import { RestoreWalletRoute } from "./onboarding/routes/restore-wallet"
import { SeedBackupRoute } from "./onboarding/routes/seed-backup"
import { SeedBackupConfirmationRoute } from "./onboarding/routes/seed-backup-confirmation"
import { SeedBackupSecurityRoute } from "./onboarding/routes/seed-backup-security"
import { SeedImportRoute } from "./onboarding/routes/seed-import"
import { SeedImportSecurityRoute } from "./onboarding/routes/seed-import-security"
import { StartRoute } from "./onboarding/routes/start"
import { StayConnectedRoute } from "./onboarding/routes/stay-connected"
import { ReceiveRoute } from "./receive/routes/receive"
import { SendRoute } from "./send/routes/send"
import { TransactionErrorRoute } from "./send/routes/transaction-error"
import { TransactionSuccessRoute } from "./send/routes/transaction-success"
import { TransactionSummaryRoute } from "./send/routes/transaction-summary"
import { AboutRoute } from "./settings/routes/about"
import { AuthorizedZkAppsRoute } from "./settings/routes/authorized-zkapps"
import { CurrencyRoute } from "./settings/routes/currency"
import { DisplayRoute } from "./settings/routes/display"
import { LanguageRoute } from "./settings/routes/language"
import { PrivacyRoute } from "./settings/routes/privacy"
import { SettingsRoute } from "./settings/routes/settings"
import { SupportRoute } from "./settings/routes/support"
import { TermsOfUseRoute } from "./settings/routes/terms-of-use"
import { BlockProducersRoute } from "./staking/routes/block-producers"
import { DelegateRoute } from "./staking/routes/delegate"
import { StakingOverviewRoute } from "./staking/routes/staking-overview"
import { TransactionDetailsRoute } from "./transactions/routes/transaction-details"
import { TransactionsRoute } from "./transactions/routes/transactions"
import { NetworksRoute } from "./wallet/routes/networks"
import { OverviewRoute } from "./wallet/routes/overview"

dayjs.extend(relativeTime)

export const Router = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorView}>
      <div className="flex flex-1 pointer">
        <Toaster theme="dark" />
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<StartRoute />} />
            <Route path="/dashboard" element={<OverviewRoute />} />
            <Route path="/networks" element={<NetworksRoute />} />
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
            <Route path="contacts" element={<Outlet />}>
              <Route path="" element={<AddressBookRoute />} />
              <Route path="new" element={<NewAddressRoute />} />
            </Route>
            <Route path="onboarding" element={<Outlet />}>
              <Route path="create" element={<CreateWalletRoute />} />
              <Route path="restore" element={<RestoreWalletRoute />} />
              <Route path="backup" element={<SeedBackupRoute />} />
              <Route
                path="backup_security"
                element={<SeedBackupSecurityRoute />}
              />
              <Route path="import" element={<SeedImportRoute />} />
              <Route
                path="import_security"
                element={<SeedImportSecurityRoute />}
              />
              <Route
                path="confirmation"
                element={<SeedBackupConfirmationRoute />}
              />
              <Route path="finish" element={<StayConnectedRoute />} />
            </Route>
            <Route path="/unlock" element={<UnlockWalletRoute />} />
            <Route path="settings" element={<Outlet />}>
              <Route path="" element={<SettingsRoute />} />
              <Route path="about" element={<Outlet />}>
                <Route path="" element={<AboutRoute />} />
                <Route path="support" element={<SupportRoute />} />
                <Route path="terms-of-use" element={<TermsOfUseRoute />} />
              </Route>
              <Route path="display" element={<Outlet />}>
                <Route path="" element={<DisplayRoute />} />
                <Route path="language" element={<LanguageRoute />} />
                <Route path="currency" element={<CurrencyRoute />} />
              </Route>
              <Route
                path="authorized-zkapps"
                element={<AuthorizedZkAppsRoute />}
              />
              <Route path="privacy" element={<PrivacyRoute />} />
            </Route>
            <Route path="accounts" element={<Outlet />}>
              <Route path="" element={<AccountManagementRoute />} />
              <Route path="edit" element={<EditAccountRoute />} />
              <Route path="add" element={<AddAccountRoute />} />
            </Route>
            <Route path="/*" element={<NotFoundRoute />} />
          </Routes>
        </MemoryRouter>
      </div>
    </ErrorBoundary>
  )
}
