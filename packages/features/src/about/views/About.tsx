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
      <div className="flex flex-col flex-1 gap-4">
        <ViewHeading
          title="About"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <Card className="flex gap-4 p-4 justify-between">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="font-semibold">Pallad</div>
          </div>
          <Button variant="outline" disabled>
            Up to date
          </Button>
        </Card>
        <Card className="flex flex-col gap-4 p-4">
          {AppMeta.map(({ label, value }) => (
            <MetaField key={label} label={label} value={value} />
          ))}
        </Card>
        <Card className="flex flex-col items-start">
          <Button variant="link">
            <a
              href="https://pallad.xyz"
              target="_blank"
              rel="noreferrer noopener"
            >
              pallad.xyz
            </a>
          </Button>
          <Button variant="link">Terms of Service</Button>
          <Button variant="link">Privacy Policy</Button>
        </Card>
      </div>
    </AppLayout>
  )
}
