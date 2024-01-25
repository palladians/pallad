import { http, HttpResponse } from 'msw'

export const handlers = [
  // Mock GET request to /address/:handle
  http.get('/address/$teddy', () => {
    return HttpResponse.json({
      address: 'B62qs2mR2g7LB27P36MhxN5jnsnjS8t6azttZfCnAToVpCmTtRVT2nt'
    })
  }),

  // Mock GET request to /search
  http.get('/search', () => {
    return HttpResponse.json([
      'Address1',
      'Address2',
      'Address3',
      'Address4',
      'Address5'
    ])
  }),

  // Mock GET request to /health
  http.get('/health', () => {
    return HttpResponse.json('Server is healthy')
  })
]
