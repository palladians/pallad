import { TxStatusArgs } from '@palladxyz/mina-core'

import { TxStatusGraphQLProvider } from '../../../src/mina-explorer/tx-status/TxStatusProvider'

const nodeUrl =
  process.env['NODE_URL'] || 'https://proxy.berkeley.minaexplorer.com/'
const txId =
  process.env['TX_ID'] ||
  'Av0AwusL/+cWVFkjyBFPR9rFNHta+V8q8vHbYTQ3gMyHKyXkcjQACwD//yIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/nFlRZI8gRT0faxTR7WvlfKvLx22E0N4DMhysl5HI0APyAGeuEAAAAAP/nFlRZI8gRT0faxTR7WvlfKvLx22E0N4DMhysl5HI0AIDa/ybX+NBM+IrPyZXk1uTQzqHlzzlbmr1PufF0wAQKDq/ia0vONmdHjndfjXK6Gur0JeSbVaMoxBDS9bm2iQw='
//'3XpDTU4nx8aYjtRooxkf6eqLSVdzhEE4EEDQFTGkRYZZ9uRebxCTPYfC3731PKq5zK8nAqwQE7TUtGGveMGNhBhDrycFvnXEcWA6gtStmu4h9iiXG3CkFapgu9AZAKetNVjsx5ekVyRU8W5RHkBA9r5ntL36ddtodk9SCymkZ2qLhCGjpCaxuqih3kqWq3aVFwbNL5eQVrdgnYwZwuTTBdAVnYuqxkYKEKZuGGL12eZGBdnD1W9DMicXCkryzJx4dXJRas6ZrZGFEC8mTvtHZJ6ResVANXPfWuWKQu1xr8SPecfTuyKBC1VdeUqghpuHeznjTwdpNH6KBjvYkCzAuuaDrL8XgFHNC8Ka7bLBe9UXzemmtBxzQQs9uL3dZunhPudKn5aR42a4Z9rqtHC'
console.log('Using node url:', nodeUrl)

describe('TxStatusGraphQLProvider', () => {
  test('checkTxStatus', async () => {
    const args: TxStatusArgs = {
      ID: txId
    }

    const provider = new TxStatusGraphQLProvider(nodeUrl)
    const response = await provider.checkTxStatus(args)

    expect(response).toBeDefined()
    console.log('TxStatus:', response)
    //expect(response.includes('INCLUDED')).toBe(true)
  })
})
