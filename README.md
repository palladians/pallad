# Pallad

⚠️ Work in progress ⚠️

An experimental and progressive Mina Protocol wallet.

## Prerequisite

- [NVM](https://github.com/nvm-sh/nvm)
- Yarn

## Installation

Make sure you're on the right Node.js version and you got Yarn installed.

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
  - `api` - Backend API for chain data collection.
  - `extension` - Browser extension app.
  - `mobile` - Proof of concept of mobile wallet with code shared with browser extension.
  - `website` - pallad.xyz website.
- `packages`
  - `features` - Common codebase for the extension and mobile app.
  - `mina` - Key management and data manipulation module for Mina Protocol.
  - `ui` - UI framework based on CSS-in-JS and React Native Web.

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

## Links

[pallad.xyz - The official website of Pallad](https://pallad.xyz/)

[Ladle](https://mvr-studio.github.io/pallad/)
