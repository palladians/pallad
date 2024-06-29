import { useNavigate } from "react-router-dom"

import { fetcher } from "@/common/lib/fetch"
import useSWR from "swr"
import type { BlockProducer } from "../types"
import { BlockProducersView } from "../views/block-producers"

const STAKEPOOLS_URL = "https://pallad.co/api/stakepools.json"

type StakePoolsResponse = {
  content: BlockProducer[]
}

export const BlockProducersRoute = () => {
  const { data } = useSWR<StakePoolsResponse>(STAKEPOOLS_URL, fetcher)
  const navigate = useNavigate()
  return (
    <BlockProducersView
      onGoBack={() => navigate(-1)}
      blockProducers={data?.content ?? []}
    />
  )
}
