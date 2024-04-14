import { useLocation, useNavigate } from 'react-router-dom'

import { TransactionSuccessView } from '../views/transaction-success'

export const TransactionSuccessRoute = () => {
  const navigate = useNavigate()
  const { state } = useLocation()
  return (
    <TransactionSuccessView
      hash={state.hash}
      onGoToTransactions={() => navigate(`/transactions`)}
    />
  )
}
