import { publicProcedure, router } from '../trpc'

const VALIDATORS_URL =
  'https://raw.githubusercontent.com/mvr-studio/pallad/main/apps/api/src/data/validators.json'

export const stakingRouter = router({
  index: publicProcedure.query(async () => {
    const request = await fetch(VALIDATORS_URL)
    const response = await request.json()
    return response.validators
  })
})
