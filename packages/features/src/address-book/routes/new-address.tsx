import { useNavigate } from 'react-router-dom'

import { NewAddressView } from '../views/new-address'

export const NewAddressRoute = () => {
  const navigate = useNavigate()
  return <NewAddressView onGoBack={() => navigate(-1)} />
}
