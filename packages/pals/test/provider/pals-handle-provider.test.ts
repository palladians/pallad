import { createPalsHandleProvider } from '../../src'
const url = process.env['PALS_SERVER_ENDPOINT'] || ''

describe('createPalsHandleProvider', () => {
  it('should create a pals handle provider', () => {
    const palsHandleProvider = createPalsHandleProvider(url)
    expect(palsHandleProvider).toBeDefined()
  })
  it('should get an address from a handle', async () => {
    const palsHandleProvider = createPalsHandleProvider(url)
    const result = await palsHandleProvider.getAddressFromHandle({
      handle: '$teddy'
    })
    console.log('Address result', result)
    expect(result.address).toBe(
      'B62qs2mR2g7LB27P36MhxN5jnsnjS8t6azttZfCnAToVpCmTtRVT2nt'
    )
  })
  it('should check health of Pals Handle Provider', async () => {
    const palsHandleProvider = createPalsHandleProvider(url)
    const result = await palsHandleProvider.healthCheck()
    expect(result.ok).toBe(true)
    expect(result.message).toBe('Server is healthy')
  })
  it('should get a list of addresses from a partial handle', async () => {
    const palsHandleProvider = createPalsHandleProvider(url)
    const result = await palsHandleProvider.getSearchedHandles({ handle: '$' })
    console.log('Search result', result)
    expect(result.addresses).toHaveLength(5)
  })
})
