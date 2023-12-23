import { DaemonStatusGraphQLProvider } from '../../src/Providers/DaemonStatus'

const minaExplorerGql = 'https://proxy.devnet.minaexplorer.com/'

describe('DaemonStatusGraphQLProvider', () => {
  test('getDaemonStatus', async () => {
    const provider = new DaemonStatusGraphQLProvider(minaExplorerGql)
    const health = await provider.healthCheck()
    console.log('Health check:', health)
    if (!health) {
      throw new Error('Health check failed')
    }
    const response = await provider.getDaemonStatus()
    console.log('Response:', response)

    expect(response).not.toBe({ daemonSatus: { chainId: 'N/A' } })
  })
})
