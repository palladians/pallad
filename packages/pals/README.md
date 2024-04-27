# @palladxyz/pals

This TypeScript library provides a convenient way to create Providers that can read data from the Pals handle service, offering a streamlined approach for integrating Pals handles into your TypeScript or JavaScript projects.

## Features

- **Simple API**: Easy-to-use API for fetching and handling data from Pals handle service.
- **TypeScript Support**: Full TypeScript support to enhance development experience with type checking and autocompletion.
- **Modular Design**: Comprised of modular components like `PalsHandleProvider` and utility functions for fetching, making it adaptable to various use cases.

## Installation

Install `@palladxyz/pals` using npm or yarn:

```bash
npm install @palladxyz/pals
# or
yarn add @palladxyz/pals
```

## Usage
To start using `@palladxyz/pals`, import the provider and initialize it with your configuration:

```ts
import { PalsHandleProvider } from '@palladxyz/pals';

const provider = new PalsHandleProvider(/* configuration options */);

// Example usage
const data = await provider.fetchData(/* parameters */);
```