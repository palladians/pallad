import { Provider } from '../..'

/*export interface DaemonStatus {
  daemonStatus: {
    chainId: string
  }
}*/

export interface NodeStatus {
  // todo remove `daemonStatus`
  daemonStatus: {
    chainId: string
  }
}

export interface NodeStatusProvider extends Provider {
  /**
   * Gets the node status.
   *
   * @returns {NodeStatus} - An object with node status information
   */
  getNodeStatus: () => Promise<NodeStatus>
}
