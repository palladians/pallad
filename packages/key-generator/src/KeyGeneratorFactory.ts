import { EVMKeyGenerator } from './evm'
import { KeyGenerator } from './keyGenerator'
import { MinaKeyGenerator } from './mina'
import { Network } from './types'

export class KeyGeneratorFactory {
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
