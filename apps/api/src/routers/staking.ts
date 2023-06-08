import validatorsData from '../data/validators.json'
import { publicProcedure, router } from '../trpc'

export const stakingRouter = router({
  index: publicProcedure.query(() => {
    return validatorsData.validators
  })
})
