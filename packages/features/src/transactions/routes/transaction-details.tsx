import { useNavigate, useParams } from "react-router-dom"

import { useAccount } from "@/common/hooks/use-account"
import { useTransaction } from "@/common/hooks/use-transaction"

import { structurizeTransaction } from "../utils/structurize-transactions"
import { TransactionDetailsView } from "../views/transaction-details"

export const TransactionDetailsRoute = () => {
  const { publicKey } = useAccount()
  const navigate = useNavigate()
  const { hash } = useParams()
  if (!hash) return null
  if (!publicKey) return null
  const { data: transactionData } = useTransaction({ hash })
  const transaction =
    transactionData &&
    structurizeTransaction({
      tx: transactionData as any,
      walletPublicKey: publicKey,
    })
  if (!transaction) return null
  return (
    <TransactionDetailsView
      onGoBack={() => navigate(-1)}
      transaction={transaction}
      currentWalletAddress={publicKey}
    />
  )
}
