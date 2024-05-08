import type { StoryDefault } from "@ladle/react"

import { TransactionsView } from "./transactions"

const transactions = [
  {
    amount: 0,
    blockHeight: 24727,
    dateTime: "2024-04-29T18:10:01Z",
    failureReason: null,
    fee: 10000000,
    from: "B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5",
    hash: "5Jts9JLTcYbq7hEZE33ipUs3URe1vWXnX1MeGsgRRVfRbHm5hRLa",
    isDelegation: true,
    kind: "STAKE_DELEGATION",
    to: "B62qpfgnUm7zVqi8MJHNB2m37rtgMNDbFNhC2DpMmmVpQt8x6gKv9Ww",
    token: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
  },
  {
    amount: 5000000000,
    blockHeight: 24726,
    dateTime: "2024-04-29T18:04:01Z",
    failureReason: null,
    fee: 10000000,
    from: "B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5",
    hash: "5Jtgrx9ZfX7mvKdtooPsPffMPxmVjSsS77gtgtCkXuWJoA9Fbn1J",
    isDelegation: false,
    kind: "PAYMENT",
    to: "B62qkYa1o6Mj6uTTjDQCob7FYZspuhkm4RRQhgJg9j4koEBWiSrTQrS",
    token: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
  },
  {
    amount: 50000000000,
    blockHeight: 24725,
    dateTime: "2024-04-29T18:01:01Z",
    failureReason: null,
    fee: 100000000,
    from: "B62qjJQ8Up2zUVgax2PwoYyDJ4mTq8japh9vt3gBoBWY5ubN7m2yuTf",
    hash: "5JvJe82RC83TtVFNv37goCrD92RvkD8GofWqNkStBzefXYXubvYn",
    isDelegation: false,
    kind: "PAYMENT",
    to: "B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5",
    token: "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf",
  },
]

export const View = () => (
  <TransactionsView
    fiatPrice={4}
    pendingHashes={[transactions[0].hash]}
    publicKey="B62qizYjLtUebFFQuAnPjpLrUdWx4rLnptvzbVdNpY6EXff2U68Ljf5"
    transactions={transactions}
    transactionsError={false}
  />
)

export default {
  title: "Transactions",
} satisfies StoryDefault
