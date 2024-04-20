import { fetchGetJSON } from '../utils'

export type StakePoolRequestArgs = {
  apiKey: string
  page?: number
  size?: number
  orderBy?: 'ASC' | 'DESC'
  sortBy?: string
  type?: string
  isNotAnonymousOnly?: boolean
  isWithFeeOnly?: boolean
  isVerifiedOnly?: boolean
  searchStr?: string
}

export type StakePoolData = {
  validatorAddress: string
  validatorName: string | null
  validatorFee: number
  delegatorsCount: number
  terms: string | null
  additionalTerms: string | null
  stake: number
  nextEpochStake: number
  nextEpochDelegationsCount: number | null
  epoch2Stake: number | null
  epoch2DelegationsCount: number | null
  stakePercent: number
  networkShare: number
  canonicalBlocksCount: number
  allBlocksCount: number
  isVerified: boolean
  isActive: boolean
  diffStake: number
  diffDelegatorsCount: number
  socialDiscord: string | null
  discordNicknames: string | null
  socialTelegram: string | null
  socialTwitter: string | null
  socialEmail: string | null
  socialGitHub: string | null
  website: string | null
  validatorImg: string | null
  description: string | null
  isStakingRewardsVerified: boolean | null
  stakingRewardsSlug: string | null
}

export type StakePoolProvider = {
  getStakePools(args: StakePoolRequestArgs): Promise<StakePoolData[]>
  healthCheck(): Promise<unknown>
}

export const createStakePoolProvider = (baseUrl: string): StakePoolProvider => {
  const getStakePools = async (
    args: StakePoolRequestArgs
  ): Promise<StakePoolData[]> => {
    const queryParams = new URLSearchParams({
      page: (args.page ?? 0).toString(),
      size: (args.size ?? 20).toString(),
      orderBy: args.orderBy ?? 'DESC',
      sortBy: args.sortBy ?? 'STAKE',
      type: args.type ?? 'ALL',
      isNotAnonymousOnly: args.isNotAnonymousOnly?.toString() ?? 'false',
      isWithFeeOnly: args.isWithFeeOnly?.toString() ?? 'false',
      isVerifiedOnly: args.isVerifiedOnly?.toString() ?? 'false',
      searchStr: args.searchStr ?? ''
    }).toString()

    const fullUrl = `${baseUrl}v1/validators?${queryParams}`
    const headers = {
      accept: 'application/json',
      'x-api-key': args.apiKey
    }
    const response = await fetchGetJSON(fullUrl, headers)

    if (response.ok) {
      return response.data.data
    } else {
      throw new Error(`Failed to fetch stake pools:', ${response.message}`)
    }
  }

  const healthCheck = async (): Promise<unknown> => {
    // Implement a health check if applicable
    // TODO
    return await fetchGetJSON(`${baseUrl}v1/health`, {})
  }

  return {
    getStakePools,
    healthCheck
  }
}
