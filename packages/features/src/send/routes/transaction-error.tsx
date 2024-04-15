import { useNavigate } from 'react-router-dom'

import { TransactionErrorView } from '../views/transaction-error'

export const TransactionErrorRoute = () => {
  const navigate = useNavigate()
  return <TransactionErrorView onGoBack={() => navigate(-1)} />
}
