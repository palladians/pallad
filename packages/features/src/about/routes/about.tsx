import { useNavigate } from 'react-router-dom'

import { AboutView } from '../views/about'

export const AboutRoute = () => {
  const navigate = useNavigate()
  return <AboutView onGoBack={() => navigate(-1)} />
}
