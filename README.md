# Pallad

⚠️ Work in progress ⚠️

An experimental and progressive Mina Protocol wallet.

## Prerequisite

- [NVM](https://github.com/nvm-sh/nvm)
- Yarn

## Installation

Make sure you're on the right Node.js version, and you got Yarn installed.

```shell
$ nvm use
$ npm i -g yarn
```

Install the dependencies:

```shell
$ yarn
```

From `apps/extension` copy the `.env.example` as `.env` and adjust the variables there.

Build all the modules in repo:

```shell
$ yarn build
```

## Structure

This is a monorepo for all the Pallad-related code.

- `apps`
  - `extension` - Browser extension app.
  - `website` - pallad.xyz website.
- `packages`
  - `_template` - Template to follow for new packages in this repo.
  - `common` - Common configuration for packages (tsup and vitest).
  - `features` - Common codebase for the extension.
  - `key-management-agnostic` - Blockchain agnostic key management.
  - `mina-core` - Core Mina Package SDK.
  - `mina-graphql` - GraphQL API client for the Mina Protocol.
  - `mina-wallet` - Wrapper package for Mina Protocol wallets.
  - `offchain-data` - Client for fetching off-chain data like fiat price.
  - `persistence` - Persistence logic for wallet related data.
  - `ui` - UI framework based on shadcn/ui and Tailwind.
  - `util` - Shared util functions for other packages.
  - `vault` - Credentials storage.

## Development

Set up the dev server of extension:

```shell
$ yarn dev:extension
```

## Testing

Running linter:

```shell
$ yarn lint
```

Running unit tests (Vitest):

```shell
$ yarn test:unit
```

Running E2E tests for browser extension (Playwright):

```shell
$ npx playwright install chromium # make sure you have Chromium driver
$ yarn test:e2e:extension
```

## Contributors

<a href="https://github.com/palladians/pallad/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=palladians/pallad" />
</a>

Made with [contrib.rocks](https://contrib.rocks).

## Links

[pallad.xyz - The official website of Pallad](https://pallad.xyz/)

[Ladle](https://palladians.github.io/pallad/)
