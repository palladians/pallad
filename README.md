# Pallad
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)
[![Discord](https://img.shields.io/discord/1127906495409958953?label=Discord)](https://discord.gg/ExzzfTGUnB)
![example workflow](https://github.com/palladians/pallad/actions/workflows/apps-extension-ci.yml/badge.svg)

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

## Contributors ✨

Thanks goes to these wonderful people
([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<a href="https://github.com/palladians/pallad/graphs/contributors">
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/mrcnk"><img src="https://avatars.githubusercontent.com/u/16132011?v=4?s=100" width="100px;" alt="Tomek Marciniak"/><br /><sub><b>Tomek Marciniak</b></sub></a><br /><a href="https://github.com/palladians/pallad/commits?author=mrcnk" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/teddyjfpender"><img src="https://avatars.githubusercontent.com/u/92999717?v=4?s=100" width="100px;" alt="Teddy Pender"/><br /><sub><b>Teddy Pender</b></sub></a><br /><a href="https://github.com/palladians/pallad/commits?author=teddyjfpender" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
</a>

## Links

[pallad.xyz - The official website of Pallad](https://pallad.xyz/)

[Ladle](https://palladians.github.io/pallad/)
