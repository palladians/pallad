import { useNavigate } from 'react-router-dom'

import { StayConnectedView } from '../views/stay-connected'

export const StayConnectedRoute = () => {
  const navigate = useNavigate()
  return <StayConnectedView onGoToDashboard={() => navigate('/dashboard')} />
}
