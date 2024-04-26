import { useNavigate } from "react-router-dom"

import { BlockProducersView } from "../views/block-producers"

const MOCKED_PRODUCERS = [
  {
    name: "Pallad",
    publicKey: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
    stake: 24000,
    delegatorsCount: 6000,
  },
  {
    name: "Pallad 2",
    publicKey: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
    stake: 12000,
    delegatorsCount: 3000,
  },
]

export const BlockProducersRoute = () => {
  const navigate = useNavigate()
  return (
    <BlockProducersView
      onGoBack={() => navigate(-1)}
      blockProducers={MOCKED_PRODUCERS}
    />
  )
}
