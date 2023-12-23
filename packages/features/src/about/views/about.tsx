import { useNavigate } from 'react-router-dom'

import Logo from '@/common/assets/logo.svg'
import { AppLayout } from '@/components/app-layout'
import { MetaField } from '@/components/meta-field'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ViewHeading } from '@/components/view-heading'

import packageJson from '../../../package.json'

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
      <div className="flex flex-col flex-1">
        <ViewHeading
          title="About"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col gap-4 flex-1 p-4">
          <Card className="flex gap-4 p-4 justify-between rounded-[1rem]">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="font-semibold">Pallad</div>
            </div>
            <Button variant="outline" disabled>
              Up to date
            </Button>
          </Card>
          <Card className="flex flex-col gap-4 p-4 rounded-[1rem]">
            {AppMeta.map(({ label, value }) => (
              <MetaField key={label} label={label} value={value} />
            ))}
          </Card>
          <Card className="flex flex-col items-start rounded-[1rem]">
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
      </div>
    </AppLayout>
  )
}
