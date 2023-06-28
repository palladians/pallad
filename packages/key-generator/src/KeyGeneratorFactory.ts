import { EVMKeyGenerator } from './evm'
import { KeyGenerator } from './keyGenerator'
import { MinaKeyGenerator } from './mina'
import { Network } from './types'

/**
 * KeyGeneratorFactory is a factory class responsible for creating key generators
 * for different networks.
 *
 * @remarks
 * This class is part of the {@link @pallad/key-generator | pallad key-generator package}.
 *
 * @public
 */
export class KeyGeneratorFactory {
  /**
   * Creates a KeyGenerator instance based on the provided network type.
   *
   * @remarks
   * It supports key generators for the Mina, Ethereum, and Polygon networks.
   * For Ethereum and Polygon, it uses the EVM key generator.
   * If an unsupported network type is provided, it throws an error.
   *
   * @param network - The network type for which the key generator is to be created
   * @returns A KeyGenerator instance specific to the provided network type
   *
   * @throws `Unsupported network: ${network}` - If an unsupported network type is provided
   *
   * @public
   */
  public static create(network: Network): KeyGenerator {
    switch (network) {
      case Network.Mina:
        return new MinaKeyGenerator()
      case Network.Ethereum:
      case Network.Polygon:
        return new EVMKeyGenerator()
      default:
        throw new Error(`Unsupported network: ${network}`)
    }
  }
}
