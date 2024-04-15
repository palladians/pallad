import { useNavigate } from 'react-router-dom'

import { SendView } from '../views/send'

export const SendRoute = () => {
  const navigate = useNavigate()
  return <SendView onGoBack={() => navigate(-1)} />
}
