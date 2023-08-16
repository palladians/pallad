import { MinaNetwork } from '@palladxyz/key-management'
import {
  Card,
  Label,
  RadioGroup,
  RadioGroupItem,
  useToast
} from '@palladxyz/ui'
import { TrashIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { AppLayout } from '../../common/components/AppLayout'
import { ViewHeading } from '../../common/components/ViewHeading'
import { useWallet } from '../../wallet/hooks/useWallet'
import { useAppStore } from '../../wallet/store/app'

export const SettingsView = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { switchNetwork } = useWallet()
  const { setTheme, theme } = useTheme()
  const { mutate } = useSWRConfig()
  const { network } = useAppStore((state) => ({
    setNetwork: state.setNetwork,
    network: state.network
  }))
  const handleNetworkSwitch = async (value: MinaNetwork) => {
    await switchNetwork(value)
    await mutate(() => true, undefined, { revalidate: false })
    toast({
      title: `Network has been changed to ${MinaNetwork[value]}`
    })
  }
  const handleThemeSwitch = async (value: string) => {
    setTheme(value)
    toast({
      title: `Theme has been changed.`
    })
  }
  return (
    <AppLayout>
      <div className="flex flex-col flex-1 gap-6">
        <ViewHeading
          title="Settings"
          backButton={{ onClick: () => navigate(-1) }}
        />
        <div className="flex flex-col gap-2">
          <Label>Network</Label>
          <RadioGroup value={network} onValueChange={handleNetworkSwitch}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={MinaNetwork[MinaNetwork.Mainnet]}
                id="networkMainnet"
              />
              <Label htmlFor="networkMainnet">Mainnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={MinaNetwork[MinaNetwork.Devnet]}
                id="networkDevnet"
              />
              <Label htmlFor="networkDevnet">Devnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value={MinaNetwork[MinaNetwork.Berkeley]}
                id="networkBerkeley"
              />
              <Label htmlFor="networkBerkeley">Berkeley</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Theme</Label>
          <RadioGroup value={theme} onValueChange={handleThemeSwitch}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="themeLight" />
              <Label htmlFor="themeLight">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="themeDark" />
              <Label htmlFor="themeDark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="themeSystem" />
              <Label htmlFor="themeSystem">System</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex flex-col gap-4">
          <h2>Authorized Domains</h2>
          <div className="flex flex-col gap-2">
            <Card className="flex py-2 px-4 justify-between">
              <div>Pallad</div>
              <div className="flex gap-2 items-center">
                <div>pallad.xyz</div>
                <a>
                  <TrashIcon size={16} />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
