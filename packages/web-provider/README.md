# @palladxyz/web-extension

🚧 This package is a WIP 🚧

This package has been heavily inspired by the [WalletConnect Monorepo](https://github.com/WalletConnect/walletconnect-monorepo).

This is a typescript package that allows applications to interact with the wallet.

## Current Design (POC)
`UniversalProvider` is the primary class that allows users to interact with a specific chain-provider, currently there is only `MinaProvider` which is an EIP-1193-like provider for Pallad and abstracts over the `vault` using `VaultService` that can fetch wallet or network information but also perform wallet specific operations (like signing) all with prompting the user for permission.

## Example Flow
`UniversalProvider` --> `{chain}Provider` --> `VaultService`