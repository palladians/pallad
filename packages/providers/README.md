# @palladxyz/providers

This TypeScript library creates Providers that can read and write (mutate) data to Mina via a set of API providers such as Obscura and Mina Explorer.

A Provider is an abstraction that encapsulates the functionality for interacting with the underlying protocol, whether by reading or mutating on-chain data or querying historical state information.

## Implementation Detail

While these providers can be used individually, they are more functional in nature than the founding `@palladxyz/mina-graphql` providers, removing the object oriented design in many of them (full set to be determined). Each provider is scoped to specifically either read, write, or listen; not focusing on specifically storing data themselves they are an abstraction for an application. In Pallad's case, the `vault` requires this abstraction as it stores the arguments for each provider.

### Provider Sources

The following is a list of APIs there are providers for:

- Mina Explorer
- Obscura
- OpenMina Node
