# Token Info Store

## Overview

The Token Info Store is a module designed to manage and store token information for various Pallad networks. It leverages the Zustand state management library and Immer for handling immutable state updates efficiently. This store is responsible for setting, retrieving, and deleting token information by network and token identifier.

## Files

- `token-info-store.ts`: Implements the store logic using Zustand and Immer.
- `token-info-state.ts`: Defines TypeScript types for token information and store structure.

## Features

- **Set Token Information**: Add or update token information for a specific network.
- **Get Token Information**: Retrieve the token ID for a specific ticker and network.
- **Get Tokens Information**: Retrieve all token information for a given network.
- **Remove Token Information**: Remove specific token information for a given network and ticker.
- **Clear Token Information**: Clear all token information in the store.

## Usage

### Setting Token Info

```typescript
setTokenInfo(networkName, { ticker, tokenId });
```