import { useNavigate } from "react-router-dom"

import { formatCompact } from "@/common/lib/numbers"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

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
    <Card
      className="flex flex-1 justify-between items-center p-2"
      onClick={() =>
        navigate("/staking/delegate", {
          state: { address: producer.publicKey },
        })
      }
    >
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{producer.name?.[0]}</AvatarFallback>
        </Avatar>
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
    </Card>
  )
}
