import type { Mina } from "@palladxyz/mina-core"
import type { Address, GetTransactionReturnType, Hash } from "viem"

export type TransactionHash = Mina.TxId[] | Hash[]
export type TxHash = Mina.TxId[] | Hash[]
export type Tx = Mina.TransactionBody | GetTransactionReturnType
export type ChainAddress = Mina.PublicKey | Address
export enum Network {
  Mina = "Mina",
}
