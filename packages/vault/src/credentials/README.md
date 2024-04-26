# Credential Store

## Overview
This module defines a state management slice for handling key agent credentials (`GroupedCredentials`) in Palld with a Zustand store, facilitating operations such as ensuring, setting, getting, removing, searching, and clearing credentials. It uses the Immer library to handle immutable state updates. Note this store is only for key agent credentials and NOT identity credentials. Identity credentials are scoped within the Objects slice.

## Files

- `credential-store.ts`: Contains the Zustand store slice with methods for managing credentials.
- `credential-state.ts`: Defines types and initial states for the credentials managed in the store.

## Key Functions

### ensureCredential
- **Purpose**: Ensures a credential is initialized if it does not already exist.
- **Parameters**:
  - `credentialName`: The unique name for the credential.
  - `keyAgentName`: The name of the key agent associated with the credential.

### setCredential
- **Purpose**: Updates or sets the state of a specific credential.
- **Parameters**:
  - `credentialState`: The state object of the credential.

### getCredential
- **Purpose**: Retrieves a credential by name.
- **Parameters**:
  - `credentialName`: The name of the credential to retrieve.

### removeCredential
- **Purpose**: Removes a credential from the store.
- **Parameters**:
  - `credentialName`: The name of the credential to remove.

### searchCredentials
- **Purpose**: Searches credentials based on a query and optional properties filter.
- **Parameters**:
  - `query`: Search conditions to match credentials.
  - `props`: Optional array of properties to return in the search results.

### clear
- **Purpose**: Clears all credentials from the store.
