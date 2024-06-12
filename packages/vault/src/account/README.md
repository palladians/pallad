# Account Store

This repository contains the core state management logic for Pallad. It uses Zustand for state management and Immer for immutability. The state management is split across two files: `account-info-store.ts` and `account-info-state.ts`. Below is a detailed breakdown of each.

## Files and Functionality

### 1. `account-info-state.ts`

#### Description:

This file defines the types and interfaces used in the state management system.

#### Key Components:

- **SingleAccountState:** Holds the account information and transactions specific to one blockchain address.
- **ChainAddressMapping:** A record that maps a blockchain address to its corresponding `SingleAccountState`.
- **AccountState:** Represents the overall state structure, containing all accounts organized by network.
- **AccountActions:** Defines the actions that can be performed to manipulate the account store.
- **AccountStore:** Combines `AccountState` with `AccountActions` to provide a comprehensive state and action management interface.

### 2. `account-info-store.ts`

#### Description:

This file implements the state and actions defined in `account-info-state.ts`, providing functionalities to manage accounts and their transactions.

#### Key Features:

- **State Initialization:** Initializes the state with empty account records.
- **ensureAccount:** Ensures that an account exists for a specified network and address.
- **setAccountInfo:** Sets or updates the account information for a specific address and network.
- **setTransactions:** Sets or updates the transactions associated with a specific address and network.
- **addAccount:** Adds a new account for a specified network and address.
- **removeAccount:** Removes an account for a specified network and address.
- **getAccountsInfo:** Retrieves the state of accounts for a given network and address.
- **getAccountInfo:** Fetches account information for a specific address, network, and ticker.
- **getTransactions:** Retrieves transactions for a specified address, network, and ticker.
- **getTransaction:** Finds a specific transaction by its hash for a given address, network, and ticker.
- **clear:** Clears all account information from the store.

### Usage

```typescript
import createStore from "zustand";
import { accountSlice } from "./account-info-store";

const useAccountStore = createStore(accountSlice);
```

### Methods

Each method defined in account-info-store.ts can be accessed using the store instance created. For example, to ensure an account is initialized, you can use:

```ts
useAccountStore.getState().ensureAccount("Mina - Devnet", "B62fjf...");
```

For more detailed usage, checkout the `valut`.
