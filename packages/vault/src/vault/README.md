# Vault Store

## Overview
The Pallad Vault is a storage system for the Pallad browser extension. It provides a means to manage various aspects of a the wallet including accounts, transactions, credentials, and network configurations.

## Features
- Multi-network Support: Compatible with different blockchain networks.
- Credential Management: Secure storage for wallet credentials.
- Dynamic Account Management: Functions to manage and switch between multiple accounts.
- Transaction Management: Tools to construct, sign, and submit transactions.
- Synchronization Utilities: Sync account information and transactions automatically.

## Key Components
- `GlobalVaultStore`: The main interface for all vault operations.
- `GlobalVaultState`: Stores the state of the vault including current network, wallet information, and known accounts.

## Key Methods
- `createWallet()`: Create a new wallet with a mnemonic.
- `restoreWallet()`: Restore a wallet from a mnemonic.
- `switchNetwork()`: Change the active blockchain network.
- `sign()`: Sign a transaction or message.
- `submitTx()`: Submit a transaction to the blockchain.

## Architecture 

```mermaid
classDiagram
    class GlobalVaultStore {
        +GlobalVaultState state
        +setChain(Network)
        +setKnownAccounts(string)
        +getCurrentWallet() CurrentWallet
        +setCurrentWallet(CurrentWalletPayload)
        +_syncAccountInfo(ProviderConfig, ChainAddress)
        +_syncTransactions(ProviderConfig, ChainAddress)
        +_syncWallet()
        +getCurrentNetwork() string
        +switchNetwork(NetworkName)
        +getCredentials(SearchQuery, string[]) StoredCredential[]
        +getWalletAccountInfo() unknown
        +getWalletTransactions() unknown[]
        +sign(ChainSignablePayload, ChainOperationArgs, GetPassphrase)
        +constructTx(constructTxArgs)
        +submitTx(SubmitTxArgs)
        +createWallet(number) CreateWalletReturn
        +restoreWallet(ChainDerivationArgs, string, FromBip39MnemonicWordsProps, KeyAgentName, KeyAgents, CredentialName)
        +restartWallet()
        +getAccounts() string[]
        +getBalance(string) number
        +getChainId() string
    }

    class GlobalVaultState {
        +keyAgentName string
        +credentialName string
        +currentAccountIndex number
        +currentAddressIndex number
        +chain Network
        +walletNetwork PalladNetworkNames
        +walletName string
        +knownAccounts string[]
        +chainIds string[]
    }

    GlobalVaultStore --|> GlobalVaultState : contains

    class CurrentWallet {
        +singleKeyAgentState SingleKeyAgentState
        +credential SingleCredentialState
        +accountInfo Record~string, AccountInfo~
        +transactions Record~string, Tx[]~
    }

    class CurrentWalletPayload {
        +keyAgentName string
        +credentialName string
        +currentAccountIndex number
        +currentAddressIndex number
    }

    GlobalVaultStore --|> CurrentWallet : manages
    GlobalVaultStore --|> CurrentWalletPayload : modifies

    class ProviderConfig {
    }
    class ChainAddress {
    }
    class ChainSignablePayload {
    }
    class ChainOperationArgs {
    }
    class GetPassphrase {
    }
    class NetworkName {
    }
    class SearchQuery {
    }
    class StoredCredential {
    }
    class SingleKeyAgentState {
    }
    class SingleCredentialState {
    }
    class AccountInfo {
    }
    class constructTxArgs {
    }
    class SubmitTxArgs {
    }
    class KeyAgentName {
    }
    class KeyAgents {
    }
    class CredentialName {
    }
    class ChainDerivationArgs {
    }
    class FromBip39MnemonicWordsProps {
    }
    class Network {
    }
    class PalladNetworkNames {
    }

    %% Relationships for clarity and flow of information
    CurrentWalletPayload ..> SingleKeyAgentState
    CurrentWalletPayload ..> SingleCredentialState
    CurrentWalletPayload ..> AccountInfo
    CurrentWalletPayload ..> constructTxArgs
    CurrentWalletPayload ..> SubmitTxArgs
```