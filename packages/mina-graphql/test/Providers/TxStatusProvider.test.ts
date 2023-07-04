import { TxStatusArgs } from '@palladxyz/mina-core'

import { TxStatusGraphQLProvider } from '../../src/Providers/TxStatus/TxStatusProvider'

const minaExplorerGql = 'https://proxy.berkeley.minaexplorer.com/'

describe('TxStatusGraphQLProvider', () => {
  test('checkTxStatus', async () => {
    const args: TxStatusArgs = {
      ID: 'Av2A0fAIKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIAB///IgEJaGVsbG8gQm9iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIA7T0tUWn0QC4rjNdYdwavWOer0G82QQvQeGD1hbWdWAUA/ABe0LIAAAAAKkQnEWXd3/ZrYjnOrvj81fp1VewI+XZSFJ/K4O8DbTIA9s5J5NQIz0gj79a6MirRVg5mWiZlDiUROf0BwwaiKSbOkrwDcw8udShTVdTe82wO0cz4fukffXTMlMurFR7LFg=='
    }

    const provider = new TxStatusGraphQLProvider(minaExplorerGql)
    const response = await provider.checkTxStatus(args)

    expect(response).toBeDefined()
    expect(response.includes('INCLUDED')).toBe(true)
  })
})
