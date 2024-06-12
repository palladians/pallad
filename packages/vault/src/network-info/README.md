# Network Information Store

This document provides details on the `network-info-store` and `network-info-state` modules used for managing network information in Pallad application. Specifically, it contains all relevant information the application requires on the network it interacts with. This includes network data end-points, network names, chain-ids, and the current network name Pallad is using. These modules leverage the `zustand` state management library and `immer` for immutable state updates.

## Modules Overview

### network-info-store.ts

This file contains the main store slice using `zustand` and `immer` for managing the network information related to each blockchain network's providers. The store is designed to handle network configurations dynamically, allowing updates, additions, and deletions of network details at runtime.

#### Key Functions

- **setCurrentNetworkName**: Sets the current active network.
- **getCurrentNetworkInfo**: Returns the configuration of the current active network.
- **updateNetworkInfo**: Updates the details of a specified network.
- **setNetworkInfo**: Sets the configuration for a specific network.
- **getNetworkInfo**: Retrieves the configuration for a specific network.
- **removeNetworkInfo**: Removes a network from the store.
- **getChainIds**: Returns a list of all chain IDs available in the network information.
- **allNetworkInfo**: Retrieves all network configurations stored.
- **clear**: Clears all network information from the store.

### network-info-state.ts

This file defines TypeScript types for the state and actions of the network information store.

#### Types

- **NetworkInfoState**: Contains the state shape of the network information, including a record of network configurations and the current network name.
- **NetworkInfoActions**: Lists all the actions available in the network information store.
- **NetworkInfoStore**: A combination of `NetworkInfoState` and `NetworkInfoActions` providing a complete type for the store.

## Usage

### Initializing the Store

You can integrate the store into your application by importing and initializing it like is done in `vault`:

```ts
import { networkInfoSlice } from "./path/to/network-info-store";
import create from "zustand";

const useNetworkInfoStore = create(networkInfoSlice);
```

### Accessing and Modifying the Store

Here's how you can interact with the store:

```ts
// Set the current network name
useNetworkInfoStore.setState(setCurrentNetworkName("testnet"));

// Get current network configuration
const currentNetworkInfo = useNetworkInfoStore
  .getState()
  .getCurrentNetworkInfo();

// Update network information
useNetworkInfoStore
  .getState()
  .updateNetworkInfo("testnet", { chainId: "new-chain-id" });

// Add a new network configuration
useNetworkInfoStore.getState().setNetworkInfo("newnet", {
  nodeEndpoint: { providerName: "mina-node", url: "http://mina-node.com" },
  archiveNodeEndpoint: {
    providerName: "mina-explorer",
    url: "http://mina-explorer.com",
  },
  networkName: "Mina - Devnet",
  networkType: "testnet",
  chainId: "3c41383994b87449625df91769dff7b507825c064287d30fada9286f3f1cb15e",
});

// Remove a network
useNetworkInfoStore.getState().removeNetworkInfo("Mina - Berkeley");

// Clear all network information
useNetworkInfoStore.getState().clear();
```
