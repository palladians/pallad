import { useNavigate } from "react-router-dom"

import { formatCompact } from "@/common/lib/numbers"

type BlockProducer = {
  name: string
  publicKey: string
  stake: number
  delegatorsCount: number
}

interface BlockProducerTileProps {
  producer: BlockProducer
}

export const BlockProducerTile = ({ producer }: BlockProducerTileProps) => {
  const navigate = useNavigate()
  return (
    <div
      className="flex flex-1 justify-between items-center p-2"
      onClick={() =>
        navigate("/staking/delegate", {
          state: { address: producer.publicKey },
        })
      }
    >
      <div className="flex items-center gap-4">
        <div>{producer.name?.[0]}</div>
        <div className="font-semibold">{producer.name}</div>
      </div>
      <div className="gap-1">
        <div className="font-semibold">
          {formatCompact({ value: producer.stake })} MINA
        </div>
        <div className="text-right text-sm">
          {formatCompact({ value: producer.delegatorsCount })} Delegators
        </div>
      </div>
    </div>
  )
}
