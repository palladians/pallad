# Key Agent Store

This TypeScript module provides a state management store for cryptographic key agents using Zustand, Immer, and the `@palladco/key-management` package. It is the key agent store for Pallad and it offers a robust set of functionalities to manage key agents securely in memory.

## Key Files
- `key-agent-store.ts`: Contains the core logic for the Zustand store slice managing the state of key agents.
- `key-agent-state.ts`: Defines the types and initial states for key agents.

## Features

### State Management
- **Ensure Key Agent**: Ensures a key agent is initialized in the store.
- **Initialize Key Agent**: Initializes a new key agent from BIP39 mnemonic words.
- **Restore Key Agent**: Restores a key agent from serialized data.
- **Remove Key Agent**: Removes a specified key agent from the store.
- **Clear Store**: Clears all key agents from the store.

### Cryptographic Operations
- **Request Signing**: Delegates a signing request to the appropriate key agent.
- **Create Credential**: Creates a new credential for a specified key agent.
- **Get Key Agent**: Retrieves the state of a specified key agent.

## Usage

### Setup Store
To use this module, ensure that you have Zustand and Immer set up in your project. Include the key agent store in your Zustand store setup.

### Example Initialization
```typescript
import { useStore } from './store'; // Assuming your Zustand store setup file is store.ts

// Initialize a key agent
const mnemonicWords = ["habit", "quick", "light", ..., "fox"];
useStore.getState().initialiseKeyAgent("myKeyAgent", KeyAgents.InMemory, {
  mnemonicWords,
  getPassphrase: async () => "yourSecurePassphrase"
});
```
