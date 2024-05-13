import type { StoryDefault } from "@ladle/react"
import { Mina } from "@palladxyz/mina-core"

import { TxSide } from "@/common/types"

import { TransactionDetailsView } from "./transaction-details"

export const View = () => {
  return (
    <TransactionDetailsView
      onGoBack={() => console.log("go back")}
      transaction={{
        from: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        to: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        minaAmount: "5",
        dateTime: "2024-04-29T18:10:01Z",
        hash: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
        side: TxSide.OUTGOING,
        kind: Mina.TransactionKind.PAYMENT,
      }}
    />
  )
}

export default {
  title: "Transactions / Details",
} satisfies StoryDefault
