import { Button, Card } from '@palladxyz/ui'
import { useNavigate } from 'react-router-dom'

import packageJson from '../../../package.json'
import Logo from '../../common/assets/logo.svg'
import { AppLayout } from '../../common/components/AppLayout'
import { MetaField } from '../../common/components/MetaField'
import { ViewHeading } from '../../common/components/ViewHeading'

const AppMeta = [
  {
    label: 'Current Version',
    value: packageJson.version
  },
  {
    label: 'Commit Hash',
    value: '9iufgds239803nf'
  }
]

export const AboutView = () => {
  const navigate = useNavigate()
  return (
    <AppLayout>
      <div className="p-4 gap-4">
        <ViewHeading
          title="About"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <Card>
          <div className="flex-row items-center gap-4">
            <Logo />
            <div className="font-semibold">Pallad</div>
          </div>
          <Button variant="link">Up to date</Button>
        </Card>
        <div className="gap-4">
          {AppMeta.map(({ label, value }) => (
            <MetaField key={label} label={label} value={value} />
          ))}
        </div>
        <div>
          <Button variant="link">Terms of Service</Button>
          <Button variant="link">Privacy Policy</Button>
        </div>
      </div>
    </AppLayout>
  )
}
