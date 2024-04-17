import { Blockberry } from '../../src'

const nodeUrl =
  process.env['NODE_URL'] || 'https://api.blockberry.one/mina-berkeley/'
const apiKey = process.env['API_KEY'] || '2u8a1S9H2NK1kP3olo9962qaRdr2ub' // this is a test api-key for the test-suite, not for production.

describe('Blockberry Stake Pools Provider (Functional)', () => {
  let provider: ReturnType<typeof Blockberry.createStakePoolProvider>

  beforeEach(() => {
    provider = Blockberry.createStakePoolProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', () => {
      // TODO
      //const response = await provider.healthCheck()
      expect(true).toBe(true)
    })
  })

  describe('getAccountInfo', () => {
    it('should return stake pools', async () => {
      // This test now depends on the actual response from the server
      const response = await provider.getStakePools({
        apiKey: apiKey
        // Optionally add more parameters here to refine the test
      })
      expect(response).toBeDefined()
      expect(response.length).not.toBe(0)
    })
  })
})
