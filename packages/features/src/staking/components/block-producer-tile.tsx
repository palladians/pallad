import PlaceholderImage from "@/common/assets/placeholder.svg?react"
import { useNavigate } from "react-router-dom"

import { formatCompact } from "@/common/lib/numbers"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import type { BlockProducer } from "../types"

const Avatar = ({
  img,
  name,
  setShowPlaceholder,
}: {
  img: string | undefined
  name: string
  setShowPlaceholder: (show: boolean) => void
}) => {
  if (!img) return <PlaceholderImage width={24} height={24} />
  return (
    <img
      src={img}
      alt={name}
      onError={() => setShowPlaceholder(true)}
      className="rounded-full"
    />
  )
}

interface BlockProducerTileProps {
  producer: BlockProducer
}

export const BlockProducerTile = ({ producer }: BlockProducerTileProps) => {
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <button
      type="button"
      className="card bg-secondary flex flex-row justify-between items-center p-2"
      onClick={() =>
        navigate("/staking/delegate", {
          state: { address: producer.pk },
        })
      }
    >
      <div className="flex flex-1 gap-4 items-center">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content w-12 rounded-full">
            {showPlaceholder ? (
              <PlaceholderImage width={24} height={24} />
            ) : (
              <Avatar
                img={producer.img}
                name={producer.name ?? producer.pk}
                setShowPlaceholder={setShowPlaceholder}
              />
            )}
          </div>
        </div>
        <div className="font-semibold flex-1 truncate text-left break-all max-w-[7rem] w-full">
          {producer.name ?? producer.pk}
        </div>
      </div>
      <div className="gap-1">
        <div className="font-semibold">
          {formatCompact({ value: producer.amountStaked })} MINA
        </div>
        <div className="text-right text-sm">
          {formatCompact({ value: producer.delegators })} {t("delegators")}
        </div>
      </div>
    </button>
  )
}
