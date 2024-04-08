# @palladxyz/vault

## Introduction

The `@palladxyz/vault` package offers a robust solution for managing key agents, credentials, and accounts within the wallet.

## `useVault`: Central Interface for Wallet Management

The `useVault` hook is the core interface of the `@palladxyz/vault` package, encapsulating the functionalities of account, credential, and key agent management in an integrated manner. It utilizes `zustand` for state management and `immer` for immutable state updates.

## Features

- Unified State Management: Integrates account, credential, and key agent stores into a single, cohesive state.
- Chain and Wallet Configuration: Allows setting and retrieving the current blockchain network and wallet configuration.
- Persisted State: Uses `zustand/middleware` for persistence, ensuring that the vault's state is maintained across sessions.

## Example Usage

```ts
import { useVault } from '@palladxyz/vault';
import { Network } from '@palladxyz/key-management';

// Example usage within a component or function
const MyComponent = () => {
  const vault = useVault();

  // Set current blockchain network
  vault.setChain(Network.Mina);

  // Retrieve current wallet information
  const walletInfo = vault.getCurrentWallet();

  return (
    // Render your component
  );
};
```

## API

- `setChain(chain)`: Sets the current blockchain network.
- `setCurrentWallet(payload)`: Updates the current wallet configuration.
- `getCurrentWallet()`: Retrieves the current wallet information, including key agent, credential, and account info.

## Architecture

The following diagram shows an informal overview of the vault.
![Vault](/packages/vault/images/vaultDiagram.png)
