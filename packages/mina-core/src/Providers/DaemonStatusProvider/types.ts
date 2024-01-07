import { Provider } from '../..'

export interface DaemonStatus {
  daemonStatus: {
    chainId: string
  }
}

export interface DaemonStatusProvider extends Provider {
  /**
   * Gets the daemon status.
   *
   * @returns {DaemonStatus} - An object with daemon status information
   */
  getDaemonStatus: () => Promise<DaemonStatus>
}
