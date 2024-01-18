import { localNodeSyncStats } from '../../src/open-mina'

// to run this test, you must have a local node running
// https://github.com/openmina/openmina?tab=readme-ov-file#how-to-launch-without-docker-compose
describe('Open Mina Provider', () => {
  let url: string

  beforeAll(async () => {
    url = 'http://localhost:3000'
    //await startLocalNode()
  })
  test.skip('should return sync stats', async () => {
    const response = await localNodeSyncStats(url, '?limit=1')
    console.log('Open Mina Provider Response', response)
    console.log('Ledgers', response[0].ledgers)
    console.log('Blocks', response[0].blocks)
    expect(response[0]).toHaveProperty('synced')
  })
})
