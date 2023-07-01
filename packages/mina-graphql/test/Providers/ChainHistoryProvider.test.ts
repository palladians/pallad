import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { ChainHistoryGraphQLProvider } from './ChainHistoryGraphQLProvider'
import {
  HealthCheckResponseData,
  TransactionsByAddressesArgs,
  TransactionsByIdsArgs,
} from '@palladxyz/mina-core'

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('ChainHistoryGraphQLProvider', () => {
  const minaExplorerGql = 'http://localhost:4000'

  test('healthCheck', async () => {
    const expectedData: HealthCheckResponseData = {
      __schema: {
        types: [
          { name: 'type1' },
          { name: 'type2' },
        ],
      },
    }

    server.use(
      rest.post(minaExplorerGql, (req, res, ctx) => {
        return res(ctx.json(expectedData))
      })
    )

    const provider = new ChainHistoryGraphQLProvider(minaExplorerGql)
    const response = await provider.healthCheck()

    expect(response).toEqual({ ok: true })
  })

  test('transactionsByAddresses', async () => {
    const args: TransactionsByAddressesArgs = {
      addresses: ['address1'],
      pagination: { startAt: 0, limit: 10 },
    }

    const expectedData = { transactions: ['transaction1', 'transaction2'] }

    server.use(
      rest.post(minaExplorerGql, (req, res, ctx) => {
        return res(ctx.json(expectedData))
      })
    )

    const provider = new ChainHistoryGraphQLProvider(minaExplorerGql)
    const response = await provider.transactionsByAddresses(args)

    expect(response).toEqual({
      pageResults: ['transaction1', 'transaction2'],
      totalResultCount: 2,
    })
  })

  test('transactionsByHashes', async () => {
    const args: TransactionsByIdsArgs = { ids: ['id1', 'id2'] }

    const expectedData = { transaction: 'transaction1' }

    server.use(
      rest.post(minaExplorerGql, (req, res, ctx) => {
        return res(ctx.json(expectedData))
      })
    )

    const provider = new ChainHistoryGraphQLProvider(minaExplorerGql)
    const response = await provider.transactionsByHashes(args)

    expect(response).toEqual(['transaction1', 'transaction1'])
  })
})
